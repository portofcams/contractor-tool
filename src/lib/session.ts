import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./db";
import { redirect } from "next/navigation";

export async function getContractor() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const contractor = await prisma.contractor.findUnique({
    where: { id: session.user.id },
  });

  if (!contractor) redirect("/login");
  return contractor;
}

export async function getSession() {
  return getServerSession(authOptions);
}
