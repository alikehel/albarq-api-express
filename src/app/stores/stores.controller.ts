import AppError from "../../utils/AppError.util";
import catchAsync from "../../utils/catchAsync.util";
import { StoreModel } from "./store.model";
import { StoreCreateSchema, StoreUpdateSchema } from "./stores.zod";

const storeModel = new StoreModel();

export const createStore = catchAsync(async (req, res) => {
    const storeData = StoreCreateSchema.parse(req.body);

    const createdStore = await storeModel.createStore(storeData);

    res.status(200).json({
        status: "success",
        data: createdStore
    });
});

export const getAllStores = catchAsync(async (req, res) => {
    const storesCount = await storeModel.getStoresCount();
    const size = req.query.size ? +req.query.size : 10;
    const pagesCount = Math.ceil(storesCount / size);

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
    const take = page * size;
    const skip = (page - 1) * size;
    // if (Number.isNaN(offset)) {
    //     skip = 0;
    // }

    const stores = await storeModel.getAllStores(skip, take);

    res.status(200).json({
        status: "success",
        page: page,
        pagesCount: pagesCount,
        data: stores
    });
});

export const getStore = catchAsync(async (req, res) => {
    const storeID = req.params["storeID"];

    const store = await storeModel.getStore({
        storeID: storeID
    });

    res.status(200).json({
        status: "success",
        data: store
    });
});

export const updateStore = catchAsync(async (req, res) => {
    const storeID = req.params["storeID"];

    const storeData = StoreUpdateSchema.parse(req.body);

    const store = await storeModel.updateStore({
        storeID: storeID,
        storeData: storeData
    });

    res.status(200).json({
        status: "success",
        data: store
    });
});

export const deleteStore = catchAsync(async (req, res) => {
    const storeID = req.params["storeID"];

    await storeModel.deleteStore({
        storeID: storeID
    });

    res.status(200).json({
        status: "success"
    });
});