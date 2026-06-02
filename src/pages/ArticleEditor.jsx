import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ArticleEditor() {
  const { id } = useParams();
  const params = useParams();
  const isEdit = Boolean(id) && id !== "new" && id !== undefined;
  console.log("id from params:", id);
  const navigate = useNavigate();


  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  if (!id || id === "new" || id === undefined) return;
  load();
}, [id]);

async function load() {
  if (!id || id === "new") return; // extra guard
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  if (data) {
    setTitle(data.title);
    setSlug(data.slug);
    setExcerpt(data.excerpt || "");
    setContent(data.content || "");
    setImageUrl(data.image_url || "");
    setPublished(data.published);
  }
}

  function generateSlug(val) {
    return val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }

  async function save() {
  if (!title || !slug) { setError("Title and slug are required"); return; }
  setLoading(true);
  setError("");

  const payload = { title, slug, excerpt, content, image_url: imageUrl, published };
  console.log("saving payload:", payload); // add this

  if (isEdit) {
    const { data, error } = await supabase.from("posts").update(payload).eq("id", id);
    console.log("update result:", data, error); // add this
    if (error) { setError(error.message); setLoading(false); return; }
  } else {
    const { data, error } = await supabase.from("posts").insert(payload);
    console.log("insert result:", data, error); // add this
    if (error) { setError(error.message); setLoading(false); return; }
  }

  setLoading(false);
  navigate("/articles");
}

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{isEdit ? "Edit Article" : "New Article"}</h1>
        <button onClick={() => navigate("/articles")} className="text-sm text-gray-500 hover:text-black">
          ← Back
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Title</label>
          <input
            placeholder="Article title"
            value={title}
            onChange={e => { setTitle(e.target.value); if (!isEdit) setSlug(generateSlug(e.target.value)); }}
            className="border w-full p-3 rounded-lg text-sm focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1">Slug</label>
          <input
            placeholder="article-slug"
            value={slug}
            onChange={e => setSlug(generateSlug(e.target.value))}
            className="border w-full p-3 rounded-lg text-sm focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1">Image URL</label>
          <input
            placeholder="https://..."
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            className="border w-full p-3 rounded-lg text-sm focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1">Excerpt</label>
          <textarea
            placeholder="Short description..."
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            rows={3}
            className="border w-full p-3 rounded-lg text-sm focus:outline-none focus:border-black resize-none"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1">Content</label>
          <textarea
            placeholder="Write your article here..."
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={16}
            className="border w-full p-3 rounded-lg text-sm focus:outline-none focus:border-black resize-none font-mono"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={e => setPublished(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="published" className="text-sm text-gray-600">Publish immediately</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={save}
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Saving..." : isEdit ? "Update Article" : "Publish Article"}
          </button>
          <button onClick={() => navigate("/articles")} className="border px-6 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}