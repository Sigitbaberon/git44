import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  Copy, 
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";

export default function History() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    setIsAuthenticated(true);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    navigate("/");
  };

  const handleDownload = (link: string) => {
    window.open(link, "_blank");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">My History</h1>
          <p className="text-slate-400">View all your previous watermark removals</p>
        </div>

        {/* Search Bar */}
        <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                type="text"
                placeholder="Search by video URL or job ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* History Table */}
        <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white">Processing History</CardTitle>
            <CardDescription className="text-slate-400">All your watermark removal jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-700">
                  <tr className="text-slate-400">
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Input URL</th>
                    <th className="text-left py-3 px-4">Created</th>
                    <th className="text-left py-3 px-4">Duration</th>
                    <th className="text-left py-3 px-4">Retries</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Sample row */}
                  <tr className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-400 mr-2" />
                        <span className="text-green-400 font-medium">Success</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <code className="text-slate-300 text-xs bg-slate-700/50 px-2 py-1 rounded">
                        tiktok.com/video/123456...
                      </code>
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      2 hours ago
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      45s
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      0
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleCopy("https://example.com/video")}
                        className="h-8 w-8"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDownload("https://example.com/video")}
                        className="h-8 w-8"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>

                  <tr className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                        <span className="text-red-400 font-medium">Failed</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <code className="text-slate-300 text-xs bg-slate-700/50 px-2 py-1 rounded">
                        instagram.com/reels/987654...
                      </code>
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      4 hours ago
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      120s
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      3
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleCopy("instagram.com/reels/987654")}
                        className="h-8 w-8"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>

                  <tr className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-blue-400 mr-2 animate-spin" />
                        <span className="text-blue-400 font-medium">Processing</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <code className="text-slate-300 text-xs bg-slate-700/50 px-2 py-1 rounded">
                        youtube.com/watch?v=555...
                      </code>
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      5 minutes ago
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      -
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      1
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleCopy("youtube.com/watch?v=555")}
                        className="h-8 w-8"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
