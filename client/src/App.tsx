import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/auth/LoginForm";
import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import MyProfile from "@/pages/MyProfile";
import Employees from "@/pages/Employees";
import Attendance from "@/pages/Attendance";
import Leave from "@/pages/Leave";
import Payroll from "@/pages/Payroll";
import Expenses from "@/pages/Expenses";
import Performance from "@/pages/Performance";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import Contact from "@/pages/Contact";
import Invite from "@/pages/Invite";
import Setup from "@/pages/Setup";
import TestFlow from "@/pages/TestFlow";
import Teams from "@/pages/Teams";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/setup" element={<Setup />} />
        <Route path="/invite" element={<Invite />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<LoginForm />} />
      </Routes>
    );
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/invite" element={<Invite />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/profile/:employeeId" element={<MyProfile />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/project/:projectId" element={<ProjectDetail />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/test" element={<TestFlow />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
