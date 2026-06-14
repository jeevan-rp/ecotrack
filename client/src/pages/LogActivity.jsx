import React, { useState } from 'react';
import { Sparkles, Save, Info } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

export default function LogActivity() {
  const { user } = useUser();
  const [naturalText, setNaturalText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!naturalText.trim() || !user) return;
    
    setIsLoading(true);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:5000/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          textInput: naturalText
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setNaturalText('');
      } else {
        console.error("Failed to log activity");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-mint">
          Log Activity
        </h1>
        <p className="text-mint">Simply describe what you did, and our AI will calculate the impact.</p>
      </header>

      <div className="glass-panel p-8 relative overflow-hidden">
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-accent-green opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        
        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-mint mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-green" /> 
              Natural Language Input
            </label>
            <textarea
              className="w-full bg-forest-dark/50 border border-white/20 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-accent-green focus:ring-1 focus:ring-accent-green transition-all resize-none"
              rows={4}
              placeholder="e.g., 'I drove 15 miles to work in my gas car' or 'I ate a plant-based burger for lunch'"
              value={naturalText}
              onChange={(e) => setNaturalText(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-mint">
              <Info className="w-4 h-4" />
              Powered by Google Gemini
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-accent-green to-accent-lime text-forest-dark px-6 py-3 rounded-lg font-bold hover:shadow-[0_0_20px_rgba(0,255,163,0.4)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : (
                <>
                  <Save className="w-5 h-5" />
                  Save Activity
                </>
              )}
            </button>
          </div>
          
          {success && (
            <div className="mt-4 p-4 bg-accent-green/20 border border-accent-green/50 rounded-lg text-accent-green text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Activity logged successfully! Impact calculated.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
