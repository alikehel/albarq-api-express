import { PrismaClient } from "@prisma/client";
import { OrderCreateType, OrderUpdateType } from "./orders.zod";

const prisma = new PrismaClient();

export class OrderModel {
    async createOrder(data: OrderCreateType) {
        const createdOrder = await prisma.order.create({
            data: {
                totalCost: data.totalCost,
                paidAmount: data.paidAmount,
                totalCostInUSD: data.totalCostInUSD,
                paidAmountInUSD: data.paidAmountInUSD,
                discount: data.discount,
                receiptNumber: data.receiptNumber,
                quantity: data.quantity,
                weight: data.weight,
                recipientName: data.recipientName,
                recipientPhone: data.recipientPhone,
                recipientAddress: data.recipientAddress,
                details: data.details,
                notes: data.notes,
                status: data.status,
                deliveryType: data.deliveryType,
                deliveryDate: data.deliveryDate,
                client: {
                    connect: {
                        id: data.clientID
                    }
                },
                deliveryAgent: {
                    connect: {
                        id: data.deliveryAgentID
                    }
                }
            },
            select: {
                id: true,
                totalCost: true,
                paidAmount: true,
                totalCostInUSD: true,
                paidAmountInUSD: true,
                discount: true,
                receiptNumber: true,
                quantity: true,
                weight: true,
                recipientName: true,
                recipientPhone: true,
                recipientAddress: true,
                details: true,
                notes: true,
                status: true,
                deliveryType: true,
                deliveryDate: true,
                client: true,
                deliveryAgent: true
            }
        });
        return createdOrder;
    }

    async getOrdersCount() {
        const ordersCount = await prisma.order.count();
        return ordersCount;
    }

    async getAllOrders(skip: number, take: number) {
        const orders = await prisma.order.findMany({
            skip: skip,
            take: take,
            orderBy: {
                id: "desc"
            },
            select: {
                id: true,
                totalCost: true,
                paidAmount: true,
                totalCostInUSD: true,
                paidAmountInUSD: true,
                discount: true,
                receiptNumber: true,
                quantity: true,
                weight: true,
                recipientName: true,
                recipientPhone: true,
                recipientAddress: true,
                details: true,
                notes: true,
                status: true,
                deliveryType: true,
                deliveryDate: true,
                client: true,
                deliveryAgent: true
            }
        });
        return orders;
    }

    async getOrder(data: { orderID: string }) {
        const order = await prisma.order.findUnique({
            where: {
                id: data.orderID
            },
            select: {
                id: true,
                totalCost: true,
                paidAmount: true,
                totalCostInUSD: true,
                paidAmountInUSD: true,
                discount: true,
                receiptNumber: true,
                quantity: true,
                weight: true,
                recipientName: true,
                recipientPhone: true,
                recipientAddress: true,
                details: true,
                notes: true,
                status: true,
                deliveryType: true,
                deliveryDate: true,
                client: true,
                deliveryAgent: true
            }
        });
        return order;
    }

    async updateOrder(data: { orderID: string; orderData: OrderUpdateType }) {
        const order = await prisma.order.update({
            where: {
                id: data.orderID
            },
            data: {
                totalCost: data.orderData.totalCost,
                paidAmount: data.orderData.paidAmount,
                totalCostInUSD: data.orderData.totalCostInUSD,
                paidAmountInUSD: data.orderData.paidAmountInUSD,
                discount: data.orderData.discount,
                receiptNumber: data.orderData.receiptNumber,
                quantity: data.orderData.quantity,
                weight: data.orderData.weight,
                recipientName: data.orderData.recipientName,
                recipientPhone: data.orderData.recipientPhone,
                recipientAddress: data.orderData.recipientAddress,
                details: data.orderData.details,
                notes: data.orderData.notes,
                status: data.orderData.status,
                deliveryType: data.orderData.deliveryType,
                deliveryDate: data.orderData.deliveryDate,
                client: data.orderData.clientID
                    ? {
                          connect: {
                              id: data.orderData.clientID
                          }
                      }
                    : undefined,
                deliveryAgent: data.orderData.deliveryAgentID
                    ? {
                          connect: {
                              id: data.orderData.deliveryAgentID
                          }
                      }
                    : undefined
            },
            select: {
                id: true,
                totalCost: true,
                paidAmount: true,
                totalCostInUSD: true,
                paidAmountInUSD: true,
                discount: true,
                receiptNumber: true,
                quantity: true,
                weight: true,
                recipientName: true,
                recipientPhone: true,
                recipientAddress: true,
                details: true,
                notes: true,
                status: true,
                deliveryType: true,
                deliveryDate: true,
                client: true,
                deliveryAgent: true
            }
        });
        return order;
    }

    async deleteOrder(data: { orderID: string }) {
        const deletedOrder = await prisma.order.delete({
            where: {
                id: data.orderID
            },
            select: {
                id: true,
                totalCost: true,
                paidAmount: true,
                totalCostInUSD: true,
                paidAmountInUSD: true,
                discount: true,
                receiptNumber: true,
                quantity: true,
                weight: true,
                recipientName: true,
                recipientPhone: true,
                recipientAddress: true,
                details: true,
                notes: true,
                status: true,
                deliveryType: true,
                deliveryDate: true,
                client: true,
                deliveryAgent: true
            }
        });
        return deletedOrder;
    }
}