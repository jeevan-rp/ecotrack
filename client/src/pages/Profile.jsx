import React, { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Target, Award, Flame, Edit2, Check, X, Camera } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://ecotrack-back.vercel.app';

export default function Profile() {
  const { user } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [budgetInput, setBudgetInput] = useState('');
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPfp, setEditPfp] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      // Sync or fetch profile
      fetch(`${API_URL}/api/users/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authProviderId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName
        })
      })
      .then(res => res.json())
      .then(data => {
        setProfileData(data);
        setBudgetInput(data.weeklyBudget);
        setEditName(data.name || user.fullName);
        setEditPfp(data.pfp || '');
      })
      .catch(console.error);
    }
  }, [user]);

  const updateBudget = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/${user.id}/budget`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeklyBudget: Number(budgetInput) })
      });
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
        alert('Budget updated!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPfp(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/${user.id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, pfp: editPfp })
      });
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || !profileData) return <div className="text-center text-mint mt-10">Loading profile...</div>;

  const displayImage = profileData.pfp || user.imageUrl;
  const displayName = profileData.name || user.fullName;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-mint">
          Your Profile
        </h1>
        <p className="text-mint">Manage your goals, profile, and achievements.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Details */}
        <div className="glass-panel p-6 relative">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-mint hover:text-white"
              title="Edit Profile"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          ) : (
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={saveProfile}
                className="p-2 bg-accent-green/20 hover:bg-accent-green/40 rounded-full transition-colors text-accent-green"
                title="Save"
              >
                <Check className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setEditName(profileData.name || user.fullName);
                  setEditPfp(profileData.pfp || '');
                }}
                className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full transition-colors text-red-400"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6 mt-2">
            <div className="relative group">
              <img 
                src={isEditing ? (editPfp || user.imageUrl) : displayImage} 
                alt="Profile" 
                className="w-20 h-20 rounded-full border-2 border-accent-green object-cover" 
              />
              {isEditing && (
                <div 
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-6 h-6 text-white" />
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-forest-dark/50 border border-white/20 rounded-lg p-2 text-white focus:outline-none focus:border-accent-green font-bold text-xl"
                  placeholder="Your Name"
                />
              ) : (
                <h2 className="text-xl font-bold">{displayName}</h2>
              )}
              <p className="text-sm text-mint mt-1">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
          
          <div className="space-y-4 border-t border-white/10 pt-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-accent-lime" /> Weekly Carbon Budget
            </h3>
            <div className="flex items-center gap-4">
              <input 
                type="number" 
                className="w-full bg-forest-dark/50 border border-white/20 rounded-lg p-2 text-white focus:outline-none focus:border-accent-green"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
              />
              <span className="text-mint font-medium whitespace-nowrap">kg CO2</span>
            </div>
            <button 
              onClick={updateBudget}
              className="bg-accent-green text-forest-dark font-bold px-4 py-2 rounded-lg w-full hover:bg-accent-lime transition-colors"
            >
              Update Budget
            </button>
          </div>
        </div>

        {/* Gamification Stats */}
        <div className="space-y-6">
          <div className="glass-panel p-6 flex flex-col items-center justify-center text-center">
             <Flame className={`w-12 h-12 mb-2 ${profileData.currentStreak > 0 ? 'text-orange-500' : 'text-gray-500'}`} />
             <h3 className="text-2xl font-bold">{profileData.currentStreak} Days</h3>
             <p className="text-mint">Current Logging Streak</p>
          </div>

          <div className="glass-panel p-6">
             <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
               <Award className="w-5 h-5 text-yellow-400" /> Badges Earned
             </h3>
             {profileData.badges.length === 0 ? (
               <p className="text-sm text-mint">No badges yet. Keep logging to earn some!</p>
             ) : (
               <div className="flex flex-wrap gap-2">
                 {profileData.badges.map((badge, idx) => (
                   <span key={idx} className="bg-yellow-400/20 border border-yellow-400/50 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full">
                     {badge}
                   </span>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
