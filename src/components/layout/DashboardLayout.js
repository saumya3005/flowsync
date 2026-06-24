import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <div className="hidden md:block w-64 shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background/50">
          <div className="container mx-auto p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
