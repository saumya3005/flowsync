"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Avatar from '@/components/ui/Avatar';
import { User, Lock, Bell, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Update local form state when user context is ready
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
      });
    }
  }, [user]);

  const tabs = [
    { name: 'Profile', icon: User },
    { name: 'Security', icon: Lock },
    { name: 'Notifications', icon: Bell },
    { name: 'Appearance', icon: Palette },
  ];

  const handleSaveProfile = async () => {
    setMessage({ type: '', text: '' });
    setLoading(true);
    try {
      // In a real app, you'd send this to /api/users/profile
      // For now we'll just mock the update by updating local storage context
      // Note: we created an updateProfile in api.js: export const updateProfile = (data) => API.put('/users/profile', data);
      
      const res = await api.put('/users/profile', formData);
      if (res.data.success) {
        updateUser(res.data.data);
        setMessage({ type: 'success', text: 'Profile updated successfully' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // Handled by ProtectedRoute mostly, but safe guard

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-foreground/60 text-sm mt-1">Manage your account preferences and settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-foreground/70 hover:bg-foreground/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-foreground/50'}`} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-card border border-border rounded-2xl p-6 md:p-8">
          {activeTab === 'Profile' && (
            <div className="space-y-8 max-w-2xl">
              <div>
                <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                
                {message.text && (
                  <div className={`mb-4 p-3 rounded-xl text-sm border ${
                    message.type === 'success' 
                      ? 'bg-mint/10 text-mint border-mint/20' 
                      : 'bg-coral/10 text-coral border-coral/20'
                  }`}>
                    {message.text}
                  </div>
                )}

                <div className="flex items-center gap-6 mb-6">
                  {user.avatar ? (
                    <Avatar src={user.avatar} size="xl" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">
                      {initials}
                    </div>
                  )}
                  <div>
                    <Button variant="outline" size="sm" className="mb-2">Change Avatar</Button>
                    <p className="text-xs text-foreground/50">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground/80">Full Name</label>
                    <Input 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground/80">Email Address</label>
                    <Input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground/80">Role / Job Title</label>
                    <Input 
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-border flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setFormData({ name: user.name, email: user.email, role: user.role })}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}

          {activeTab !== 'Profile' && (
            <div className="py-12 text-center">
              <p className="text-foreground/50 mb-2">This section is a placeholder for the demo.</p>
              <Button variant="outline" onClick={() => setActiveTab('Profile')}>Back to Profile</Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
