import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <MainLayout
      title="Dashboard"
      actions={
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      }
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          Welcome, {user?.name || user?.email || "User"}
        </h2>
        <p className="mt-2 text-slate-600">
          You are signed in and can now access protected pages.
        </p>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
