import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function MessageDetail() {
  const { id } = useParams();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadMessage();
  }, []);

  async function loadMessage() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("id", id)
      .single();

    setMessage(data);
  }

  if (!message) {
    return (
      <div className="p-10 text-gray-500">
        Loading message...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">

      <Link
        to="/messages"
        className="inline-block mb-6 text-sm text-gray-500 hover:text-black"
      >
        ← Back to Messages
      </Link>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">
              {message.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h1 className="text-xl font-bold">
                {message.name}
              </h1>

              <p className="text-gray-500 text-sm">
                {message.email}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {new Date(message.created_at).toLocaleString()}
              </p>
            </div>

          </div>
        </div>

        {/* Message */}
        <div className="p-8">
          <h2 className="font-semibold mb-4">
            Message
          </h2>

          <div className="bg-gray-50 rounded-xl p-6 whitespace-pre-wrap leading-relaxed">
            {message.message}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t p-6 flex gap-3">
          <a
            href={`mailto:${message.email}`}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Reply
          </a>

          <button
            onClick={() => navigator.clipboard.writeText(message.email)}
            className="border px-4 py-2 rounded-lg"
          >
            Copy Email
          </button>
        </div>

      </div>
    </div>
  );
}