"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/app/components/LoginForm"; // Ensure LoginForm is exported as default
import RegisterForm from "@/app/components/RegisterForm"; // Ensure RegisterForm is exported as default

export default function LoginPage() {
  const [showLogin, setShowLogin] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      router.replace("/");
    }
  }, [router]);

  return (
    <main className="flex flex-col mt-12 items-center w-full max-w-xl m-auto">
      <h1 className="text-2xl font-bold mb-10">Welcome back !</h1>
      <div className="flex px-5 gap-10 w-full">
        {showLogin ? (
          <LoginForm onSwitch={() => setShowLogin(false)} />
        ) : (
          <RegisterForm onSwitch={() => setShowLogin(true)} />
        )}
      </div>
    </main>
  );
}