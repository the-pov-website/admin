import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setMessages(data || []);
    }

    setLoading(false);
  }

  async function deleteMessage(id) {
    if (!confirm("Delete this message?")) return;

    await supabase
      .from("messages")
      .delete()
      .eq("id", id);

    setMessages(messages.filter(m => m.id !== id));
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
   <div className="space-y-4">
  {messages.map((msg) => (
    <div
      key={msg.id}
      className="bg-white border rounded-2xl p-5 hover:shadow-md transition"
    >
      <div className="flex justify-between gap-4">

        {/* Left */}
        <div className="flex gap-4 flex-1">

          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold">
            {msg.name?.charAt(0)?.toUpperCase()}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">
                {msg.name}
              </h3>

              <span className="text-xs text-gray-400">
                {new Date(msg.created_at).toLocaleDateString()}
              </span>
            </div>

            <p className="text-sm text-gray-500">
              {msg.email}
            </p>

            <p className="text-gray-600 mt-2 line-clamp-2">
              {msg.message}
            </p>
          </div>

        </div>

        {/* Right */}
        <div className="flex flex-col gap-2 shrink-0">
          <Link
            to={`/messages/${msg.id}`}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm text-center"
          >
            View
          </Link>

          <button
            onClick={() => deleteMessage(msg.id)}
            className="px-4 py-2 rounded-lg border text-red-500 text-sm"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  ))}
</div>
  );
}