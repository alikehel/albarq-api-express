import { AdminRole, EmployeeRole, Governorate, Order, ReportStatus, ReportType } from "@prisma/client";
import { Request } from "express";
import { AppError } from "../../lib/AppError";
import { loggedInUserType } from "../../types/user";
import { EmployeeModel } from "../employees/employee.model";
import sendNotification from "../notifications/helpers/sendNotification";
import { OrderModel } from "../orders/order.model";
import { OrderTimelineType } from "../orders/orders.zod";
import { generateReport } from "./helpers/generateReportTemp";
import { ReportRepository } from "./report.repository";
import { ReportCreateType } from "./reports.zod";

const reportRepository = new ReportRepository();
const orderModel = new OrderModel();
const employeeModel = new EmployeeModel();

export class ReportService {
    async createReport(
        companyID: number,
        data: {
            loggedInUser: {
                id: number;
                name: string;
                role: string;
            };
            reportData: ReportCreateType;
        }
    ) {
        const orders = await orderModel.getOrdersByIDs(data.reportData);

        if (!orders) {
            throw new AppError("لا يوجد طلبات لعمل الكشف", 400);
        }

        const reportMetaData = {
            baghdadOrdersCount: 0,
            governoratesOrdersCount: 0,
            totalCost: 0,
            paidAmount: 0,
            deliveryCost: 0,
            clientNet: 0,
            deliveryAgentNet: 0,
            companyNet: 0
        };

        for (const order of orders) {
            // @ts-expect-error Fix later
            reportMetaData.totalCost += +order.totalCost;
            // @ts-expect-error Fix later
            reportMetaData.paidAmount += +order.paidAmount;
            // @ts-expect-error Fix later
            reportMetaData.deliveryCost += +order.deliveryCost;
            // @ts-expect-error Fix later
            reportMetaData.clientNet += +order.clientNet;
            // @ts-expect-error Fix later
            reportMetaData.deliveryAgentNet += order.deliveryAgent
                ? // @ts-expect-error Fix later
                  +order.deliveryAgent.deliveryCost
                : 0;
            // @ts-expect-error Fix later
            reportMetaData.companyNet += +order.companyNet;
            // @ts-expect-error Fix later
            if (order.governorate === "BAGHDAD") {
                reportMetaData.baghdadOrdersCount++;
            } else {
                reportMetaData.governoratesOrdersCount++;
            }
        }

        if (data.reportData.type === ReportType.CLIENT) {
            for (const order of orders) {
                if (order?.clientReport) {
                    throw new AppError(
                        // @ts-expect-error Fix later
                        `الطلب ${order.receiptNumber} يوجد في كشف عملاء اخر رقمه ${order.clientReport.reportNumber}`,
                        400
                    );
                }
                // TODO
                // if (
                //     data.reportData.type === ReportType.CLIENT &&
                //     order.clientId !== data.reportData.clientID
                // ) {
                //     throw new AppError(
                //         `الطلب ${order.receiptNumber} ليس مرتبط بالعميل ${data.reportData.clientID}`,
                //         400
                //     );
                // }
            }
        } else if (data.reportData.type === ReportType.REPOSITORY) {
            for (const order of orders) {
                if (order?.repositoryReport) {
                    throw new AppError(
                        // @ts-expect-error Fix later
                        `الطلب ${order.receiptNumber} يوجد في كشف مخازن اخر رقمه ${order.repositoryReport.reportNumber}`,
                        400
                    );
                }
            }
        } else if (data.reportData.type === ReportType.BRANCH) {
            for (const order of orders) {
                if (order?.branchReport) {
                    throw new AppError(
                        // @ts-expect-error Fix later
                        `الطلب ${order.receiptNumber} يوجد في كشف فروع اخر رقمه ${order.branchReport.reportNumber}`,
                        400
                    );
                }
            }
        } else if (data.reportData.type === ReportType.GOVERNORATE) {
            for (const order of orders) {
                if (order?.governorateReport) {
                    throw new AppError(
                        // @ts-expect-error Fix later
                        `الطلب ${order.receiptNumber} يوجد في كشف محافظة اخر رقمه ${order.governorateReport.reportNumber}`,
                        400
                    );
                }
            }
        } else if (data.reportData.type === ReportType.DELIVERY_AGENT) {
            for (const order of orders) {
                if (order?.deliveryAgentReport) {
                    throw new AppError(
                        // @ts-expect-error Fix later
                        `الطلب ${order.receiptNumber} يوجد في كشف مندوبين اخر رقمه ${order.deliveryAgentReport.reportNumber}`,
                        400
                    );
                }
            }
        } else if (data.reportData.type === ReportType.COMPANY) {
            for (const order of orders) {
                if (order?.companyReport) {
                    throw new AppError(
                        // @ts-expect-error Fix later
                        `الطلب ${order.receiptNumber} يوجد في كشف شركة اخر رقمه ${order.companyReport.reportNumber}`,
                        400
                    );
                }
            }
        }

        const report = await reportRepository.createReport(
            companyID,
            data.loggedInUser.id,
            data.reportData,
            reportMetaData
        );

        if (!report) {
            throw new AppError("حدث خطأ اثناء عمل الكشف", 500);
        }

        const reportData = await reportRepository.getReport({
            reportID: report.id
        });

        // Send notification to client if report type is client report
        if (data.reportData.type === ReportType.CLIENT) {
            await sendNotification({
                title: "تم انشاء كشف جديد",
                content: `تم انشاء كشف جديد برقم ${reportData?.id}`,
                userID: reportData?.clientReport?.client.id as number
            });
        }

        // Send notification to delivery agent if report type is delivery agent report
        if (data.reportData.type === ReportType.DELIVERY_AGENT) {
            await sendNotification({
                title: "تم انشاء كشف جديد",
                content: `تم انشاء كشف جديد برقم ${reportData?.id}`,
                userID: reportData?.deliveryAgentReport?.deliveryAgent.id as number
            });
        }

        // update orders timeline
        for (const order of orders) {
            // @ts-expect-error Fix later
            const oldTimeline: OrderTimelineType = order?.timeline;
            await orderModel.updateOrderTimeline({
                // @ts-expect-error Fix later
                orderID: order.id,
                timeline: [
                    // @ts-expect-error Fix later
                    ...oldTimeline,
                    {
                        type: "REPORT_CREATE",
                        reportType: data.reportData.type,
                        reportID: report.id,
                        // @ts-expect-error Fix later
                        date: reportData.createdAt,
                        by: {
                            id: data.loggedInUser.id,
                            name: data.loggedInUser.name,
                            // @ts-expect-error Fix later
                            role: data.loggedInUser.role
                        }
                    }
                ]
            });
        }

        // TODO
        const pdf = await generateReport(data.reportData.type, reportData, orders);
        // const pdf = await generateReport(
        //     await orderModel.getAllOrders(0, 100, {
        //         sort: "receiptNumber:desc"
        //     })
        // );

        return pdf;
    }

