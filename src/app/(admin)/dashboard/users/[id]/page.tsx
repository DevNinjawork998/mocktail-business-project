import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { canManageUsers } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import UserForm from "@/components/UserForm/UserForm";

export const metadata = {
  title: "Edit User | Admin Dashboard",
};

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const session = await auth();

  if (!session?.user || !canManageUsers(session.user.role)) {
    redirect("/dashboard");
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  if (!user) {
    notFound();
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
        Edit User: {user.name || user.email}
      </h1>
      <UserForm user={user} currentUserId={session.user.id} />
    </div>
  );
}
