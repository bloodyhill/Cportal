import { useAuth } from "@/context/auth-context";
import { hasPermission, Permission } from "@/lib/permissions";
import { useLanguageContext } from "@/context/language-context";
import { useTranslation } from "@/lib/translations";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission: Permission;
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { language } = useLanguageContext();
  const { t } = useTranslation(language);
  
  const hasAccess = hasPermission(user, requiredPermission);
  
  if (!hasAccess) {
    return (
      <div className="flex h-full w-full items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Alert variant="destructive" className="mb-4">
            <AlertTitle className="text-lg font-semibold">{t("accessDenied")}</AlertTitle>
            <AlertDescription className="mt-2">
              {t("insufficientPermissions")}
            </AlertDescription>
          </Alert>
          <Button
            variant="default"
            onClick={() => navigate("/")}
            className="w-full"
          >
            {t("dashboard")}
          </Button>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}