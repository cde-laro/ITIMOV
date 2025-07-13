"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("token"); // Remove token from localStorage
    router.replace("/login"); // Redirect to login page
  }, [router]);

  return null; // No UI needed
}
