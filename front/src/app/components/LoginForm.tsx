"use client";
import { useState } from "react";
import { login } from "@/api/auth";
import { useRouter } from "next/navigation";

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin() {
    try {
      const res = await login({ username, password });
      if (res.token) {
        localStorage.setItem("token", res.token);
        router.push("/");
      } else {
        alert("Token manquant dans la réponse !");
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        alert(e.toString());
      } else {
        alert("An unknown error occurred.");
      }
    }
  }

  return (
    <div className="flex-1 gap-5 flex flex-col">
      <h2 className="text-xl font-bold text-center">Login</h2>
      <div>
        <label className="block mb-2">Username</label>
        <input
          type="text"
          className="w-full"
          placeholder="Enter your username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label className="block mb-2">Password</label>
        <input
          type="password"
          className="w-full"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <span
          className="text-xs font-light text-accent cursor-pointer"
          onClick={() => alert("I don't have time for password management")}
          role="button"
          tabIndex={0}
          onKeyPress={e => {
            if (e.key === "Enter" || e.key === " ") {
              alert("I don't have time for password management");
            }
          }}
        >
          Forgot password ?
        </span>
      </div>
      <button className="bg-red-600 py-2 rounded-full mt-6" onClick={handleLogin}>
        Login
      </button>
      <span
        className="text-sm font-light text-accent cursor-pointer text-center"
        role="button"
        tabIndex={0}
        onClick={onSwitch}
      >
        Don&apos;t have an account? Sign in
      </span>
    </div>
  );
}
