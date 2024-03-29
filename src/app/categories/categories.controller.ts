import { AdminRole } from "@prisma/client";
import { AppError } from "../../lib/AppError";
import { catchAsync } from "../../lib/catchAsync";
import { loggedInUserType } from "../../types/user";
import { CategoryCreateSchema, CategoryUpdateSchema } from "./categories.zod";
import { CategoryModel } from "./category.model";

const categoryModel = new CategoryModel();

export const createCategory = catchAsync(async (req, res) => {
    const categoryData = CategoryCreateSchema.parse(req.body);
    const companyID = +res.locals.user.companyID;

    const createdCategory = await categoryModel.createCategory(companyID, categoryData);

    res.status(200).json({
        status: "success",
        data: createdCategory
    });
});

export const getAllCategories = catchAsync(async (req, res) => {
    // Filters
    const loggedInUser = res.locals.user as loggedInUserType;
    let companyID: number | undefined;
    if (Object.keys(AdminRole).includes(loggedInUser.role)) {
        companyID = req.query.company_id ? +req.query.company_id : undefined;
    } else if (loggedInUser.companyID) {
        companyID = loggedInUser.companyID;
    }

    const minified = req.query.minified ? req.query.minified === "true" : undefined;

    const categoriesCount = await categoryModel.getCategoriesCount({
        companyID: companyID
    });
    let size = req.query.size ? +req.query.size : 10;
    if (size > 50 && minified !== true) {
        size = 10;
    }
    const pagesCount = Math.ceil(categoriesCount / size);

    if (pagesCount === 0) {
        res.status(200).json({
            status: "success",
            page: 1,
            pagesCount: 1,
            data: []
        });
        return;
    }

    let page = 1;
    if (req.query.page && !Number.isNaN(+req.query.page) && +req.query.page > 0) {
        page = +req.query.page;
    }
    if (page > pagesCount) {
        throw new AppError("Page number out of range", 400);
    }
    const take = page * size;
    const skip = (page - 1) * size;
    // if (Number.isNaN(offset)) {
    //     skip = 0;
    // }

    const categories = await categoryModel.getAllCategories(skip, take, {
        companyID: companyID,
        minified: minified
    });

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: categories
    });
});

export const getCategory = catchAsync(async (req, res) => {
    const categoryID = +req.params.categoryID;

    const category = await categoryModel.getCategory({
        categoryID: categoryID
    });

    res.status(200).json({
        status: "success",
        data: category
    });
});

export const updateCategory = catchAsync(async (req, res) => {
    const categoryID = +req.params.categoryID;

    const categoryData = CategoryUpdateSchema.parse(req.body);

    const category = await categoryModel.updateCategory({
        categoryID: categoryID,
        categoryData: categoryData
    });

    res.status(200).json({
        status: "success",
        data: category
    });
});

export const deleteCategory = catchAsync(async (req, res) => {
    const categoryID = +req.params.categoryID;

    await categoryModel.deleteCategory({
        categoryID: categoryID
    });

    res.status(200).json({
        status: "success"
    });
});
