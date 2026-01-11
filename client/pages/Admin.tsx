import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  Users,
  Activity,
  Key,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export default function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    setIsAuthenticated(true);
    // Check if user is admin - in real app, this would come from token/API
    setIsAdmin(true);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    navigate("/");
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-slate-400">
            Manage keys, users, and monitor system health
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-cyan-400">1,247</p>
                </div>
                <Users className="h-8 w-8 text-cyan-400/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Jobs</p>
                  <p className="text-3xl font-bold text-green-400">8,934</p>
                </div>
                <Activity className="h-8 w-8 text-green-400/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Success Rate</p>
                  <p className="text-3xl font-bold text-blue-400">99.2%</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-blue-400/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Avg Latency</p>
                  <p className="text-3xl font-bold text-yellow-400">2.4s</p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-400/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
          <Tabs defaultValue="scraper-keys" className="w-full">
            <CardHeader className="border-b border-slate-700">
              <TabsList className="bg-slate-700 border-b border-slate-600 w-full justify-start">
                <TabsTrigger
                  value="scraper-keys"
                  className="text-slate-300 data-[state=active]:text-white"
                >
                  <Key className="h-4 w-4 mr-2" />
                  ScraperAPI Keys
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="text-slate-300 data-[state=active]:text-white"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Users
                </TabsTrigger>
                <TabsTrigger
                  value="logs"
                  className="text-slate-300 data-[state=active]:text-white"
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Logs
                </TabsTrigger>
                <TabsTrigger
                  value="queue"
                  className="text-slate-300 data-[state=active]:text-white"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Queue
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            {/* ScraperAPI Keys Tab */}
            <TabsContent value="scraper-keys">
              <CardContent className="pt-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">API Keys</h3>
                  <Button className="bg-cyan-600 hover:bg-cyan-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Key
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-700 text-slate-400">
                      <tr>
                        <th className="text-left py-3 px-4">API Key</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Usage</th>
                        <th className="text-left py-3 px-4">Last Used</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="py-4 px-4">
                          <code className="text-slate-300 text-xs bg-slate-700/50 px-2 py-1 rounded">
                            sk_live_abc123...
                          </code>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/50">
                            Active
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-300">
                          1,234 requests
                        </td>
                        <td className="py-4 px-4 text-slate-400">
                          2 minutes ago
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                          >
                            <Edit2 className="h-4 w-4" />
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

                      <tr className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="py-4 px-4">
                          <code className="text-slate-300 text-xs bg-slate-700/50 px-2 py-1 rounded">
                            sk_live_def456...
                          </code>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/50">
                            Limited
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-300">
                          5,678 requests
                        </td>
                        <td className="py-4 px-4 text-slate-400">1 hour ago</td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                          >
                            <Edit2 className="h-4 w-4" />
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

                      <tr className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="py-4 px-4">
                          <code className="text-slate-300 text-xs bg-slate-700/50 px-2 py-1 rounded">
                            sk_live_ghi789...
                          </code>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/50">
                            Cooldown
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-300">
                          9,012 requests
                        </td>
                        <td className="py-4 px-4 text-slate-400">1 day ago</td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                          >
                            <Edit2 className="h-4 w-4" />
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
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <CardContent className="pt-6 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 flex-1">
                    <Input
                      placeholder="Search users by email or ID..."
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                    <Button variant="outline" className="border-slate-600">
                      Search
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-700 text-slate-400">
                      <tr>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Quota Used</th>
                        <th className="text-left py-3 px-4">Jobs</th>
                        <th className="text-left py-3 px-4">Joined</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="py-4 px-4">user1@example.com</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                            Active
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-300">450/500</td>
                        <td className="py-4 px-4 text-slate-300">45</td>
                        <td className="py-4 px-4 text-slate-400">
                          2 months ago
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </TabsContent>

            {/* Logs Tab */}
            <TabsContent value="logs">
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-3">
                  {[
                    {
                      type: "request",
                      message: "Job created: user1 - tiktok.com/video/123",
                      time: "2 minutes ago",
                    },
                    {
                      type: "error",
                      message: "ScraperAPI key limited: sk_live_abc123...",
                      time: "5 minutes ago",
                    },
                    {
                      type: "retry",
                      message: "Job retried: Attempt 2/3",
                      time: "8 minutes ago",
                    },
                    {
                      type: "cooldown",
                      message: "Key entered cooldown: 1 hour remaining",
                      time: "10 minutes ago",
                    },
                  ].map((log, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 bg-slate-700/20 rounded-lg border border-slate-700/50"
                    >
                      <div
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          log.type === "error"
                            ? "bg-red-500/10 text-red-400"
                            : log.type === "cooldown"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {log.type}
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-300 text-sm">{log.message}</p>
                        <p className="text-slate-500 text-xs mt-1">
                          {log.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </TabsContent>

            {/* Queue Tab */}
            <TabsContent value="queue">
              <CardContent className="pt-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-700/20 p-6 rounded-lg border border-slate-700/50">
                    <p className="text-slate-400 text-sm mb-2">Queued Jobs</p>
                    <p className="text-4xl font-bold text-cyan-400">23</p>
                    <p className="text-slate-500 text-xs mt-2">
                      Waiting for processing
                    </p>
                  </div>
                  <div className="bg-slate-700/20 p-6 rounded-lg border border-slate-700/50">
                    <p className="text-slate-400 text-sm mb-2">
                      Processing Jobs
                    </p>
                    <p className="text-4xl font-bold text-blue-400">8</p>
                    <p className="text-slate-500 text-xs mt-2">
                      Currently being processed
                    </p>
                  </div>
                  <div className="bg-slate-700/20 p-6 rounded-lg border border-slate-700/50">
                    <p className="text-slate-400 text-sm mb-2">
                      Completed (Today)
                    </p>
                    <p className="text-4xl font-bold text-green-400">342</p>
                    <p className="text-slate-500 text-xs mt-2">
                      Successfully processed
                    </p>
                  </div>
                  <div className="bg-slate-700/20 p-6 rounded-lg border border-slate-700/50">
                    <p className="text-slate-400 text-sm mb-2">
                      Failed (Today)
                    </p>
                    <p className="text-4xl font-bold text-red-400">5</p>
                    <p className="text-slate-500 text-xs mt-2">
                      Failed to process
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <h4 className="text-white font-semibold mb-4">
                    Current Queue
                  </h4>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-slate-700/20 rounded border border-slate-700/50"
                      >
                        <div>
                          <p className="text-slate-300 text-sm">
                            Job #{i} - tiktok.com/video/123456
                          </p>
                          <p className="text-slate-500 text-xs">
                            Added 5 minutes ago
                          </p>
                        </div>
                        <span className="text-slate-400 text-sm">
                          Waiting...
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
