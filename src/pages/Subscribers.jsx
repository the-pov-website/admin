import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Subscribers() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false });
    setSubs(data || []);
    setLoading(false);
  }

  async function deleteSub(id) {
    if (!confirm("Remove this subscriber?")) return;
    await supabase.from("subscribers").delete().eq("id", id);
    setSubs(subs.filter(s => s.id !== id));
  }

  if (loading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Subscribers</h1>
        <span className="text-sm text-gray-400">{subs.length} total</span>
      </div>

      {subs.length === 0 && <p className="text-gray-400 text-sm">No subscribers yet.</p>}

      <div className="space-y-2">
        {subs.map(sub => (
          <div key={sub.id} className="bg-white border rounded-xl px-5 py-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{sub.email}</div>
              <div className="text-xs text-gray-400 mt-0.5">
                {new Date(sub.created_at).toLocaleDateString()}
              </div>
            </div>
            <button onClick={() => deleteSub(sub.id)} className="text-sm text-red-500 hover:underline">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}