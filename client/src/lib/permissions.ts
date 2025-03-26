import { AuthUser } from "@/context/auth-context";

export type Permission = 
  | "view_dashboard" 
  | "view_clients" 
  | "create_client" 
  | "edit_client" 
  | "delete_client" 
  | "view_orders" 
  | "create_order" 
  | "edit_order" 
  | "delete_order" 
  | "view_invoices" 
  | "create_invoice" 
  | "edit_invoice" 
  | "delete_invoice"
  | "view_reports"
  | "view_settings"
  | "edit_profile"
  | "change_password"
  | "manage_users";

export type Role = "admin" | "editor" | "viewer" | "user";

// Define permissions for each role
const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    "view_dashboard",
    "view_clients",
    "create_client",
    "edit_client",
    "delete_client",
    "view_orders",
    "create_order",
    "edit_order",
    "delete_order",
    "view_invoices",
    "create_invoice",
    "edit_invoice",
    "delete_invoice",
    "view_reports",
    "view_settings",
    "edit_profile",
    "change_password",
    "manage_users"
  ],
  editor: [
    "view_dashboard",
    "view_clients",
    "create_client",
    "edit_client",
    "view_orders",
    "create_order",
    "edit_order",
    "view_invoices",
    "create_invoice",
    "edit_invoice",
    "view_reports",
    "view_settings",
    "edit_profile",
    "change_password"
  ],
  user: [
    "view_dashboard",
    "view_clients",
    "view_orders",
    "view_invoices",
    "view_reports",
    "view_settings",
    "edit_profile",
    "change_password"
  ],
  viewer: [
    "view_dashboard",
    "view_clients",
    "view_orders",
    "view_invoices",
    "view_reports",
    "view_settings",
    "edit_profile",
    "change_password"
  ]
};

export function hasPermission(user: AuthUser | null, permission: Permission): boolean {
  if (!user) return false;
  
  // Default to 'user' role if not specified
  const role = (user.role as Role) || "user";
  
  // Check if the user's role has the required permission
  return rolePermissions[role]?.includes(permission) || false;
}

export function getRoleDescription(role: Role): string {
  switch (role) {
    case "admin":
      return "Full access to all features and settings";
    case "editor":
      return "Can create and edit content but cannot delete or manage users";
    case "user":
      return "Can view content but cannot create, edit or delete";
    case "viewer":
      return "Can only view content with no editing capabilities";
    default:
      return "Unknown role";
  }
}

export function getAvailableRoles(): Role[] {
  return ["admin", "editor", "user", "viewer"];
}