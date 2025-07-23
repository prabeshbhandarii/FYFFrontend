"use client";

import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function Home() {
  const handleLogin = () => {
    redirect("/auth/signin");
  };

  return (
    <div>
      hello world!!
      <span>
        <Button onClick={handleLogin}>Login</Button>
      </span>
    </div>
  );
}
