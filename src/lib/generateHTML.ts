import handlebars from "handlebars";
import { AppError } from "../lib/AppError";
import { Logger } from "../lib/logger";

export const generateHTML = async (template: string, data: object) => {
    try {
        handlebars.registerHelper("date", (date) => new Date(date).toLocaleDateString());
        handlebars.registerHelper("mapPhones", (phones) => {
            if (!phones) return "";
            if (typeof phones === "string") return phones;
            return phones.join("\n");
        });
        handlebars.registerHelper("inc", (value) => parseInt(value) + 1);
        handlebars.registerHelper("add", (v1, v2) => parseInt(v1) + parseInt(v2));

        const compiledTemplate = handlebars.compile(template, { strict: true });
        const html = compiledTemplate({
            ...data
        });

        return html;
    } catch (error) {
        Logger.error(error);
        throw new AppError("حدث خطأ أثناء انشاء ملف ال pdf", 500);
    }
};