import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/articles", label: "Articles" },
  { to: "/subscribers", label: "Subscribers" },
  { to: "/newsletter", label: "Newsletter" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
      <div className="p-6 font-bold text-xl border-b">Admin</div>
      <nav className="flex flex-col p-4 gap-1">
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium ${
              location.pathname === to
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}