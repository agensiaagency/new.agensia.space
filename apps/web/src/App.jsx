
import React from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import RevealAnimator from './components/RevealAnimator';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import MyProjectsPage from './pages/dashboard/MyProjectsPage';
import MyFormsPage from './pages/dashboard/MyFormsPage.jsx';
import FormDetailPage from './pages/dashboard/FormDetailPage.jsx';
import ProfilePage from './pages/dashboard/ProfilePage.jsx';
import MessagesPage from './pages/dashboard/MessagesPage.jsx';
import FilesPage from './pages/dashboard/FilesPage.jsx';
import ProjectPage from './pages/dashboard/ProjectPage.jsx';
import AllCustomersPage from './pages/dashboard/AllCustomersPage.jsx';
import AdminUserDashboard from './pages/dashboard/AdminUserDashboard.jsx';
import AdminIntakeFormsPage from './pages/dashboard/AdminIntakeFormsPage.jsx';
import NotificationsPage from './pages/dashboard/NotificationsPage.jsx';
import AnalyticsPage from './pages/dashboard/AnalyticsPage.jsx';
import CalendarPage from './pages/dashboard/CalendarPage.jsx';
import TimeTrackingPage from './pages/dashboard/TimeTrackingPage.jsx';
import RevisionsPage from './pages/dashboard/RevisionsPage.jsx';
import RevisionDetailPage from './pages/dashboard/RevisionDetailPage.jsx';
import AdminRevisionsPage from './pages/dashboard/AdminRevisionsPage.jsx';
import DesignReviewPage from './pages/dashboard/DesignReviewPage.jsx';
import ContentFormFillPage from './pages/dashboard/ContentFormFillPage.jsx';
import AdminContentFormsPage from './pages/dashboard/AdminContentFormsPage.jsx';
import AdminSettingsPage from './pages/dashboard/AdminSettingsPage.jsx';
import HostingLogsPage from './pages/dashboard/HostingLogsPage.jsx';
import WebsiteContentPage from './pages/dashboard/WebsiteContentPage.jsx';
import ImpressumPage from './pages/ImpressumPage';
import DatenschutzPage from './pages/DatenschutzPage';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import CookieConsentBanner from '@/components/CookieConsentBanner.jsx';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import NotFoundPage from '@/pages/NotFoundPage.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

// Intake Flow
import { IntakeProvider } from './contexts/IntakeContext';
import IntakeLayout from './pages/intake/IntakeLayout';
import IntakeLandingPage from './pages/intake/IntakeLandingPage';
import IntakeStep1 from './pages/intake/IntakeStep1';
import IntakeStep2 from './pages/intake/IntakeStep2';
import IntakeStep3 from './pages/intake/IntakeStep3';
import IntakeStep4 from './pages/intake/IntakeStep4';
import IntakeStep5 from './pages/intake/IntakeStep5';
import IntakeCheckout from './pages/intake/IntakeCheckout.jsx';
import IntakeConfirmationPage from './pages/intake/IntakeConfirmationPage';

// Dashboard Briefing Flow
import BriefingPage from './pages/dashboard/BriefingPage.jsx';
import BranchFormPage from './pages/dashboard/BranchFormPage.jsx';

const AdminRoute = ({ children }) => {
  const { isAdmin, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAdmin) return <Navigate to="/dashboard/overview" replace />;
  return children;
};

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <IntakeProvider>
                    <Router>
                        <RevealAnimator />
                        <ScrollToTop />
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/register" element={<Navigate to="/signup" replace />} />
                            <Route path="/impressum" element={<ImpressumPage />} />
                            <Route path="/datenschutz" element={<DatenschutzPage />} />
                            <Route path="/auth" element={<Navigate to="/login" replace />} />
                            
                            {/* Intake Flow */}
                            <Route path="/intake" element={<IntakeLayout />}>
                                <Route index element={<IntakeLandingPage />} />
                                <Route path="step1" element={<IntakeStep1 />} />
                                <Route path="step2" element={<IntakeStep2 />} />
                                <Route path="step3" element={<IntakeStep3 />} />
                                <Route path="step4" element={<IntakeStep4 />} />
                                <Route path="step5" element={<IntakeStep5 />} />
                                <Route path="checkout" element={<IntakeCheckout />} />
                                <Route path="confirmation" element={<IntakeConfirmationPage />} />
                            </Route>
                            
                            {/* Protected Dashboard Routes */}
                            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                                <Route index element={<Navigate to="/dashboard/overview" replace />} />
                                <Route path="overview" element={<DashboardOverview />} />
                                <Route path="projects" element={<MyProjectsPage />} />
                                <Route path="project" element={<Navigate to="/dashboard/projects" replace />} />
                                <Route path="projects/:projectId" element={<ProjectPage />} />
                                <Route path="forms" element={<MyFormsPage />} />
                                <Route path="forms/:id" element={<FormDetailPage />} />
                                <Route path="content-forms/:formId" element={<ContentFormFillPage />} />
                                <Route path="website-content" element={<WebsiteContentPage />} />
                                <Route path="messages" element={<MessagesPage />} />
                                <Route path="files" element={<FilesPage />} />
                                <Route path="calendar" element={<CalendarPage />} />
                                <Route path="notifications" element={<NotificationsPage />} />
                                <Route path="revisions" element={<RevisionsPage />} />
                                <Route path="revisions/:id" element={<RevisionDetailPage />} />
                                <Route path="reviews/:id" element={<DesignReviewPage />} />
                                <Route path="profile" element={<ProfilePage />} />
                                <Route path="hosting-logs" element={<HostingLogsPage />} />
                                
                                {/* Dashboard Briefing Flow */}
                                <Route path="briefing" element={<BriefingPage />} />
                                <Route path="briefing/:categoryId" element={<BranchFormPage />} />
                                
                                {/* Admin Routes */}
                                <Route path="customers" element={<AdminRoute><AllCustomersPage /></AdminRoute>} />
                                <Route path="customers/:userId" element={<AdminRoute><AdminUserDashboard /></AdminRoute>} />
                                <Route path="intake-forms" element={<AdminRoute><AdminIntakeFormsPage /></AdminRoute>} />
                                <Route path="admin-revisions" element={<AdminRoute><AdminRevisionsPage /></AdminRoute>} />
                                <Route path="admin-content-forms" element={<AdminRoute><AdminContentFormsPage /></AdminRoute>} />
                                <Route path="analytics" element={<AdminRoute><AnalyticsPage /></AdminRoute>} />
                                <Route path="time-tracking" element={<AdminRoute><TimeTrackingPage /></AdminRoute>} />
                                <Route path="settings" element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />
                            </Route>
                            
                            {/* Catch-all 404 Route */}
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                        <CookieConsentBanner />
                        <Toaster />
                    </Router>
                </IntakeProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;
