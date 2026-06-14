import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import LogActivity from './pages/LogActivity';
import Insights from './pages/Insights';
import Profile from './pages/Profile';
import Navigation from './components/Navigation';

const queryClient = new QueryClient();

// Add your clerk key to client/.env
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  useEffect(() => {
    // Hide Clerk development badge robustly
    const hideClerkBadge = () => {
      const elements = document.querySelectorAll('div');
      elements.forEach(el => {
        if (el.textContent && el.textContent.includes('Development mode') && el.textContent.includes('Secured by clerk')) {
          el.style.display = 'none';
        }
      });
    };
    
    // Run initially
    setTimeout(hideClerkBadge, 100);
    setTimeout(hideClerkBadge, 1000);
    setTimeout(hideClerkBadge, 3000);
    
    // Also use MutationObserver for dynamically injected badges
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => hideClerkBadge());
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, []);

  if (!clerkPubKey || clerkPubKey === 'pk_test_placeholder') {
    return (
      <div className="min-h-screen bg-forest-dark text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold text-red-400 mb-4">Missing Clerk API Key</h1>
        <p className="text-mint max-w-md">
          Please add your <code className="bg-black/30 px-2 py-1 rounded">VITE_CLERK_PUBLISHABLE_KEY</code> to the <code className="bg-black/30 px-2 py-1 rounded">client/.env</code> file to enable authentication.
        </p>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-forest-dark to-forest-light text-white font-sans selection:bg-accent-green selection:text-forest-dark">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
               <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-accent-green opacity-10 rounded-full blur-[100px]"></div>
               <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent-lime opacity-10 rounded-full blur-[100px]"></div>
            </div>
            
            <SignedIn>
              <Navigation />
              <main className="container mx-auto px-4 py-8 max-w-5xl">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/log" element={<LogActivity />} />
                  <Route path="/insights" element={<Insights />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            </SignedIn>
            
            <SignedOut>
              <div className="flex items-center justify-center min-h-screen">
                 <RedirectToSignIn />
              </div>
            </SignedOut>
          </div>
        </Router>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
