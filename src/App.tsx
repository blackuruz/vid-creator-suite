import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profiles from "./pages/Profiles";
import FileManager from "./pages/FileManager";
import TextEditor from "./pages/TextEditor";
import Monitor from "./pages/Monitor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Simple auth check - in production this would check for actual session/token
const isAuthenticated = () => {
  // For demo purposes, always return true
  // In real implementation, check if user is logged in
  return true;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? (
    <Layout>{children}</Layout>
  ) : (
    <Navigate to="/login" replace />
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profiles" element={
            <ProtectedRoute>
              <Profiles />
            </ProtectedRoute>
          } />
          <Route path="/files" element={
            <ProtectedRoute>
              <FileManager />
            </ProtectedRoute>
          } />
          <Route path="/editor" element={
            <ProtectedRoute>
              <TextEditor />
            </ProtectedRoute>
          } />
          <Route path="/monitor" element={
            <ProtectedRoute>
              <Monitor />
            </ProtectedRoute>
          } />
          <Route path="/scheduler" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
