import { AdminRole, ClientRole } from "@prisma/client";
import { AppError } from "../../lib/AppError";
import { catchAsync } from "../../lib/catchAsync";
import { loggedInUserType } from "../../types/user";
import { OrdersRepository } from "../orders/orders.repository";
import { ProductModel } from "./product.repository";
import { ProductCreateSchema, ProductUpdateSchema } from "./products.dto";

const productModel = new ProductModel();
const ordersRepository = new OrdersRepository();

export const createProduct = catchAsync(async (req, res) => {
    const productData = ProductCreateSchema.parse(req.body);
    // const loggedInUserID = +res.locals.user.id;
    const companyID = +res.locals.user.companyID;
    const image = req.file
        ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`
        : undefined;

    // Get the clientID
    const clientID = await ordersRepository.getClientIDByStoreID({ storeID: productData.storeID });
    if (!clientID) {
        throw new AppError("حصل حطأ في ايجاد صاحب المتجر", 500);
    }

    const createdProduct = await productModel.createProduct(companyID, clientID, {
        ...productData,
        image
    });

    res.status(200).json({
        status: "success",
        data: createdProduct
    });
});

export const getAllProducts = catchAsync(async (req, res) => {
    // Filters
    const loggedInUser = res.locals.user as loggedInUserType;
    let companyID: number | undefined;
    if (Object.keys(AdminRole).includes(loggedInUser.role)) {
        companyID = req.query.company_id ? +req.query.company_id : undefined;
    } else if (loggedInUser.companyID) {
        companyID = loggedInUser.companyID;
    }

    let clientID: number | undefined;
    if (loggedInUser.role === ClientRole.CLIENT) {
        clientID = loggedInUser.id;
    } else if (req.query.client_id) {
        clientID = +req.query.client_id;
    }

    const minified = req.query.minified ? req.query.minified === "true" : undefined;

    const storeID = req.query.store_id ? +req.query.store_id : undefined;

    let size = req.query.size ? +req.query.size : 10;
    if (size > 50 && minified !== true) {
        size = 10;
    }
    let page = 1;
    if (req.query.page && !Number.isNaN(+req.query.page) && +req.query.page > 0) {
        page = +req.query.page;
    }

    const { products, pagesCount } = await productModel.getAllProductsPaginated({
        page: page,
        size: size,
        storeID: storeID,
        companyID: companyID,
        minified: minified,
        clientID: clientID
    });

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: products
    });
});

export const getProduct = catchAsync(async (req, res) => {
    const productID = +req.params.productID;

    const product = await productModel.getProduct({
        productID: productID
    });

    res.status(200).json({
        status: "success",
        data: product
    });
});

export const updateProduct = catchAsync(async (req, res) => {
    const productID = +req.params.productID;
    const loggedInUserID = +res.locals.user.id;
    const companyID = +res.locals.user.companyID;

    const productData = ProductUpdateSchema.parse(req.body);
    const image = req.file
        ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`
        : undefined;

    const product = await productModel.updateProduct({
        productID: productID,
        companyID,
        loggedInUserID,
        productData: { ...productData, image }
    });

    res.status(200).json({
        status: "success",
        data: product
    });
});

export const deleteProduct = catchAsync(async (req, res) => {
    const productID = +req.params.productID;

    await productModel.deleteProduct({
        productID: productID
    });

    res.status(200).json({
        status: "success"
    });
});
