import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProfessionalIdentity from "./pages/ProfessionalIdentity";
import EducationTraining from "./pages/EducationTraining";
import PracticeEssentials from "./pages/PracticeEssentials";
import Locations from "./pages/Locations";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ForgotPassword from "./pages/ForgotPassword";
import Biography from "./pages/Biography";
import Publications from "./pages/Publications";
import ClinicalTrials from "./pages/ClinicalTrials";
import MediaPress from "./pages/MediaPress";
import MedicalExpertise from "./pages/MedicalExpertise";
import SystemAdmin from "./pages/SystemAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/professional-identity"
            element={<ProfessionalIdentity />}
          />
          <Route path="/education-training" element={<EducationTraining />} />
          <Route path="/practice-essentials" element={<PracticeEssentials />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/biography" element={<Biography />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/clinical-trials" element={<ClinicalTrials />} />
          <Route path="/media-press" element={<MediaPress />} />
          <Route path="/medical-expertise" element={<MedicalExpertise />} />
          <Route path="/system-admin" element={<SystemAdmin />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
