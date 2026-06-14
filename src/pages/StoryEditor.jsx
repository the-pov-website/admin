import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function StoryEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id) && id !== "new";

  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    image_url: "",
    author: "",
    published: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    async function load() {
      const { data } = await supabase
        .from("stories")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setForm({
          title: data.title || "",
          summary: data.summary || "",
          content: data.content || "",
          image_url: data.image_url || "",
          author: data.author || "",
          published: data.published || false,
        });
      }
    }

    load();
  }, [id]);

  function update(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function save() {
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      title: form.title,
      summary: form.summary,
      content: form.content,
      image_url: form.image_url,
      author: form.author,
      published: form.published,
    };

    const query = isEdit
      ? supabase.from("stories").update(payload).eq("id", id)
      : supabase.from("stories").insert(payload);

    const { error } = await query;

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/stories");
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {isEdit ? "Edit Story" : "Create Story"}
        </h1>

        <button
          onClick={() => navigate("/stories")}
          className="text-sm text-gray-500"
        >
          ← Back
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* BASIC */}
      <div className="border rounded-2xl p-6 mb-6 space-y-3">
        <h2 className="font-semibold">Story Info</h2>

        <input
          value={form.title}
          onChange={e => update("title", e.target.value)}
          placeholder="Story title"
          className="border w-full p-3 rounded"
        />

        <input
          value={form.summary}
          onChange={e => update("summary", e.target.value)}
          placeholder="Short summary"
          className="border w-full p-3 rounded"
        />

        <input
          value={form.author}
          onChange={e => update("author", e.target.value)}
          placeholder="Author / NGO name"
          className="border w-full p-3 rounded"
        />
      </div>

      {/* MEDIA */}
      <div className="border rounded-2xl p-6 mb-6 space-y-3">
        <h2 className="font-semibold">Media</h2>

        <input
          value={form.image_url}
          onChange={e => update("image_url", e.target.value)}
          placeholder="Image URL"
          className="border w-full p-3 rounded"
        />
      </div>

      {/* CONTENT */}
      <div className="border rounded-2xl p-6 mb-6 space-y-3">
        <h2 className="font-semibold">Story Content</h2>

        <textarea
          value={form.content}
          onChange={e => update("content", e.target.value)}
          placeholder="Write the full story..."
          className="border w-full p-3 rounded"
          rows={8}
        />
      </div>

      {/* PUBLISH */}
      <div className="border rounded-2xl p-6 mb-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={e => update("published", e.target.checked)}
          />
          Publish immediately
        </label>
      </div>

      {/* SAVE */}
      <button
        onClick={save}
        disabled={loading}
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        {loading ? "Saving..." : isEdit ? "Update Story" : "Create Story"}
      </button>
    </div>
  );
}