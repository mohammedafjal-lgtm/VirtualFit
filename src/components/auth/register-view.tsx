import { AuthCard } from "./auth-card";
import { RegisterForm } from "./register-form";

export function RegisterView() {
  return (
    <AuthCard title="Create account" subtitle="Start building your AI wardrobe">
      <RegisterForm />
    </AuthCard>
  );
}