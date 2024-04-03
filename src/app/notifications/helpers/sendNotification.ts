import admin from "firebase-admin";
import { env } from "../../../config";
import { Logger } from "../../../lib/logger";
import { NotificationModel } from "../notification.repository";
import { NotificationCreateType } from "../notifications.dto";

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        clientEmail: env.FIREBASE_CLIENT_EMAIL
    })
});

const notificationModel = new NotificationModel();

export const sendNotification = async (data: NotificationCreateType) => {
    const createdNotification = await notificationModel.createNotification(data);

    const user = createdNotification?.user;

    if (!user?.fcm) {
        return;
    }

    const message = {
        notification: {
            title: data.title,
            body: data.content
        },
        token: user.fcm
    };

    // await admin.messaging().subscribeToTopic([user.fcm], "all");

    // await admin
    //     .messaging()
    //     .send(message)
    //     .then((response) => {
    //         Logger.info("Successfully sent message to tobic 'all':", response);
    //     })
    //     .catch((error) => {
    //         Logger.error("Error sending message to tobic 'all':", error);
    //     });

    await admin
        .messaging()
        .send(message)
        .then((response) => {
            Logger.info("Successfully sent message to token:", response);
        })
        .catch((error) => {
            Logger.error("Error sending message to token:", error);
        });
};
