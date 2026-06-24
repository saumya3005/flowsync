import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Layout, Users, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Navbar */}
      <header className="py-6 px-6 sm:px-12 flex justify-between items-center z-10 relative">
        <div className="flex items-center text-primary font-bold text-2xl tracking-wider">
          <Zap className="w-8 h-8 mr-2 fill-primary" />
          FlowSync
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">Log In</Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center text-center px-4 pt-20 pb-32 relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50 pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-150 h-150 bg-mint/10 rounded-full blur-[100px] -z-10 opacity-50 pointer-events-none"></div>

        <Badge variant="primary" className="mb-6 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm border border-primary/20">
          ✨ The new standard for product teams
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-8 leading-tight">
          Manage work <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-mint">beautifully.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mb-10 leading-relaxed">
          FlowSync brings your team's tasks, projects, and communication into one modern, fluid workspace. Say goodbye to scattered tools.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link href="/signup">
            <Button size="lg" className="w-full sm:w-auto px-8 h-14 text-base rounded-full group shadow-lg shadow-primary/25">
              Start for free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/dashboard">
             <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 h-14 text-base rounded-full bg-background/50 backdrop-blur-sm border-border hover:bg-foreground/5">
               View Demo
             </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full text-left">
          <FeatureCard 
            icon={<Layout className="w-6 h-6 text-violet-500" />}
            title="Fluid Boards"
            description="Drag and drop tasks effortlessly on our buttery smooth kanban boards."
          />
          <FeatureCard 
            icon={<Users className="w-6 h-6 text-mint-500" />}
            title="Real-time Collaboration"
            description="See who's working on what instantly. Comment and mention team members."
          />
          <FeatureCard 
            icon={<CheckCircle className="w-6 h-6 text-coral-500" />}
            title="Goal Tracking"
            description="Set project milestones and track progress visually with beautiful charts."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="glass-card p-6 rounded-3xl border border-border/50 hover:border-primary/30 transition-colors shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-foreground/60 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

function Badge({ children, className }) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
}
