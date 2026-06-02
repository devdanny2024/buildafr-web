import { BrowserRouter, Routes, Route } from "react-router";
import { LandingPage } from "./components/web/LandingPage";
import { AdminPage } from "./components/web/AdminPage";
import { MailerPage } from "./components/web/MailerPage";
import { VerifyEmailPage } from "./components/web/VerifyEmailPage";
import { PrivacyPage } from "./components/web/PrivacyPage";
import { TermsPage } from "./components/web/TermsPage";
import { LoginPage } from "./components/dashboard/LoginPage";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { OverviewPage } from "./components/dashboard/OverviewPage";
import { ProjectsPage } from "./components/dashboard/ProjectsPage";
import { TasksPage } from "./components/dashboard/TasksPage";
import { FinancialsPage } from "./components/dashboard/FinancialsPage";
import { TeamPage } from "./components/dashboard/TeamPage";
import { NotificationsPage } from "./components/dashboard/NotificationsPage";
import { AttendancePage } from "./components/dashboard/AttendancePage";
import { ReportsPage } from "./components/dashboard/ReportsPage";
import { AnalyticsPage } from "./components/dashboard/AnalyticsPage";
import { MediaPage } from "./components/dashboard/MediaPage";

function DashboardRoute({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Marketing */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/mailer" element={<MailerPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* App dashboard */}
        <Route path="/dashboard" element={<DashboardRoute><OverviewPage /></DashboardRoute>} />
        <Route path="/dashboard/projects" element={<DashboardRoute><ProjectsPage /></DashboardRoute>} />
        <Route path="/dashboard/tasks" element={<DashboardRoute><TasksPage /></DashboardRoute>} />
        <Route path="/dashboard/financials" element={<DashboardRoute><FinancialsPage /></DashboardRoute>} />
        <Route path="/dashboard/team" element={<DashboardRoute><TeamPage /></DashboardRoute>} />
        <Route path="/dashboard/notifications" element={<DashboardRoute><NotificationsPage /></DashboardRoute>} />
        <Route path="/dashboard/attendance" element={<DashboardRoute><AttendancePage /></DashboardRoute>} />
        <Route path="/dashboard/reports" element={<DashboardRoute><ReportsPage /></DashboardRoute>} />
        <Route path="/dashboard/analytics" element={<DashboardRoute><AnalyticsPage /></DashboardRoute>} />
        <Route path="/dashboard/media" element={<DashboardRoute><MediaPage /></DashboardRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
