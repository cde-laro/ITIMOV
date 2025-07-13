"use client";
import { useState } from "react";
import { register } from "@/api/auth";
import { useRouter } from "next/navigation";

export default function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleRegister() {
    try {
      const res = await register({ username, email, password });
      if (res.token) {
        console.log("Token received:", res.token); // Debugging log
        localStorage.setItem("token", res.token); // Store the correct token
        router.push("/");
      } else {
        alert("Token manquant dans la réponse !");
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        console.error("Unknown error occurred:", e);
        alert("An unknown error occurred.");
      }
    }
  }

  return (
    <div className="flex-1 gap-5 flex flex-col">
      <h2 className="text-xl font-bold text-center">Sign in</h2>
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
        <label className="block mb-2">Email</label>
        <input
          type="email"
          className="w-full"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
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
      </div>
      <button className="bg-red-600 py-2 rounded-full mt-6" onClick={handleRegister}>
        Sign in
      </button>
      <span
        className="text-sm font-light text-accent cursor-pointer text-center"
        role="button"
        tabIndex={0}
        onClick={onSwitch}
      >
        Already got an account? Login
      </span>
    </div>
  );
}
