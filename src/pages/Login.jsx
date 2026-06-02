import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-96 bg-white p-8 rounded-xl shadow-sm space-y-4">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border w-full p-3 rounded-lg text-sm focus:outline-none focus:border-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border w-full p-3 rounded-lg text-sm focus:outline-none focus:border-black"
        />
        <button
          onClick={login}
          disabled={loading}
          className="bg-black text-white w-full p-3 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}