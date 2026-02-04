import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables FIRST before any other imports
config({ path: resolve(__dirname, "../.env.development.local") });
config({ path: resolve(__dirname, "../.env.local") });
config({ path: resolve(__dirname, "../.env") });

async function main() {
  // Dynamic import after env vars are loaded
  const { prisma } = await import("../src/lib/prisma");
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME;
  const adminRole = (process.env.ADMIN_ROLE || "ADMIN") as
    | "SUPERADMIN"
    | "ADMIN"
    | "EDITOR";

  if (!adminEmail || !adminPassword) {
    console.error(
      "Error: ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required",
    );
    console.error("Please set them in your .env file or environment");
    process.exit(1);
  }

  // Validate role
  const validRoles = ["SUPERADMIN", "ADMIN", "EDITOR"];
  if (!validRoles.includes(adminRole)) {
    console.error(`Error: ADMIN_ROLE must be one of: ${validRoles.join(", ")}`);
    process.exit(1);
  }

  console.log(`Seeding ${adminRole} user...`);

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: adminRole,
      name: adminName,
    },
    create: {
      email: adminEmail,
      name: adminName,
      password: hashedPassword,
      role: adminRole,
    },
  });

  console.log(
    `Admin user created/updated: ${user.email} (name: ${user.name}, role: ${user.role})`,
  );
}

main()
  .then(async () => {
    const { prisma } = await import("../src/lib/prisma");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error seeding admin user:", e);
    const { prisma } = await import("../src/lib/prisma");
    await prisma.$disconnect();
    process.exit(1);
  });
