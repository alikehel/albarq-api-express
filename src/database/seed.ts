import { AdminRole, PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { SECRET } from "../config/config";
// import Logger from "../lib/logger";

// initialize Prisma Client
const prisma = new PrismaClient();

const notifications = [
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "تأكيد التسجيل",
        content: "شكرًا لتسجيلك معنا. نرحب بك في مجتمعنا!"
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "تحديث معلومات الحساب",
        content: "يرجى تحديث معلومات حسابك لتجربة استخدام محسنة."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "رسالة ترحيب",
        content: "مرحبًا بك! نأمل أن تستمتع بتجربتك معنا."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "إعادة تعيين كلمة المرور",
        content: "انقر هنا لإعادة تعيين كلمة المرور الخاصة بك."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "تأكيد الطلب",
        content: "شكرًا لطلبك. سنبدأ في معالجته على الفور."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "تحديث الشروط والأحكام",
        content: "يرجى مراجعة والموافقة على تحديثات الشروط والأحكام."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "تنشيط الحساب",
        content: "انقر هنا لتنشيط حسابك والبدء في الاستفادة من خدماتنا."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "تغييرات في الخصوصية",
        content: "أخبار هامة! تعرّف على التغييرات الجديدة في سياسة الخصوصية."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "تقييم الخدمة",
        content: "شاركنا تجربتك معنا وقيم خدماتنا لتحسينها."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "تنبيه الاشتراك",
        content:
            "نود تذكيرك بأن اشتراكك سينتهي قريبًا. قم بتجديد الاشتراك الخاص بك الآن."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "تحديثات المنتج",
        content: "اكتشف آخر تحديثات منتجاتنا الجديدة والمحسّنة."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "استلام الدفعة",
        content: "تم استلام الدفعة الخاصة بك. شكرًا لثقتك بنا!"
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "تغييرات في الجدول الزمني",
        content: "يرجى ملاحظة التغييرات الجديدة في الجدول الزمني للفعاليات."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "تنبيه الأمان",
        content: "تم اكتشاف نشاط غير معتاد. يرجى التحقق من حسابك."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "اكتشاف مشكلة",
        content: "نعتذر عن أي ازعاج. نحن نعمل على حل هذه المشكلة."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "تحديثات الخدمة",
        content: "تعرّف على آخر تحديثات الخدمة لدينا والميزات الجديدة."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "تذكير بالمهمة",
        content: "لا تنس إكمال المهمة الهامة قبل الموعد النهائي."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "تحديث المنصة",
        content: "لقد قمنا بتحديث المنصة لتحسين تجربتك معنا."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "الرد على الاستفسار",
        content: "نحن هنا للإجابة على جميع استفساراتك واحتياجاتك."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "تحديثات الخدمة المجانية",
        content: "تمتع بتحديثات الخدمة المجانية التي تقدمها لك شركتنا."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "الاشتراك في النشرة الإخبارية",
        content:
            "اشترك في نشرتنا الإخبارية للحصول على آخر التحديثات والعروض الخاصة."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "إعادة توجيه الصفحة",
        content: "تم تحويلك إلى الصفحة المطلوبة. نأمل أن تستمتع بتجربتك."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "تحديثات الصيانة",
        content: "سيتم إجراء الصيانة الدورية قريبًا. نعتذر عن أي ازعاج."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "تنبيه الوظيفة",
        content: "تم نشر وظيفة جديدة تناسب ملفك الشخصي. قدّم طلبك الآن!"
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "التحقق من الحساب",
        content: "يرجى التحقق من حسابك لضمان الأمان والحماية."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "اشتراك العضوية",
        content: "سجل اليوم واستفد من مزايا العضوية الحصرية."
    },
    {
        userId: "398f98ae-95cb-49f2-90e9-f4f5543a08dc",
        title: "تقديم خدمة مخصصة",
        content: "نحن هنا لتلبية احتياجاتك وتقديم الخدمات المخصصة لك."
    }
];

async function main() {
    const superAdmin = await prisma.admin.upsert({
        where: {
            user: {
                username: "superadmin",
                id: 1
            },
            userId: 1
        },
        update: {
            user: {
                update: {
                    name: "Super Admin",
                    username: "superadmin",
                    password: bcrypt.hashSync(
                        "superadmin" + (SECRET as string),
                        12
                    ),
                    phone: "01000000000"
                }
            },
            role: AdminRole.SUPER_ADMIN
        },
        create: {
            user: {
                create: {
                    id: 1,
                    name: "Super Admin",
                    username: "superadmin",
                    password: bcrypt.hashSync(
                        "superadmin" + (SECRET as string),
                        12
                    ),
                    phone: "01000000000"
                }
            },
            role: AdminRole.SUPER_ADMIN
        }
    });

    // const user2 = await prisma.user.create({
    //   data: {
    //     name: 'Wagih Mohamed',
    //     username: 'wagihmohamed',
    //     password: 'password',
    //   },
    // });

    // await prisma.notification.createMany({
    //     data: notifications
    // });

    console.log({ superAdmin });
    // Logger.info({ superAdmin });
}

// execute the main function
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // close Prisma Client at the end
        await prisma.$disconnect();
    });
