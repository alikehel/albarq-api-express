import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { TenantModel } from "./tenant.model";
import { TenantCreateSchema, TenantUpdateSchema } from "./tenants.zod";

const tenantModel = new TenantModel();

export const createTenant = catchAsync(async (req, res) => {
    const tenantData = TenantCreateSchema.parse(req.body);

    const createdTenant = await tenantModel.createTenant(tenantData);

    res.status(200).json({
        status: "success",
        data: createdTenant
    });
});

export const getAllTenants = catchAsync(async (req, res) => {
    const tenantsCount = await tenantModel.getTenantsCount();
    const pagesCount = Math.ceil(tenantsCount / 10);

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
    if (
        req.query.page &&
        !Number.isNaN(+req.query.page) &&
        +req.query.page > 0
    ) {
        page = +req.query.page;
    }
    if (page > pagesCount) {
        throw new AppError("Page number out of range", 400);
    }
    const take = page * 10;
    const skip = (page - 1) * 10;
    // if (Number.isNaN(offset)) {
    //     skip = 0;
    // }

    const tenants = await tenantModel.getAllTenants(skip, take);

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: tenants
    });
});

export const getTenant = catchAsync(async (req, res) => {
    const tenantID = req.params["tenantID"];

    const tenant = await tenantModel.getTenant({
        tenantID: tenantID
    });

    res.status(200).json({
        status: "success",
        data: tenant
    });
});

export const updateTenant = catchAsync(async (req, res) => {
    const tenantID = req.params["tenantID"];

    const tenantData = TenantUpdateSchema.parse(req.body);

    const tenant = await tenantModel.updateTenant({
        tenantID: tenantID,
        tenantData: tenantData
    });

    res.status(200).json({
        status: "success",
        data: tenant
    });
});

export const deleteTenant = catchAsync(async (req, res) => {
    const tenantID = req.params["tenantID"];

    await tenantModel.deleteTenant({
        tenantID: tenantID
    });

    res.status(200).json({
        status: "success"
    });
});