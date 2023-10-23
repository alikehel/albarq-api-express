import { Router } from "express";

import { Role } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";
import {
    createTenant,
    deleteTenant,
    getAllTenants,
    getTenant,
    updateTenant
} from "./tenants.controller";

const router = Router();

router.route("/tenants").post(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    createTenant
    /*
        #swagger.tags = ['Tenants Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/TenantCreateSchema" },
                    examples: {
                        TenantCreateExample: { $ref: "#/components/examples/TenantCreateExample" }
                    }
                }
            }
        }
    */
);

router.route("/tenants").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getAllTenants
    /*
        #swagger.tags = ['Tenants Routes']

        #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page Number',
            required: false
        }
    */
);

router.route("/tenants/:tenantID").get(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    getTenant
    /*
        #swagger.tags = ['Tenants Routes']
    */
);

router.route("/tenants/:tenantID").patch(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    updateTenant
    /*
        #swagger.tags = ['Tenants Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/TenantUpdateSchema" },
                    examples: {
                        TenantUpdateExample: { $ref: "#/components/examples/TenantUpdateExample" }
                    }
                }
            }
        }
    */
);

router.route("/tenants/:tenantID").delete(
    isLoggedIn,
    isAutherized([Role.SUPER_ADMIN]),
    deleteTenant
    /*
        #swagger.tags = ['Tenants Routes']
    */
);

export default router;
