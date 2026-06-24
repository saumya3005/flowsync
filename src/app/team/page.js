"use client";

import DashboardLayout from '@/components/layout/DashboardLayout';
import { users } from '@/data/mockData';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { Mail, MoreHorizontal, UserPlus } from 'lucide-react';

export default function TeamPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Team Members</h1>
          <p className="text-foreground/60 text-sm mt-1">Manage your workspace members and their roles.</p>
        </div>
        <Button><UserPlus className="w-4 h-4 mr-2" /> Invite Member</Button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-foreground/5 text-foreground/70 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-foreground/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={user.avatar} size="md" status={user.status} />
                      <div>
                        <div className="font-medium text-foreground">{user.name}</div>
                        <div className="text-foreground/50 text-xs flex items-center mt-0.5">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground/80">{user.role}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      user.status === 'online' ? 'bg-mint/10 text-mint' : 'bg-foreground/10 text-foreground/60'
                    }`}>
                      {user.status || 'Offline'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-foreground/40 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
