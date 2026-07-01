"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { motion } from "framer-motion";
import API from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Developer",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill all required fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      if (res.data.success) {
        localStorage.setItem("flowsyncUser", JSON.stringify(res.data.data));
        localStorage.setItem("flowsyncToken", res.data.data.token);

        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        <div className="max-w-sm w-full mx-auto">
          <div className="flex items-center text-primary font-bold text-xl mb-10">
            <Zap className="w-6 h-6 mr-2 fill-primary" />
            FlowSync
          </div>

          <h1 className="text-3xl font-bold mb-2">Create an account</h1>
          <p className="text-foreground/60 text-sm mb-8">
            Start managing your projects efficiently today.
          </p>

          {error && (
            <div className="mb-4 rounded-xl bg-red-500/10 text-red-500 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground/80">
                Full Name
              </label>
              <Input
                name="name"
                type="text"
                placeholder="Saumya Agrahari"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground/80">
                Email
              </label>
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground/80">
                Password
              </label>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5 text-foreground/80">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              >
                <option value="Developer">Developer</option>
                <option value="Manager">Manager</option>
                <option value="Student">Student</option>
                <option value="Member">Member</option>
              </select>
            </div>

            <Button className="w-full mt-4" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-foreground/60">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-charcoal relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-bl from-mint/20 to-midnight"></div>
        <div className="absolute bottom-1/4 right-1/4 w-125 h-125 bg-primary/20 rounded-full blur-[120px]"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 glass-card p-10 rounded-3xl max-w-lg w-full shadow-2xl text-center border border-white/10 text-white"
        >
          <Zap className="w-12 h-12 mx-auto mb-6 fill-mint text-mint" />
          <h2 className="text-2xl font-bold mb-4">Join thousands of teams</h2>
          <p className="text-white/70 leading-relaxed mb-8">
            FlowSync helps teams manage projects, tasks, and collaboration in one workspace.
          </p>
        </motion.div>
      </div>
    </div>
  );
}