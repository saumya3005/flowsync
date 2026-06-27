"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Avatar from '@/components/ui/Avatar';
import { User, Lock, Bell, Palette, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');
  
  // Profile State
  const [profileData, setProfileData] = useState({ name: '', email: '', role: '' });
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  // Security State
  const [securityData, setSecurityData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Preferences State
  const [preferences, setPreferences] = useState({
    emailNotifications: true, taskReminders: true, projectUpdates: true, commentAlerts: true
  });
  const [theme, setTheme] = useState({ mode: 'light', accent: '#635BFF' });

  // Generic State
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || '', email: user.email || '', role: user.role || '' });
      setAvatarPreview(user.avatar || null);
      if (user.preferences) setPreferences(user.preferences);
      if (user.theme) setTheme(user.theme);
    }
  }, [user]);

  const tabs = [
    { name: 'Profile', icon: User },
    { name: 'Security', icon: Lock },
    { name: 'Notifications', icon: Bell },
    { name: 'Appearance', icon: Palette },
  ];

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  // --- Profile Actions ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 800000) {
        showMessage('error', 'Image size must be less than 800KB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      if (avatarPreview && avatarPreview !== user.avatar) {
        const avatarRes = await api.put('/users/avatar', { avatar: avatarPreview });
        if (avatarRes.data.success) {
          updateUser({ ...user, avatar: avatarPreview });
        }
      }

      const res = await api.put('/users/profile', profileData);
      if (res.data.success) {
        updateUser(res.data.data);
        showMessage('success', 'Profile updated successfully');
      }
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // --- Security Actions ---
  const handleUpdatePassword = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await api.put('/users/password', {
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword
      });
      if (res.data.success) {
        showMessage('success', 'Password updated successfully');
        setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  // --- Preferences Actions ---
  const handleUpdatePreferences = async () => {
    setLoading(true);
    try {
      const res = await api.put('/users/preferences', { preferences, theme });
      if (res.data.success) {
        updateUser({ ...user, preferences: res.data.data.preferences, theme: res.data.data.theme });
        showMessage('success', 'Preferences saved successfully');
      }
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const initials = user.name ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-foreground/60 text-sm mt-1">Manage your account preferences and settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 relative">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => { setActiveTab(tab.name); setMessage({type:'', text:''}); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-foreground/70 hover:bg-foreground/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-foreground/50'}`} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-card border border-border shadow-sm rounded-2xl p-6 md:p-8 min-h-125">
          
          <AnimatePresence mode="wait">
            {message.text && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`absolute top-0 right-0 p-4 rounded-xl text-sm border shadow-lg z-50 flex items-center gap-3 ${
                  message.type === 'success' ? 'bg-mint text-white border-mint/20' : 'bg-coral text-white border-coral/20'
                }`}
              >
                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : null}
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          {activeTab === 'Profile' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 max-w-2xl">
              <div>
                <h3 className="text-lg font-semibold mb-6">Profile Information</h3>
                
                <div className="flex items-center gap-6 mb-8">
                  {avatarPreview ? (
                    <Avatar src={avatarPreview} size="xl" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">
                      {initials}
                    </div>
                  )}
                  <div>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                    <Button variant="outline" size="sm" className="mb-2" onClick={() => fileInputRef.current.click()}>
                      <Upload className="w-4 h-4 mr-2" /> Upload Avatar
                    </Button>
                    <p className="text-xs text-foreground/50">JPG, GIF or PNG. Max size 800KB</p>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground/80">Full Name</label>
                    <Input value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground/80">Email Address</label>
                    <Input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} disabled className="opacity-70 cursor-not-allowed bg-foreground/5" />
                    <p className="text-xs text-foreground/40 mt-1">Contact support to change your email address.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground/80">Role / Job Title</label>
                    <Input value={profileData.role} onChange={(e) => setProfileData({...profileData, role: e.target.value})} />
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-border flex justify-end gap-3">
                <Button onClick={handleSaveProfile} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Save Changes
                </Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'Security' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 max-w-xl">
              <div>
                <h3 className="text-lg font-semibold mb-6">Change Password</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground/80">Current Password</label>
                    <Input type="password" value={securityData.currentPassword} onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground/80">New Password</label>
                    <Input type="password" value={securityData.newPassword} onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground/80">Confirm New Password</label>
                    <Input type="password" value={securityData.confirmPassword} onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-border flex justify-end gap-3">
                <Button onClick={handleUpdatePassword} disabled={loading || !securityData.newPassword}>
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Update Password
                </Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'Notifications' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 max-w-xl">
              <div>
                <h3 className="text-lg font-semibold mb-6">Notification Preferences</h3>
                <div className="space-y-6">
                  {Object.keys(preferences).map((key) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-xs text-foreground/50">Receive alerts for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={preferences[key]} onChange={() => setPreferences({...preferences, [key]: !preferences[key]})} />
                        <div className="w-11 h-6 bg-foreground/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-border flex justify-end gap-3">
                <Button onClick={handleUpdatePreferences} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Save Preferences
                </Button>
              </div>
            </motion.div>
          )}

          {activeTab === 'Appearance' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 max-w-xl">
              <div>
                <h3 className="text-lg font-semibold mb-6">Theme Settings</h3>
                <div className="mb-8">
                  <p className="font-medium text-sm mb-3">Color Mode</p>
                  <div className="flex gap-4">
                    {['light', 'dark', 'system'].map(mode => (
                      <button 
                        key={mode} 
                        onClick={() => setTheme({...theme, mode})}
                        className={`px-4 py-2 border rounded-xl text-sm capitalize transition-all ${theme.mode === mode ? 'border-primary bg-primary/5 text-primary font-medium' : 'border-border text-foreground/70 hover:bg-foreground/5'}`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-sm mb-3">Accent Color</p>
                  <div className="flex gap-3">
                    {['#635BFF', '#00C2A8', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6'].map(color => (
                      <button 
                        key={color}
                        onClick={() => setTheme({...theme, accent: color})}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform ${theme.accent === color ? 'ring-2 ring-offset-2 ring-foreground scale-110' : 'hover:scale-110'}`}
                        style={{ backgroundColor: color }}
                      >
                        {theme.accent === color && <CheckCircle2 className="w-5 h-5 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-border flex justify-end gap-3">
                <Button onClick={handleUpdatePreferences} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Save Appearance
                </Button>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}
