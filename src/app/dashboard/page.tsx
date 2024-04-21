import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import Dashboard from "./Dashboard";

export default async function dashboard() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) redirect("/api/auth/login");

  const dbUser = await db.user.findFirst({
    where: { id: user.id },
  });

  if (!dbUser) redirect("/auth-callback?origin=dashboard");

  return <Dashboard />;
}
