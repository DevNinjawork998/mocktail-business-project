import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { canManageUsers } from "@/lib/permissions";
import UserForm from "@/components/UserForm/UserForm";

export const metadata = {
  title: "New User | Admin Dashboard",
};

export default async function NewUserPage() {
  const session = await auth();

  if (!session?.user || !canManageUsers(session.user.role)) {
    redirect("/dashboard");
  }

  return (
    <div>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "2rem",
          fontFamily: "serif",
        }}
      >
        Create New User
      </h1>
      <UserForm />
    </div>
  );
}