    async getAllReports(data: {
        queryString: Request["query"];
        loggedInUser: loggedInUserType;
    }) {
        // Filters
        let company: number | undefined;
        if (Object.keys(AdminRole).includes(data.loggedInUser.role)) {
            company = data.queryString.company ? +data.queryString.company : undefined;
        } else if (data.loggedInUser.companyID) {
            company = data.loggedInUser.companyID;
        }

        const sort = (data.queryString.sort as string) || "id:asc";

        const startDate = data.queryString.start_date
            ? new Date(data.queryString.start_date as string)
            : undefined;
        const endDate = data.queryString.end_date ? new Date(data.queryString.end_date as string) : undefined;

        const status = data.queryString.status?.toString().toUpperCase() as ReportStatus | undefined;
        const type = data.queryString.type?.toString().toUpperCase() as ReportType | undefined;

        let branch: number | undefined;
        if (data.loggedInUser.role === EmployeeRole.BRANCH_MANAGER) {
            const employee = await employeeModel.getEmployee({ employeeID: data.loggedInUser.id });
            branch = employee?.branch?.id;
        } else if (data.queryString.branch) {
            branch = +data.queryString.branch;
        } else {
            branch = undefined;
        }

        let clientID: number | undefined;
        if (data.loggedInUser.role === "CLIENT" || data.loggedInUser.role === "CLIENT_ASSISTANT") {
            clientID = +data.loggedInUser.id;
        } else if (data.queryString.client_id) {
            clientID = +data.queryString.client_id;
        } else {
            clientID = undefined;
        }
        const companyID = data.queryString.company_id ? +data.queryString.company_id : undefined;
        const storeID = data.queryString.store_id ? +data.queryString.store_id : undefined;
        const repositoryID = data.queryString.repository_id ? +data.queryString.repository_id : undefined;
        const branchID = data.queryString.branch_id ? +data.queryString.branch_id : undefined;

        let deliveryAgentID: number | undefined;
        if (data.loggedInUser.role === EmployeeRole.DELIVERY_AGENT) {
            deliveryAgentID = +data.loggedInUser.id;
        } else if (data.queryString.delivery_agent_id) {
            deliveryAgentID = +data.queryString.delivery_agent_id;
        } else {
            deliveryAgentID = undefined;
        }

        const createdByID = data.queryString.created_by_id ? +data.queryString.created_by_id : undefined;

        const governorate = data.queryString.governorate?.toString().toUpperCase() as Governorate | undefined;

        const deleted = data.queryString.deleted?.toString() || "false";

        const filters = {
            sort: sort,
            startDate: startDate,
            endDate: endDate,
            status: status,
            type: type,
            branchID: branchID,
            branch: branch,
            clientID: clientID,
            storeID: storeID,
            repositoryID: repositoryID,
            deliveryAgentID: deliveryAgentID,
            governorate: governorate,
            companyID: companyID,
            company: company,
            createdByID: createdByID,
            deleted: deleted
        };

        const reportsCount = await reportRepository.getReportsCount(filters);
        let size = data.queryString.size ? +data.queryString.size : 10;
        if (size > 50) {
            size = 10;
        }
        const pagesCount = Math.ceil(reportsCount / size);

        if (pagesCount === 0) {
            // res.status(200).json({
            //     status: "success",
            //     page: 1,
            //     pagesCount: 1,
            //     data: []
            // });
            return { pagesCount };
        }

        let page = 1;
        if (data.queryString.page && !Number.isNaN(+data.queryString.page) && +data.queryString.page > 0) {
            page = +data.queryString.page;
        }
        if (page > pagesCount) {
            throw new AppError("Page number out of range", 400);
        }
        const take = page * size;
        const skip = (page - 1) * size;
        // if (Number.isNaN(offset)) {
        //     skip = 0;
        // }

        const { reports, reportsMetaData } = await reportRepository.getAllReports(skip, take, filters);

        return { page, pagesCount, reports, reportsMetaData };
    }

