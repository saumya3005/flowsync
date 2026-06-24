"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Avatar from '@/components/ui/Avatar';
import { currentUser } from '@/data/mockData';
import { User, Lock, Bell, Palette } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile');
  
  const tabs = [
    { name: 'Profile', icon: User },
    { name: 'Security', icon: Lock },
    { name: 'Notifications', icon: Bell },
    { name: 'Appearance', icon: Palette },
  ];

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
                <div className="flex items-center gap-6 mb-6">
                  <Avatar src={currentUser.avatar} size="xl" />
                  <div>
                    <Button variant="outline" size="sm" className="mb-2">Change Avatar</Button>
                    <p className="text-xs text-foreground/50">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-foreground/80">First Name</label>
                      <Input defaultValue="Alex" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-foreground/80">Last Name</label>
                      <Input defaultValue="Rivera" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground/80">Email Address</label>
                    <Input defaultValue={currentUser.email} type="email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground/80">Role / Job Title</label>
                    <Input defaultValue={currentUser.role} />
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-border flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          )}

          {activeTab !== 'Profile' && (
            <div className="py-12 text-center">
              <p className="text-foreground/50 mb-2">This section is a placeholder for the demo.</p>
              <Button variant="outline">Back to Profile</Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
