import { Suspense } from "react";
import { AuthCard } from "./auth-card";
import { LoginForm } from "./login-form";

export function LoginView() {
  return (
    <AuthCard title="Welcome back" subtitle="Log in to your VirtualFit wardrobe">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}