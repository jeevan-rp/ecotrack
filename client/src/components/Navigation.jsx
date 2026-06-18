import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LayoutDashboard, PlusCircle, Lightbulb, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Navigation Component
 * Renders the top navigation bar with links to different sections of the app.
 * Provides user profile and logout functionality.
 * @returns {JSX.Element} The rendered navigation bar component.
 */
export default function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel mx-2 sm:mx-4 mt-4 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 sticky top-4 z-50">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-accent-green/20 rounded-lg">
          <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-accent-green" />
        </div>
        <span className="text-lg sm:text-xl font-bold tracking-wide">EcoTrack</span>
      </div>
      <div className="flex items-center gap-4 sm:gap-6 text-sm sm:text-base text-mint font-medium w-full sm:w-auto justify-around sm:justify-end">
        <Link to="/" className="flex items-center gap-1.5 hover:text-accent-green transition-colors" aria-label="Go to Dashboard">
          <LayoutDashboard className="w-4 h-4 sm:hidden" aria-hidden="true" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
        <Link to="/log" className="flex items-center gap-1.5 hover:text-accent-green transition-colors" aria-label="Log new activity">
          <PlusCircle className="w-4 h-4 sm:hidden" aria-hidden="true" />
          <span className="hidden sm:inline">Log Activity</span>
        </Link>
        <Link to="/insights" className="flex items-center gap-1.5 hover:text-accent-green transition-colors" aria-label="View Insights">
          <Lightbulb className="w-4 h-4 sm:hidden" aria-hidden="true" />
          <span className="hidden sm:inline">Insights</span>
        </Link>
        <Link to="/profile" className="flex items-center gap-1.5 hover:text-accent-green transition-colors" aria-label="View Profile">
          <UserIcon className="w-4 h-4 sm:hidden" aria-hidden="true" />
          <span className="hidden sm:inline">Profile</span>
        </Link>
        <div className="flex items-center gap-3 border-l border-white/10 pl-4 sm:pl-6 ml-2 sm:ml-0">
           {user?.pfp ? (
             <img src={user.pfp} alt="Profile" className="w-8 h-8 rounded-full border border-accent-green object-cover" />
           ) : (
             <div className="w-8 h-8 rounded-full bg-accent-green/20 border border-accent-green flex items-center justify-center">
               <UserIcon className="w-4 h-4 text-accent-green" />
             </div>
           )}
           <button onClick={handleLogout} className="text-mint hover:text-red-400 transition-colors" title="Logout" aria-label="Logout of application">
             <LogOut className="w-5 h-5" aria-hidden="true" />
           </button>
        </div>
      </div>
    </nav>
  );
}
