import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    const res = await register(name, email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Registration failed');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="glass-panel p-8 w-full max-w-md relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-accent-lime opacity-10 rounded-full blur-[80px]"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-accent-green/20 rounded-xl mb-4">
            <Leaf className="w-8 h-8 text-accent-green" />
          </div>
          <h2 className="text-3xl font-extrabold text-white text-center">Join EcoTrack</h2>
          <p className="text-mint text-sm mt-2">Start reducing your carbon footprint today</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-mint mb-1">Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-forest-dark/50 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-accent-green"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-mint mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-forest-dark/50 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-accent-green"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-mint mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-forest-dark/50 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-accent-green"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-accent-green text-forest-dark font-bold p-3 rounded-lg hover:bg-accent-lime transition-colors disabled:opacity-50 mt-2"
          >
            {isSubmitting ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-mint text-sm mt-6">
          Already have an account? <Link to="/login" className="text-accent-green hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
