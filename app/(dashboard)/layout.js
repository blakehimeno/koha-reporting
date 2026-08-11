import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-full flex">
      <Sidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}