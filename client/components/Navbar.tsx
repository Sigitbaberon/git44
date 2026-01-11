import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";

interface NavbarProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export default function Navbar({ isAuthenticated = false, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    if (onLogout) onLogout();
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "text-cyan-400" : "text-slate-300 hover:text-white";
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
              <span className="text-lg font-bold text-white">G</span>
            </div>
            <span className="text-xl font-bold text-white hidden sm:inline">git44</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={`text-sm font-medium transition-colors ${isActive("/dashboard")}`}>
                  Dashboard
                </Link>
                <Link to="/history" className={`text-sm font-medium transition-colors ${isActive("/history")}`}>
                  History
                </Link>
                <Link to="/developer-api" className={`text-sm font-medium transition-colors ${isActive("/developer-api")}`}>
                  Developer
                </Link>
                <Link to="/admin" className={`text-sm font-medium transition-colors ${isActive("/admin")}`}>
                  Admin
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className={`text-sm font-medium transition-colors ${isActive("/")}`}>
                  Home
                </Link>
                <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Pricing
                </a>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-slate-700/50">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                >
                  Dashboard
                </Link>
                <Link
                  to="/history"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                >
                  History
                </Link>
                <Link
                  to="/developer-api"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                >
                  Developer
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                >
                  Admin
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                >
                  Home
                </Link>
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                >
                  Pricing
                </a>
                <div className="pt-2 space-y-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
