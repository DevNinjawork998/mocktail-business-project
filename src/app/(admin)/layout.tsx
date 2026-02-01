import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { StyledThemeWrapper } from "@/theme";
import AdminSidebar from "./AdminSidebar";

export const metadata = {
  title: "Admin Dashboard | Mocktails",
  description: "Manage your products and ingredients",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <StyledThemeWrapper>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <AdminSidebar user={session.user} />
        <main style={{ flex: 1, padding: "2rem", backgroundColor: "#fafafa" }}>
          {children}
        </main>
      </div>
    </StyledThemeWrapper>
  );
}
