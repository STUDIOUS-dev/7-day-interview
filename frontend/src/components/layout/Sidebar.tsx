import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Settings, 
  Search, 
  FileText, 
  Video 
} from 'lucide-react';

export function Sidebar() {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) return null;

  const recruiterNav = [
    { name: 'Dashboard', href: '/dashboard/recruiter', icon: LayoutDashboard },
    { name: 'Post a Job', href: '/jobs/new', icon: Briefcase },
    { name: 'Applicants', href: '/applicants', icon: Users },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const candidateNav = [
    { name: 'Find Jobs', href: '/dashboard/candidate', icon: Search },
    { name: 'My Applications', href: '/applications', icon: FileText },
    { name: 'Interview Room', href: '/interview', icon: Video },
    { name: 'Profile', href: '/profile', icon: Settings },
  ];

  const navItems = user.role === 'employer' ? recruiterNav : candidateNav;

  return (
    <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-64px)] w-64 border-r border-border-subtle bg-bg-surface hidden md:block">
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                isActive 
                  ? 'text-accent-primary' 
                  : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute inset-0 rounded-lg bg-accent-muted border-l-2 border-accent-primary"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <Icon className="relative z-10 h-5 w-5" />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
