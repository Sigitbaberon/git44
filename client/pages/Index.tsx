import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import {
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Cpu,
  Lock,
  CheckCircle2,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white">
      {/* Navbar */}
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-600/10 to-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            {/* Left side */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-6">
                  <Zap className="h-4 w-4 text-cyan-400 mr-2" />
                  <span className="text-sm text-cyan-300">
                    Fastest watermark removal platform
                  </span>
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Remove Watermarks
                  <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Instantly
                  </span>
                </h1>

                <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                  Professional watermark removal for TikTok, Instagram, YouTube
                  and more. Powered by advanced AI and automatic API rotation.
                  Built for developers.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold"
                    >
                      Open Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <Button
                        size="lg"
                        className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold"
                      >
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto border-slate-600 text-white hover:bg-slate-800"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-8">
                <div>
                  <div className="text-3xl font-bold text-cyan-400">10K+</div>
                  <p className="text-slate-400">Videos Processed</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-400">99.2%</div>
                  <p className="text-slate-400">Success Rate</p>
                </div>
              </div>
            </div>

            {/* Right side - Demo */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 p-8 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="h-3 bg-slate-700 rounded-full w-2/3"></div>
                  <div className="h-32 bg-slate-700/50 rounded-lg flex items-center justify-center border border-slate-600 border-dashed">
                    <div className="text-center">
                      <div className="text-cyan-400 mb-2">
                        Video Preview Area
                      </div>
                      <p className="text-slate-400 text-sm">
                        Drop your video or paste URL here
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-10 bg-slate-700 rounded-lg"></div>
                    <div className="h-10 bg-cyan-500/20 border border-cyan-500/50 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative px-4 py-20 sm:px-6 lg:px-8 border-t border-slate-700/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built for Modern
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Developers
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Complete API, automatic queue management, and real-time status
              tracking
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                  <Cpu className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Automatic API Rotation
                </h3>
                <p className="text-slate-400">
                  ScraperAPI key rotation with automatic cooldown and fallback
                  handling
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                  <Zap className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Async Queue System
                </h3>
                <p className="text-slate-400">
                  FIFO queue with multi-user concurrency and rate limiting
                  built-in
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                  <Lock className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">User Quotas</h3>
                <p className="text-slate-400">
                  Flexible quota system with daily limits and developer tier
                  management
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                  <Shield className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Multi-User Support
                </h3>
                <p className="text-slate-400">
                  Enterprise-grade isolation with JWT authentication and
                  role-based access
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                  <BarChart3 className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Real-time Analytics
                </h3>
                <p className="text-slate-400">
                  Comprehensive logging and monitoring dashboard with detailed
                  metrics
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors">
                  <CheckCircle2 className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Developer API</h3>
                <p className="text-slate-400">
                  Complete REST API with SDK support for Node.js, Python, PHP,
                  and more
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-300">Simple three-step process</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mb-6 font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Video</h3>
              <p className="text-slate-400">
                Paste your video link from TikTok, Instagram, YouTube, or Shorts
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mb-6 font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
              <p className="text-slate-400">
                Our advanced system processes and removes watermarks
                automatically
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mb-6 font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Download</h3>
              <p className="text-slate-400">
                Get your clean video instantly, ready to use and share
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8 border-t border-slate-700/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of developers using git44 for professional watermark
            removal
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-800"
              >
                View Documentation
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4 flex items-center">
                <div className="inline-flex items-center justify-center w-6 h-6 rounded bg-gradient-to-br from-cyan-500 to-blue-600 mr-2">
                  <span className="text-sm font-bold text-white">G</span>
                </div>
                git44
              </h3>
              <p className="text-slate-400 text-sm">
                Professional watermark removal platform
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Docs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-8">
            <p className="text-center text-slate-400 text-sm">
              © 2024 git44. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
