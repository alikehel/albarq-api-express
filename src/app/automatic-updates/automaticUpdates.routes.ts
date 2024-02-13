import { Router } from "express";

// import { Role } from "@prisma/client";
// import { isAutherized } from "../../middlewares/isAutherized.middleware";
import { AdminRole, EmployeeRole } from "@prisma/client";
import { isAutherized } from "../../middlewares/isAutherized";
import { isLoggedIn } from "../../middlewares/isLoggedIn";
import {
    createAutomaticUpdate,
    deleteAutomaticUpdate,
    getAllAutomaticUpdates,
    getAutomaticUpdate,
    updateAutomaticUpdate
} from "./automaticUpdates.controller";

const router = Router();

router.route("/automatic-updates").post(
    isLoggedIn,
    isAutherized([EmployeeRole.COMPANY_MANAGER]),
    createAutomaticUpdate
    /*
        #swagger.tags = ['Automatic Updates Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": { $ref: "#/components/schemas/AutomaticUpdateCreateSchema" },
                    "examples": {
                        "AutomaticUpdateCreateExample": { $ref: "#/components/examples/AutomaticUpdateCreateExample" }
                    }
                }
            }
        }
    */
);

router.route("/automatic-updates").get(
    isLoggedIn,
    isAutherized([EmployeeRole.COMPANY_MANAGER, AdminRole.ADMIN, AdminRole.ADMIN_ASSISTANT]),
    getAllAutomaticUpdates
    /*
        #swagger.tags = ['Automatic Updates Routes']

        #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page Number',
            required: false
        }

        #swagger.parameters['size'] = {
            in: 'query',
            description: 'Page Size (Number of Items per Page) (Default: 10)',
            required: false
        }
    */
);

router.route("/automatic-updates/:automaticUpdateID").get(
    isLoggedIn,
    isAutherized([EmployeeRole.COMPANY_MANAGER, AdminRole.ADMIN, AdminRole.ADMIN_ASSISTANT]),
    getAutomaticUpdate
    /*
        #swagger.tags = ['Automatic Updates Routes']
    */
);

router.route("/automatic-updates/:automaticUpdateID").patch(
    isLoggedIn,
    isAutherized([EmployeeRole.COMPANY_MANAGER, AdminRole.ADMIN, AdminRole.ADMIN_ASSISTANT]),
    updateAutomaticUpdate
    /*
        #swagger.tags = ['Automatic Updates Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    "schema": { $ref: "#/components/schemas/AutomaticUpdateUpdateSchema" },
                    "examples": {
                        "AutomaticUpdateUpdateExample": { $ref: "#/components/examples/AutomaticUpdateUpdateExample" }
                    }
                }
            }
        }
    */
);

router.route("/automatic-updates/:automaticUpdateID").delete(
    isLoggedIn,
    isAutherized([EmployeeRole.COMPANY_MANAGER, AdminRole.ADMIN, AdminRole.ADMIN_ASSISTANT]),
    deleteAutomaticUpdate
    /*
        #swagger.tags = ['Automatic Updates Routes']
    */
);

export default router;