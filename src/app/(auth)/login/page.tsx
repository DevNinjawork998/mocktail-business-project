import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Login | Admin Dashboard",
  description: "Sign in to access the admin dashboard",
};

function LoginFormFallback() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div>Loading...</div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginForm />
    </Suspense>
  );
}
