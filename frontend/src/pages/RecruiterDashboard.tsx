import { useEffect } from 'react';
import { useJobStore } from '@/store/jobStore';
import { JobCard } from '@/components/recruiter/JobCard';
import { PostJobModal } from '@/components/recruiter/PostJobModal';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion } from 'framer-motion';

export default function RecruiterDashboard() {
  const { myJobs, isLoading, fetchMyJobs } = useJobStore();

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const openJobs = myJobs.filter((j) => j.status === 'open').length;
  const closedJobs = myJobs.filter((j) => j.status === 'closed').length;
  const totalJobs = myJobs.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Dashboard</h1>
          <p className="text-text-secondary mt-1">Overview of your open positions and applicants.</p>
        </div>
        <PostJobModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Jobs', value: openJobs, sub: 'open positions' },
          { label: 'Closed Jobs', value: closedJobs, sub: 'positions filled/closed' },
          { label: 'Total Posted', value: totalJobs, sub: 'all time' },
        ].map((stat, i) => (
          <div key={i} className="bg-bg-surface border border-border-subtle rounded-xl p-6 shadow-card">
            <div className="text-4xl font-bold text-accent-primary mb-2">{stat.value}</div>
            <div className="text-sm font-medium text-text-secondary uppercase tracking-wider">{stat.label}</div>
            <div className="text-xs text-text-muted mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-6">Your Jobs</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        ) : myJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-border-subtle rounded-xl bg-bg-surface">
            <div className="h-16 w-16 rounded-full bg-accent-muted flex items-center justify-center mb-4">
              <span className="text-2xl">💼</span>
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">No jobs posted yet</h3>
            <p className="text-text-secondary mb-6 text-center max-w-sm">Post your first job to get started and let AI find your perfect candidates.</p>
            <PostJobModal />
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 xl:grid-cols-2 gap-6"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.05 }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {myJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
