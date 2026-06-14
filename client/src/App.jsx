import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import LogActivity from './pages/LogActivity';
import Insights from './pages/Insights';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Navigation from './components/Navigation';

const queryClient = new QueryClient();

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-forest-dark text-white flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {children}
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-forest-dark to-forest-light text-white font-sans selection:bg-accent-green selection:text-forest-dark">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
               <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-accent-green opacity-10 rounded-full blur-[100px]"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent-lime opacity-10 rounded-full blur-[100px]"></div>
            </div>
            
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/log" element={<ProtectedRoute><LogActivity /></ProtectedRoute>} />
              <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
