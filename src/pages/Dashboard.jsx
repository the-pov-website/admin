import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [stats, setStats] = useState({ posts: 0, subscribers: 0, published: 0 });

  useEffect(() => {
    async function load() {
      const [{ count: posts }, { count: subscribers }, { count: published }] = await Promise.all([
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase.from("subscribers").select("*", { count: "exact", head: true }),
        supabase.from("posts").select("*", { count: "exact", head: true }).eq("published", true),
      ]);
      setStats({ posts, subscribers, published });
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        {[
          { label: "Total Articles", value: stats.posts },
          { label: "Published", value: stats.published },
          { label: "Subscribers", value: stats.subscribers },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl p-6 border">
            <div className="text-3xl font-bold mb-1">{value ?? 0}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}