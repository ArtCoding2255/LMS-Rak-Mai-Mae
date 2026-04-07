import { Suspense } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">กำลังโหลด...</CardTitle>
          </CardHeader>
        </Card>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
