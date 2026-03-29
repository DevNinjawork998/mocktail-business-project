import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata = {
  title: "Forgot password | Admin Dashboard",
  description: "Request a password reset link for your admin account",
};

export default async function ForgotPasswordPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <ForgotPasswordForm />;
}
