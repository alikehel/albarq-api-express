import { Router } from "express";

import { signin } from "./auth.controller";

import { isLoggedIn } from "../../middlewares/isLoggedIn.middleware";

const router = Router();

router.route("/auth/signin").post(
    signin
    /*
        #swagger.tags = ['Auth Routes']

        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/UserSigninSchema" },
                    examples: {
                        UserSigninExample: { $ref: "#/components/examples/UserSigninExample" }
                    }
                }
            }
        }

        #swagger.responses[201-1] = {
            description: 'User Signined Successfully',
            schema: {
                status: "success",
                token: 'token'
            }
        }

        #swagger.responses[400-1] = {
            schema: {
                status: "fail",
                message: 'Password is not correct'
            },
            description: 'Password is not correct'
        }

        #swagger.responses[400-2] = {
            schema: {
                status: "fail",
                message: 'User not found'
            },
            description: 'User not found'
        }

        #swagger.responses[500-1] = {
            description: 'Cant signin the user',
            schema: {
                status: "error",
                message: 'Cant signin the user'
            }
        }
    */
);

router.route("/auth/validate-token").post(
    isLoggedIn,
    (req, res) => {
        res.status(200).json({
            status: "valid"
        });
    }
    /*
        #swagger.tags = ['Auth Routes']

        #swagger.description = 'User needs to be logged in'

        #swagger.security = [{
            "bearerAuth": []
        }]

        #swagger.responses[200-1] = {
            description: 'Token is valid',
            schema: {
                status: "valid"
            }
        }

        #swagger.responses[401-1] = {
            schema: {
                status: "invalid token"
            },
            description: 'Token is invalid'
        }

        #swagger.responses[401-2] = {
            schema: {
                status: "fail",
                message: 'Please Log In!'
            },
            description: 'Please Log In!'
        }
    */
);

export default router;
