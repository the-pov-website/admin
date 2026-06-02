import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Articles from "./pages/Articles";
import ArticleEditor from "./pages/ArticleEditor";
import Subscribers from "./pages/Subscribers";
import Newsletter from "./pages/Newsletter";

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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;

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
  <Route path="*" element={<Navigate to="/" />} />
</Routes>
    </Layout>
  );
}