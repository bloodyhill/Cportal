import { Language } from "@/hooks/use-language";

type TranslationKeys = 
  | "dashboard"
  | "clients"
  | "orders"
  | "invoices"
  | "reports"
  | "settings"
  | "totalClients"
  | "activeOrders"
  | "pendingInvoices"
  | "totalRevenue"
  | "recentClients"
  | "recentOrders"
  | "recentInvoices"
  | "viewAll"
  | "search"
  | "newClient"
  | "newOrder"
  | "newInvoice"
  | "edit"
  | "delete"
  | "cancel"
  | "save"
  | "create"
  | "update"
  | "name"
  | "email"
  | "phone"
  | "agency"
  | "position"
  | "notes"
  | "status"
  | "amount"
  | "date"
  | "dueDate"
  | "issueDate"
  | "paid"
  | "pending"
  | "overdue"
  | "canceled"
  | "title"
  | "description"
  | "tweetUrl"
  | "client"
  | "order"
  | "invoice"
  | "invoiceNumber"
  | "actions"
  | "confirmed"
  | "inProgress"
  | "completed"
  | "profile"
  | "security"
  | "userManagement"
  | "darkMode"
  | "logOut"
  | "password"
  | "currentPassword"
  | "newPassword"
  | "confirmPassword"
  | "updatePassword"
  | "username"
  | "role"
  | "admin"
  | "user"
  | "editor"
  | "viewer"
  | "accessDenied"
  | "insufficientPermissions"
  | "roleDescription";

export const translations: Record<Language, Record<TranslationKeys, string>> = {
  en: {
    dashboard: "Dashboard",
    clients: "Clients",
    orders: "Orders",
    invoices: "Invoices",
    reports: "Reports",
    settings: "Settings",
    totalClients: "Total Clients",
    activeOrders: "Active Orders",
    pendingInvoices: "Pending Invoices",
    totalRevenue: "Total Revenue",
    recentClients: "Recent Clients",
    recentOrders: "Recent Orders",
    recentInvoices: "Recent Invoices",
    viewAll: "View All",
    search: "Search",
    newClient: "New Client",
    newOrder: "New Order",
    newInvoice: "New Invoice",
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save",
    create: "Create",
    update: "Update",
    name: "Name",
    email: "Email",
    phone: "Phone",
    agency: "Agency",
    position: "Position",
    notes: "Notes",
    status: "Status",
    amount: "Amount",
    date: "Date",
    dueDate: "Due Date",
    issueDate: "Issue Date",
    paid: "Paid",
    pending: "Pending",
    overdue: "Overdue",
    canceled: "Canceled",
    title: "Title",
    description: "Description",
    tweetUrl: "Tweet URL",
    client: "Client",
    order: "Order",
    invoice: "Invoice",
    invoiceNumber: "Invoice Number",
    actions: "Actions",
    confirmed: "Confirmed",
    inProgress: "In Progress",
    completed: "Completed",
    profile: "Profile",
    security: "Security",
    userManagement: "User Management",
    darkMode: "Dark Mode",
    logOut: "Log Out",
    password: "Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    updatePassword: "Update Password",
    username: "Username",
    role: "Role",
    admin: "Administrator",
    user: "User",
    editor: "Editor",
    viewer: "Viewer",
    accessDenied: "Access Denied",
    insufficientPermissions: "Insufficient Permissions",
    roleDescription: "Determines user access level"
  },
  ar: {
    dashboard: "لوحة المعلومات",
    clients: "العملاء",
    orders: "الطلبات",
    invoices: "الفواتير",
    reports: "التقارير",
    settings: "الإعدادات",
    totalClients: "إجمالي العملاء",
    activeOrders: "الطلبات النشطة",
    pendingInvoices: "الفواتير المعلقة",
    totalRevenue: "إجمالي الإيرادات",
    recentClients: "العملاء الجدد",
    recentOrders: "أحدث الطلبات",
    recentInvoices: "أحدث الفواتير",
    viewAll: "عرض الكل",
    search: "بحث",
    newClient: "عميل جديد",
    newOrder: "طلب جديد",
    newInvoice: "فاتورة جديدة",
    edit: "تعديل",
    delete: "حذف",
    cancel: "إلغاء",
    save: "حفظ",
    create: "إنشاء",
    update: "تحديث",
    name: "الاسم",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    agency: "الوكالة",
    position: "المنصب",
    notes: "ملاحظات",
    status: "الحالة",
    amount: "المبلغ",
    date: "التاريخ",
    dueDate: "تاريخ الاستحقاق",
    issueDate: "تاريخ الإصدار",
    paid: "مدفوع",
    pending: "معلق",
    overdue: "متأخر",
    canceled: "ملغي",
    title: "العنوان",
    description: "الوصف",
    tweetUrl: "رابط التغريدة",
    client: "العميل",
    order: "الطلب",
    invoice: "الفاتورة",
    invoiceNumber: "رقم الفاتورة",
    actions: "إجراءات",
    confirmed: "مؤكد",
    inProgress: "قيد التنفيذ",
    completed: "مكتمل",
    profile: "الملف الشخصي",
    security: "الأمان",
    userManagement: "إدارة المستخدمين",
    darkMode: "الوضع الداكن",
    logOut: "تسجيل الخروج",
    password: "كلمة المرور",
    currentPassword: "كلمة المرور الحالية",
    newPassword: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور",
    updatePassword: "تحديث كلمة المرور",
    username: "اسم المستخدم",
    role: "الدور",
    admin: "مدير",
    user: "مستخدم",
    editor: "محرر",
    viewer: "مشاهد",
    accessDenied: "تم رفض الوصول",
    insufficientPermissions: "صلاحيات غير كافية",
    roleDescription: "يحدد مستوى وصول المستخدم"
  }
};

export function useTranslation(language: Language) {
  return {
    t: (key: TranslationKeys): string => {
      return translations[language][key] || key;
    }
  };
}