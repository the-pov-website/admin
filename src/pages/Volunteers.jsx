import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Volunteers() {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("volunteer_opportunities").select("*").order("created_at", { ascending: false });
      setPrograms(data || []);
    }
    load();
  }, []);

  async function deleteProgram(id) {
    if (!confirm("Delete this program?")) return;
    await supabase.from("volunteer_opportunities").delete().eq("id", id);
    setPrograms(programs.filter(p => p.id !== id));
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Programs</h1>
        <Link to="/volunteer/new" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium">New Program</Link>
      </div>
      <div className="space-y-3">
        {programs.map(p => (
          <div key={p.id} className="bg-white border rounded-xl p-5 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-xs text-gray-400 mt-1">{p.goal}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${p.published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                {p.published ? "Published" : "Draft"}
              </span>
              <Link to={`/volunteer/${p.id}`} className="text-sm text-blue-600 hover:underline">Edit</Link>
              <button onClick={() => deleteProgram(p.id)} className="text-sm text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}