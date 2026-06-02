import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Articles() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  console.log("data:", data);
  console.log("error:", error);
  setPosts(data || []);
  setLoading(false);
}

  async function deletePost(id) {
    if (!confirm("Delete this article?")) return;
    await supabase.from("posts").delete().eq("id", id);
    setPosts(posts.filter(p => p.id !== id));
  }

  async function togglePublish(post) {
    await supabase.from("posts").update({ published: !post.published }).eq("id", post.id);
    setPosts(posts.map(p => p.id === post.id ? { ...p, published: !p.published } : p));
  }

  if (loading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Link to="/articles/new" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium">
          New Article
        </Link>
      </div>

      {posts.length === 0 && <p className="text-gray-400 text-sm">No articles yet.</p>}

      <div className="space-y-3">
        {posts.map(post => {
             console.log("post id:", post.id)
             return(
          <div key={post.id} className="bg-white border rounded-xl p-5 flex items-center justify-between">
            <div>
              <div className="font-medium">{post.title}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(post.created_at).toLocaleDateString()} · {post.slug}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => togglePublish(post)}
                className={`text-xs px-3 py-1 rounded-full font-medium ${post.published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}
              >
                {post.published ? "Published" : "Draft"}
              </button>
              <Link to={`/articles/${post.id}`} className="text-sm text-blue-600 hover:underline">
                Edit
              </Link>
              <button onClick={() => deletePost(post.id)} className="text-sm text-red-500 hover:underline">
                Delete
              </button>
            </div>
          </div>
)})}
      </div>
    </div>
  );
}