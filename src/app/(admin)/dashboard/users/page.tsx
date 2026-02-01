import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { canManageUsers } from "@/lib/permissions";
import { getUsers } from "@/app/actions/users";
import UsersListClient from "./UsersListClient";

export default async function UsersPage() {
  const session = await auth();

  if (!session?.user || !canManageUsers(session.user.role)) {
    redirect("/dashboard");
  }

  const result = await getUsers();

  if (!result.success) {
    return (
      <div>
        <h1>Error</h1>
        <p>{result.error}</p>
      </div>
    );
  }

  return (
    <UsersListClient users={result.data || []} currentUserId={session.user.id} />
  );
}
