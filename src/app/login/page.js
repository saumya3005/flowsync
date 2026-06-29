"use client";

import Link from "next/link";
import { Zap, Loader2, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [loginMethod, setLoginMethod] = useState("password"); // 'password' or 'otp'
  const [step, setStep] = useState("identifier"); // 'identifier' or 'verify'
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      await login(identifier, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!identifier) {
      setError("Please enter your email or phone number");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/send-otp", { identifier });
      if (res.data.success) {
        setSuccess("OTP sent! Please check your email or phone.");
        setStep("verify");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Check if user exists.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/verify-otp", { identifier, code: otp });
      if (res.data.success) {
        // We need to set the user context manually since we bypass normal login
        // But the easiest way is to reload or let AuthContext handle it if we store token
        localStorage.setItem("token", res.data.data.token);
        // Force a reload to let AuthContext pick it up
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
        <div className="max-w-sm w-full mx-auto">
          <div className="flex items-center text-primary font-bold text-xl mb-12">
            <Zap className="w-6 h-6 mr-2 fill-primary" />
            FlowSync
          </div>

          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-foreground/60 text-sm mb-8">
            {loginMethod === 'password' 
              ? "Enter your details to access your account." 
              : step === 'identifier' 
                ? "We'll send a secure OTP to your email or phone." 
                : `Enter the code sent to ${identifier}`}
          </p>

          <AnimatePresence mode="wait">
            {loginMethod === 'password' ? (
              <motion.form 
                key="password-form"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="space-y-4" 
                onSubmit={handlePasswordLogin}
              >
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground/80">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground/80">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>}

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border text-primary focus:ring-primary/50" />
                    <span className="text-foreground/70">Remember me</span>
                  </label>
                  <Link href="#" className="text-primary hover:underline font-medium">Forgot password?</Link>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Sign In"}
                </Button>

                <div className="pt-4 border-t border-border/50 text-center">
                  <button 
                    type="button" 
                    onClick={() => { setLoginMethod('otp'); setError(''); }}
                    className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
                  >
                    Or sign in with OTP (Passwordless)
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form 
                key="otp-form"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-4" 
                onSubmit={step === 'identifier' ? handleSendOTP : handleVerifyOTP}
              >
                {step === 'identifier' ? (
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground/80">Email or Phone Number</label>
                    <Input
                      type="text"
                      placeholder="user@example.com or +123456789"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-foreground/80">6-Digit Code</label>
                    <Input
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="tracking-[0.5em] text-center font-mono text-lg"
                    />
                  </div>
                )}

                {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>}
                {success && <p className="text-sm text-mint bg-mint/10 border border-mint/20 rounded-xl px-3 py-2">{success}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (step === 'identifier' ? "Send OTP" : "Verify & Login")}
                </Button>

                <div className="pt-4 border-t border-border/50 text-center flex items-center justify-between">
                  <button 
                    type="button" 
                    onClick={() => {
                      if (step === 'verify') setStep('identifier');
                      else setLoginMethod('password');
                      setError('');
                      setSuccess('');
                    }}
                    className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors flex items-center"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
                  </button>
                  
                  {step === 'verify' && (
                    <button 
                      type="button" 
                      onClick={handleSendOTP}
                      className="text-sm font-medium text-primary hover:underline transition-colors"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="mt-8 text-center text-sm text-foreground/60">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Illustration Section */}
      <div className="hidden lg:flex flex-1 bg-charcoal relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 right-0 w-full h-full bg-linear-to-br from-violet-dark/40 to-midnight"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[100px]"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 glass-card p-8 rounded-3xl max-w-md w-full shadow-2xl border border-white/10"
        >
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-4">
              FS
            </div>
            <div>
              <p className="font-semibold text-white">Secure login enabled</p>
              <p className="text-xs text-white/60">Connected with backend</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-3 bg-white/10 rounded-full w-3/4"></div>
            <div className="h-3 bg-white/10 rounded-full w-1/2"></div>
            <div className="h-3 bg-white/10 rounded-full w-5/6"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}