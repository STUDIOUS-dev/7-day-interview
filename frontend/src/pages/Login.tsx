import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.access_token, response.data.user);
      toast.success('Welcome back!');
      
      if (response.data.user.role === 'employer') {
        navigate('/dashboard/recruiter');
      } else {
        navigate('/dashboard/candidate');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] w-full">
      {/* Brand Panel - Hidden on mobile */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center relative overflow-hidden bg-bg-surface border-r border-border-subtle">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(94,234,212,0.1)_0%,transparent_50%)]" />
        
        <div className="relative z-10 max-w-md text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-4 text-text-primary">Hire faster.</h1>
          <p className="text-lg text-text-secondary mb-12">
            AI that screens, interviews, and shortlists — before you lift a finger.
          </p>

          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="mx-auto w-72 rounded-2xl bg-bg-elevated p-6 border border-border-subtle shadow-glow"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-accent-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-accent-primary text-sm">✓</span>
                </div>
                <span className="text-sm text-text-primary">AI-Powered Candidate Screening</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-accent-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-accent-primary text-sm">✓</span>
                </div>
                <span className="text-sm text-text-primary">Automated Interview Scheduling</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-accent-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-accent-primary text-sm">✓</span>
                </div>
                <span className="text-sm text-text-primary">Smart Skill-Based Matching</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md p-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-text-primary">Sign in</h2>
            <p className="text-sm text-text-secondary mt-2">Welcome back to TalentStream</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full mt-6" loading={isLoading}>
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent-primary hover:underline">
              Register here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
