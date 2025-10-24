import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import GeminiChat from "./components/geminiChat"; // ADD THIS
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";

import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 flex items-center justify-center p-4 overflow-hidden">
      {/* Modern glassmorphism card container */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-pink-400 opacity-20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-cyan-400 opacity-20 blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:18px_32px]" />
      </div>

      <main className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-800 p-0 sm:p-6 relative z-10">
        <Routes>
          <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
          {/* Protected Gemini route */}
          <Route path="/gemini" element={authUser ? <GeminiChat /> : <Navigate to={"/login"} />} />
        </Routes>
        <Toaster />
      </main>
    </div>
  );
}
export default App;