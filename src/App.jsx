import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Messages from "./pages/Messages";
import { supabase } from "./lib/supabase";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Articles from "./pages/Articles";
import ArticleEditor from "./pages/ArticleEditor";
import Subscribers from "./pages/Subscribers";
import Newsletter from "./pages/Newsletter";
import Programs from "./pages/Volunteers";
import ProgramEditor from "./pages/VolunteerEditor";
import StoryEditor from "./pages/StoryEditor";
import Volunteers from "./pages/Volunteers";
import VolunteerEditor from "./pages/VolunteerEditor";
import MessageDetail from "./pages/MessageDetail";
export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="mins-h-screen flex items-center justify-center text-gray-400">Loading...</div>;

  if (!session) return <Login />;

  return (
    <Layout>
      <Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/articles" element={<Articles />} />
  <Route path="/articles/new" element={<ArticleEditor />} />  {/* this must come first */}
  <Route path="/articles/:id" element={<ArticleEditor />} />  {/* then this */}
  <Route path="/subscribers" element={<Subscribers />} />
  <Route path="/newsletter" element={<Newsletter />} />
  <Route path="/messages" element={<Messages />} />
  <Route path="/messages/:id" element={<MessageDetail />} />
  <Route path="/volunteer" element={<Volunteers />} />
  <Route path="/volunteer/new" element={< VolunteerEditor/>} />
  <Route path="/volunteer/:id" element={<VolunteerEditor />} />

  <Route path="/stories" element={<StoryEditor />} />
  <Route path="/stories/new" element={<StoryEditor />} />
  <Route path="/stories/:id" element={<StoryEditor />} />
  <Route path="*" element={<Navigate to="/" />} />
</Routes>
    </Layout>
  );
}