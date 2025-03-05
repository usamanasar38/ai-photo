import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
    </div>
  );
}
