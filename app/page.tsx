import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import LoginForm from "@/modules/auth/components/LoginForm";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If already logged in, go to dashboard
  if (session) redirect("/dashboard");

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Welcome to CV Maker</h1>
        <LoginForm />
      </div>
    </main>
  );
}
