"use client";

import { tasks, users } from "@/data/mockData";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";

export default function TasksPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-2">Tasks</h1>
            <p className="text-foreground/60 mb-8">
                Manage all assigned tasks in one place.
            </p>

            <div className="grid gap-4">
                {tasks.map((task) => {
                    const user = users.find((u) => u.id === task.assignee);

                    return (
                        <div
                            key={task.id}
                            className="glass-card rounded-2xl p-5 flex items-center justify-between"
                        >
                            <div>
                                <h3 className="font-semibold text-lg">{task.title}</h3>
                                <p className="text-sm text-foreground/60 mt-1">
                                    {task.description}
                                </p>

                                <div className="flex gap-2 mt-3">
                                    <Badge>{task.status}</Badge>
                                    <Badge variant="warning">{task.priority}</Badge>
                                </div>
                            </div>

                            {user && (
                                <Avatar
                                    src={user.avatar}
                                    alt={user.name}
                                    size="sm"
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}