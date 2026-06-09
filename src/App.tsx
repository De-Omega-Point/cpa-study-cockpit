import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Profile = lazy(() => import("./pages/Profile"));
const IllinoisTracker = lazy(() => import("./pages/IllinoisTracker"));
const AcademyHome = lazy(() => import("./pages/AcademyHome"));
const DeepDivePage = lazy(() => import("./pages/DeepDivePage"));
const AiCoachPage = lazy(() => import("./pages/AiCoachPage"));
const TestMasterPage = lazy(() => import("./pages/TestMasterPage"));
const PracticeExamPage = lazy(() => import("./pages/PracticeExamPage"));
const SimulationLabPage = lazy(() => import("./pages/SimulationLabPage"));
const VocabularyMasterPage = lazy(() => import("./pages/VocabularyMasterPage"));
const CaseStudyLibraryPage = lazy(() => import("./pages/CaseStudyLibraryPage"));
const WarRoomPage = lazy(() => import("./pages/WarRoomPage"));

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="page-container">Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tracker" element={<IllinoisTracker />} />
          <Route path="/academy" element={<AcademyHome />} />
          <Route path="/deep-dive" element={<DeepDivePage />} />
          <Route path="/ai-coach" element={<AiCoachPage />} />
          <Route path="/test-master" element={<TestMasterPage />} />
          <Route path="/practice-exam" element={<PracticeExamPage />} />
          <Route path="/simulations" element={<SimulationLabPage />} />
          <Route path="/vocabulary" element={<VocabularyMasterPage />} />
          <Route path="/cases" element={<CaseStudyLibraryPage />} />
          <Route path="/war-room" element={<WarRoomPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
