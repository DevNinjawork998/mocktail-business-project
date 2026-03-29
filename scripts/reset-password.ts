/**
 * Reset a user's password and verify it works.
 * Usage: ADMIN_EMAIL=user@example.com ADMIN_PASSWORD=newpass tsx scripts/reset-password.ts
 *
 * Uses same env loading as seed-admin (.env.development.local, .env.local)
 */
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env") });
config({ path: resolve(__dirname, "../.env.development.local") });
config({ path: resolve(__dirname, "../.env.local"), override: true });

async function main() {
  const { prisma } = await import("../src/lib/prisma");

  const email = process.env.ADMIN_EMAIL?.trim();
  const newPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!email || !newPassword) {
    console.error("Error: ADMIN_EMAIL and ADMIN_PASSWORD are required");
    process.exit(1);
  }

  if (newPassword.length < 6) {
    console.error("Error: Password must be at least 6 characters");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`Error: No user found with email "${email}"`);
    console.error("Check that ADMIN_EMAIL matches an existing user exactly.");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  // Verify the new password works
  const isValid = await bcrypt.compare(newPassword, hashedPassword);
  if (!isValid) {
    console.error("Error: Password verification failed unexpectedly");
    process.exit(1);
  }

  console.log(`Password reset for ${email}`);
  console.log("You can now log in with this email and the new password.");
}

main()
  .then(async () => {
    const { prisma } = await import("../src/lib/prisma");
    await prisma.$disconnect();
  })
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  });
