import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata = {
  title: "Reset password | Admin Dashboard",
  description: "Set a new password using your reset link",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  if (session?.user) {
    redirect("/dashboard");
  }

  const token = params.token ?? "";

  return <ResetPasswordForm initialToken={token} />;
}
