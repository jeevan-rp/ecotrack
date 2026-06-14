import { Link } from 'react-router-dom';
import { Leaf, LayoutDashboard, PlusCircle, Lightbulb, User } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';

export default function Navigation() {
  return (
    <nav className="glass-panel mx-2 sm:mx-4 mt-4 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 sticky top-4 z-50">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-accent-green/20 rounded-lg">
          <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-accent-green" />
        </div>
        <span className="text-lg sm:text-xl font-bold tracking-wide">EcoTrack</span>
      </div>
      <div className="flex items-center gap-4 sm:gap-6 text-sm sm:text-base text-mint font-medium w-full sm:w-auto justify-around sm:justify-end">
        <Link to="/" className="flex items-center gap-1.5 hover:text-accent-green transition-colors">
          <LayoutDashboard className="w-4 h-4 sm:hidden" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
        <Link to="/log" className="flex items-center gap-1.5 hover:text-accent-green transition-colors">
          <PlusCircle className="w-4 h-4 sm:hidden" />
          <span className="hidden sm:inline">Log Activity</span>
        </Link>
        <Link to="/insights" className="flex items-center gap-1.5 hover:text-accent-green transition-colors">
          <Lightbulb className="w-4 h-4 sm:hidden" />
          <span className="hidden sm:inline">Insights</span>
        </Link>
        <Link to="/profile" className="flex items-center gap-1.5 hover:text-accent-green transition-colors">
          <User className="w-4 h-4 sm:hidden" />
          <span className="hidden sm:inline">Profile</span>
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
}
