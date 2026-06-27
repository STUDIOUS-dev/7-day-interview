import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 z-40 w-full h-16 border-b border-border-subtle bg-bg-base/80 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-text-primary">
            TalentStream<span className="text-accent-primary">.ai</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-text-primary">{user.full_name}</div>
                  <div className="text-xs text-text-secondary capitalize">{user.role}</div>
                </div>
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="avatar" className="h-8 w-8 rounded-full object-cover border border-border-subtle" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-elevated border border-border-subtle text-sm font-medium text-text-primary">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
