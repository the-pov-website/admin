import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function VolunteerEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id) && id !== "new";

  const [form, setForm] = useState({
    title: "",
    goal: "",
    activities: "",
    outcomes: "",
    volunteer: "",
    location: "",
    commitment: "",
    category: "",
    skills: "",
    application_link: "",
    status: "open",
    published: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    async function load() {
      const { data } = await supabase
        .from("volunteer_opportunities")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setForm({
          title: data.title || "",
          goal: data.goal || "",
          activities: (data.activities || []).join("\n"),
          outcomes: data.outcomes || "",
          volunteer: data.volunteer || "",
          location: data.location || "",
          commitment: data.commitment || "",
          category: data.category || "",
          skills: (data.skills || []).join(", "),
          application_link: data.application_link || "",
          status: data.status || "open",
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
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      title: form.title,
      goal: form.goal,
      activities: form.activities
        .split("\n")
        .map(a => a.trim())
        .filter(Boolean),
      outcomes: form.outcomes,
      volunteer: form.volunteer,
      location: form.location,
      commitment: form.commitment,
      category: form.category,
      skills: form.skills
        .split(",")
        .map(s => s.trim())
        .filter(Boolean),
      application_link: form.application_link,
      status: form.status,
      published: form.published,
    };

    const query = isEdit
      ? supabase.from("volunteer_opportunities").update(payload).eq("id", id)
      : supabase.from("volunteer_opportunities").insert(payload);

    const { error } = await query;

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/volunteer");
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">

     <div className="flex justify-between items-center mb-8">
  <h1 className="text-3xl font-bold">
    {isEdit
      ? "Edit Volunteer Opportunity"
      : "Create Volunteer Opportunity"}
  </h1>

  <button
    onClick={() => navigate("/volunteer")}
    className="text-sm text-gray-500"
  >
    ← Back
  </button>
</div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* BASIC */}
      <div className="border rounded-2xl p-6 mb-6 space-y-3">
        <h2 className="font-semibold">Basic</h2>

        <input value={form.title} onChange={e => update("title", e.target.value)} placeholder="Title" className="border w-full p-3 rounded" />
        <input value={form.goal} onChange={e => update("goal", e.target.value)} placeholder="Goal" className="border w-full p-3 rounded" />
      </div>

      {/* DETAILS */}
      <div className="border rounded-2xl p-6 mb-6 space-y-3">
        <h2 className="font-semibold">Details</h2>

        <input value={form.location} onChange={e => update("location", e.target.value)} placeholder="Location" className="border w-full p-3 rounded" />
        <input value={form.commitment} onChange={e => update("commitment", e.target.value)} placeholder="Commitment (e.g. 2-5 hrs/week)" className="border w-full p-3 rounded" />
        <input value={form.category} onChange={e => update("category", e.target.value)} placeholder="Category" className="border w-full p-3 rounded" />

        <input value={form.skills} onChange={e => update("skills", e.target.value)} placeholder="Skills (comma separated)" className="border w-full p-3 rounded" />
      </div>

      {/* CONTENT */}
      <div className="border rounded-2xl p-6 mb-6 space-y-3">
        <h2 className="font-semibold">Content</h2>

        <textarea value={form.activities} onChange={e => update("activities", e.target.value)} placeholder="Activities (one per line)" className="border w-full p-3 rounded" rows={5} />

        <input value={form.outcomes} onChange={e => update("outcomes", e.target.value)} placeholder="Outcomes" className="border w-full p-3 rounded" />

        <input value={form.volunteer} onChange={e => update("volunteer", e.target.value)} placeholder="Volunteer requirements" className="border w-full p-3 rounded" />
      </div>

      {/* APPLICATION */}
      <div className="border rounded-2xl p-6 mb-6 space-y-3">
        <h2 className="font-semibold">Application</h2>

        <input value={form.application_link} onChange={e => update("application_link", e.target.value)} placeholder="Application link" className="border w-full p-3 rounded" />

        <select value={form.status} onChange={e => update("status", e.target.value)} className="border w-full p-3 rounded">
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="draft">Draft</option>
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={e => update("published", e.target.checked)}
          />
          Published
        </label>
      </div>

      {/* SAVE */}
      <button
        onClick={save}
        disabled={loading}
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        {loading ? "Saving..." : isEdit ? "Update" : "Create"}
      </button>
    </div>
  );
}