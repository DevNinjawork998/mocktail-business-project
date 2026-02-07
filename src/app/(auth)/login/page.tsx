import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Login | Admin Dashboard",
  description: "Sign in to access the admin dashboard",
};

function LoginFormFallback() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <div>Loading...</div>
    </div>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  // Redirect authenticated users to their intended destination
  if (session?.user) {
    const callbackUrl = params?.callbackUrl || "/dashboard";
    redirect(callbackUrl);
  }

  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginForm />
    </Suspense>
  );
}
