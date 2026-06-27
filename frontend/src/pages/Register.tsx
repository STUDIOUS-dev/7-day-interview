import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Briefcase, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function Register() {
  const [role, setRole] = useState<'employer' | 'candidate'>('candidate');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    company_name: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend validation
    if (formData.full_name.trim().length < 2) {
      toast.error('Full name must be at least 2 characters');
      return;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    if (role === 'employer' && !formData.company_name.trim()) {
      toast.error('Company name is required for employers');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name.trim(),
        role,
        company_name: role === 'employer' ? formData.company_name.trim() : undefined,
      });
      
      login(response.data.access_token, response.data.user);
      toast.success('Account created successfully!');
      
      if (role === 'employer') {
        navigate('/dashboard/recruiter');
      } else {
        navigate('/dashboard/candidate');
      }
    } catch (error: any) {
      const data = error.response?.data;
      const status = error.response?.status;
      
      if (data?.detail) {
        // Pydantic validation errors come as an array of objects
        if (Array.isArray(data.detail)) {
          const messages = data.detail.map((err: any) => {
            const field = err.loc?.[err.loc.length - 1];
            const fieldLabel = field
              ? field.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
              : '';
            return fieldLabel ? `${fieldLabel}: ${err.msg}` : err.msg;
          });
          toast.error(messages[0] || 'Please check your input');
        } else {
          // Standard HTTPException with string detail
          toast.error(data.detail);
        }
      } else if (status === 409) {
        toast.error('This email address is already registered');
      } else if (status === 422) {
        toast.error('Please check your input and try again');
      } else if (!error.response) {
        toast.error('Unable to connect to server. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
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
          <h1 className="text-5xl font-bold tracking-tight mb-4 text-text-primary">Join TalentStream.</h1>
          <p className="text-lg text-text-secondary">The automated hiring platform powered by AI.</p>
        </div>
      </div>

      {/* Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-text-primary">Create an account</h2>
          </div>

          <div className="flex gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole('candidate')}
              className={`flex-1 cursor-pointer rounded-xl border p-4 text-center transition-colors ${
                role === 'candidate' 
                  ? 'bg-accent-muted border-border-active text-accent-primary' 
                  : 'bg-bg-surface border-border-subtle text-text-secondary'
              }`}
            >
              <User className="mx-auto mb-2 h-6 w-6" />
              <div className="text-sm font-medium">I'm Looking</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole('employer')}
              className={`flex-1 cursor-pointer rounded-xl border p-4 text-center transition-colors ${
                role === 'employer' 
                  ? 'bg-accent-muted border-border-active text-accent-primary' 
                  : 'bg-bg-surface border-border-subtle text-text-secondary'
              }`}
            >
              <Briefcase className="mx-auto mb-2 h-6 w-6" />
              <div className="text-sm font-medium">I'm Hiring</div>
            </motion.div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
              <Input
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email address</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@example.com"
                required
              />
            </div>
            
            <AnimatePresence>
              {role === 'employer' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-sm font-medium text-text-secondary mb-1.5 mt-4">Company Name</label>
                  <Input
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    placeholder="Acme Inc."
                    required={role === 'employer'}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Confirm Password</label>
                <Input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-6" loading={isLoading}>
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-primary hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
