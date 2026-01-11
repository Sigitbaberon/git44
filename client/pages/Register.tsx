import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordMatch(newPassword === confirmPassword);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordMatch(password === newConfirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!passwordMatch) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = {
    hasMinLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*]/.test(password),
  };

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 to-transparent"></div>

      <div className="relative w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 mb-4">
            <span className="text-xl font-bold text-white">G44</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">git44</h1>
          <p className="text-slate-400">Professional Watermark Removal</p>
        </div>

        <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Create Account</CardTitle>
            <CardDescription className="text-slate-400">
              Join git44 to start removing watermarks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={handlePasswordChange}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    disabled={isLoading}
                  />
                </div>

                {password && (
                  <div className="mt-3 space-y-2 bg-slate-700/30 p-3 rounded-md">
                    <div className="flex items-center text-xs">
                      <div
                        className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordStrength.hasMinLength ? "bg-green-500" : "bg-slate-600"}`}
                      ></div>
                      <span
                        className={
                          passwordStrength.hasMinLength
                            ? "text-green-400"
                            : "text-slate-400"
                        }
                      >
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div
                        className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordStrength.hasUpperCase ? "bg-green-500" : "bg-slate-600"}`}
                      ></div>
                      <span
                        className={
                          passwordStrength.hasUpperCase
                            ? "text-green-400"
                            : "text-slate-400"
                        }
                      >
                        Uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div
                        className={`w-1.5 h-1.5 rounded-full mr-2 ${passwordStrength.hasNumber ? "bg-green-500" : "bg-slate-600"}`}
                      ></div>
                      <span
                        className={
                          passwordStrength.hasNumber
                            ? "text-green-400"
                            : "text-slate-400"
                        }
                      >
                        Number
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-200">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={`pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 ${
                      confirmPassword && !passwordMatch ? "border-red-500" : ""
                    }`}
                    disabled={isLoading}
                  />
                  {confirmPassword && passwordMatch && (
                    <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !passwordMatch}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-center text-slate-400 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-8">
          © 2024 git44. All rights reserved.
        </p>
      </div>
    </div>
  );
}
