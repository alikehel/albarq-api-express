import { Prisma } from "@prisma/client";
import { prisma } from "../../database/db";
import { CompanyCreateType, CompanyUpdateType } from "./companies.zod";

const companySelect = {
    id: true,
    name: true,
    phone: true,
    website: true,
    logo: true,
    color: true,
    registrationText: true,
    governoratePrice: true,
    deliveryAgentFee: true,
    baghdadPrice: true,
    additionalPriceForEvery500000IraqiDinar: true,
    additionalPriceForEveryKilogram: true,
    additionalPriceForRemoteAreas: true,
    orderStatusAutomaticUpdate: true,
    treasury: true
} satisfies Prisma.CompanySelect;

// const companyReform = (company: any) => {
//     return {
//         id: company.id,
//         name: company.name,
//         phone: company.phone,
//         website: company.website,
//         logo: company.logo,
//         registrationText: company.registrationText,
//         governoratePrice: company.governoratePrice,
//         deliveryAgentFee: company.deliveryAgentFee,
//         baghdadPrice: company.baghdadPrice,
//         additionalPriceForEvery500000IraqiDinar:
//             company.additionalPriceForEvery500000IraqiDinar,
//         additionalPriceForEveryKilogram: company.additionalPriceForEveryKilogram,
//         additionalPriceForRemoteAreas: company.additionalPriceForRemoteAreas,
//         orderStatusAutomaticUpdate: company.orderStatusAutomaticUpdate
//     };
// };

export class CompanyModel {
    async createCompany(data: CompanyCreateType) {
        const createdCompany = await prisma.company.create({
            data: {
                name: data.companyData.name,
                phone: data.companyData.phone,
                website: data.companyData.website,
                logo: data.companyData.logo,
                color: data.companyData.color,
                registrationText: data.companyData.registrationText,
                governoratePrice: data.companyData.governoratePrice,
                deliveryAgentFee: data.companyData.deliveryAgentFee,
                baghdadPrice: data.companyData.baghdadPrice,
                additionalPriceForEvery500000IraqiDinar:
                    data.companyData.additionalPriceForEvery500000IraqiDinar,
                additionalPriceForEveryKilogram: data.companyData.additionalPriceForEveryKilogram,
                additionalPriceForRemoteAreas: data.companyData.additionalPriceForRemoteAreas,
                orderStatusAutomaticUpdate: data.companyData.orderStatusAutomaticUpdate,
                employees: {
                    create: {
                        user: {
                            create: {
                                username: data.companyManager.username,
                                name: data.companyManager.name,
                                password: data.companyManager.password,
                                phone: data.companyManager.phone
                            }
                        },
                        role: "COMPANY_MANAGER"
                    }
                }
            },
            select: companySelect
        });
        return createdCompany;
    }

    async getCompaniesCount() {
        const companiesCount = await prisma.company.count();
        return companiesCount;
    }

    async getAllCompanies(
        skip: number,
        take: number,
        filters: {
            minified?: boolean;
        }
    ) {
        if (filters.minified === true) {
            const companies = await prisma.company.findMany({
                skip: skip,
                take: take,
                select: {
                    id: true,
                    name: true
                }
            });
            return companies;
        }

        const companies = await prisma.company.findMany({
            skip: skip,
            take: take,
            orderBy: {
                name: "asc"
            },
            select: companySelect
        });

        return companies;
    }

    async getCompany(data: { companyID: number }) {
        const company = await prisma.company.findUnique({
            where: {
                id: data.companyID
            },
            select: companySelect
        });
        return company;
    }

    async updateCompany(data: {
        companyID: number;
        companyData: CompanyUpdateType;
    }) {
        const company = await prisma.company.update({
            where: {
                id: data.companyID
            },
            data: {
                name: data.companyData.name,
                phone: data.companyData.phone,
                website: data.companyData.website,
                logo: data.companyData.logo,
                color: data.companyData.color,
                registrationText: data.companyData.registrationText,
                governoratePrice: data.companyData.governoratePrice,
                deliveryAgentFee: data.companyData.deliveryAgentFee,
                baghdadPrice: data.companyData.baghdadPrice,
                additionalPriceForEvery500000IraqiDinar:
                    data.companyData.additionalPriceForEvery500000IraqiDinar,
                additionalPriceForEveryKilogram: data.companyData.additionalPriceForEveryKilogram,
                additionalPriceForRemoteAreas: data.companyData.additionalPriceForRemoteAreas,
                orderStatusAutomaticUpdate: data.companyData.orderStatusAutomaticUpdate
            },
            select: companySelect
        });
        return company;
    }

    // add or substract money from company treasury
    async updateCompanyTreasury(data: {
        companyID: number;
        treasury: {
            amount?: number;
            type?: "increment" | "decrement";
        };
    }) {
        await prisma.company.update({
            where: {
                id: data.companyID
            },
            data: {
                treasury:
                    data.treasury.type === "increment"
                        ? {
                              increment: data.treasury.amount
                          }
                        : {
                              decrement: data.treasury.amount
                          }
            }
        });
    }

    async deleteCompany(data: { companyID: number }) {
        await prisma.company.delete({
            where: {
                id: data.companyID
            },
            select: companySelect
        });
        return true;
    }
}
