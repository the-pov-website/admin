import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Newsletter() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [subs, setSubs] = useState([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("subscribers").select("email");
      setSubs(data || []);
    }
    load();
  }, []);
  async function send() {
      console.log("key:", import.meta.env.VITE_BREVO_API_KEY)
  if (!subject || !body) return;
  setSending(true);

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": import.meta.env.VITE_BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject,
        htmlContent: `<p>${body.replace(/\n/g, "<br/>")}</p>`,
        sender: { name: "HopeRise", email: "natnaeltesfaldet76@gmail.com" },
        to: subs.map(s => ({ email: s.email })),
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Brevo error:", err);
      setSending(false);
      return;
    }

    setSent(true);
  } catch (err) {
    console.error("Failed to send:", err);
  }

  setSending(false);
}

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Newsletter</h1>
      <p className="text-sm text-gray-400 mb-8">{subs.length} subscribers</p>

      {sent ? (
        <div className="bg-emerald-50 text-emerald-700 p-6 rounded-xl font-medium">
          Newsletter sent to {subs.length} subscribers!
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Subject</label>
            <input
              placeholder="Newsletter subject"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="border w-full p-3 rounded-lg text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Body</label>
            <textarea
              placeholder="Write your newsletter here..."
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={16}
              className="border w-full p-3 rounded-lg text-sm focus:outline-none focus:border-black resize-none"
            />
          </div>
          <button
            onClick={send}
            disabled={sending}
            className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {sending ? "Sending..." : `Send to ${subs.length} subscribers`}
          </button>
        </div>
      )}
    </div>
  );
}