    async getReport(data: { reportID: number }) {
        const report = await reportRepository.getReport({
            reportID: data.reportID
        });

        return report;
    }

    async getReportPDF(data: { reportID: number }) {
        const reportData = await reportRepository.getReport({
            reportID: data.reportID
        });

        // TODO: fix this
        // @ts-expect-error Fix later
        const orders: Order[] = reportData?.repositoryReport
            ? // @tts-expect-error: Unreachable code error
              reportData?.repositoryReport.repositoryReportOrders
            : reportData?.branchReport
              ? // @tts-expect-error: Unreachable code error
                  reportData?.branchReport.branchReportOrders
              : reportData?.clientReport
                  ? // @tts-expect-error: Unreachable code error
                      reportData?.clientReport.clientReportOrders
                  : reportData?.deliveryAgentReport
                      ? // @tts-expect-error: Unreachable code error
                          reportData?.deliveryAgentReport.deliveryAgentReportOrders
                      : reportData?.governorateReport
                          ? // @tts-expect-error: Unreachable code error
                              reportData?.governorateReport.governorateReportOrders
                          : reportData?.companyReport
                              ? // @tts-expect-error: Unreachable code error
                                  reportData?.companyReport.companyReportOrders
                              : [];

        const ordersIDs = orders.map((order) => order.id);

        const ordersData = await orderModel.getOrdersByIDs({
            ordersIDs: ordersIDs
        });

        const pdf = await generateReport(
            // @ts-expect-error Fix later
            reportData.type,
            reportData,
            ordersData
        );
        return pdf;
    }

    // updateReport = catchAsync(async (req, res) => {
    //     const reportID = +req.params["reportID"];
    //    const loggedInUser: loggedInUserType = res.locals.user;

    //     const reportData = ReportUpdateSchema.parse(req.body);

    //     if (
    //         reportData.confirmed === false &&
    //         loggedInUser.role !== "ADMIN"
    //     ) {
    //         throw new AppError("لا يمكنك إلغاء تأكيد التقرير", 400);
    //     }

    //     const report = await reportRepository.updateReport({
    //         reportID: reportID,
    //         reportData: reportData
    //     });

    //     res.status(200).json({
    //         status: "success",
    //         data: report
    //     });
    // });

    async updateReport(data: {
        reportID: number;
        loggedInUser: {
            id: number;
            name: string;
            role: string;
        };
        reportData: {
            status: ReportStatus;
            confirmed?: boolean;
        };
    }) {
        const reportID = data.reportID;
        const loggedInUser = data.loggedInUser;

        const reportData = data.reportData;

        if (
            reportData.confirmed === false &&
            (loggedInUser.role === "CLIENT" || loggedInUser.role === "CLIENT_ASSISTANT")
        ) {
            throw new AppError("لا يمكنك إلغاء تأكيد التقرير", 400);
        }

        const report = await reportRepository.updateReport({
            reportID: reportID,
            reportData: reportData
        });

        return report;
    }

    async deleteReport(reportID: number) {
        await reportRepository.deleteReport({
            reportID: reportID
        });
    }

    async deactivateReport(reportID: number, loggedInUserID: number) {
        await reportRepository.deactivateReport({
            reportID: reportID,
            deletedByID: loggedInUserID
        });
    }

    async reactivateReport(reportID: number) {
        await reportRepository.reactivateReport({
            reportID: reportID
        });
    }
}
