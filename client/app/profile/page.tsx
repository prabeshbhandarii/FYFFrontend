import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  return <div>Welcome, {session.user?.email}</div>;
}
