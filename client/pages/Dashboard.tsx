import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Upload,
  Play,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Share2,
} from "lucide-react";
import { RemovalJob, JobStatus } from "@shared/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const [currentJob, setCurrentJob] = useState<RemovalJob | null>(null);
  const [jobHistory, setJobHistory] = useState<RemovalJob[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoLink.trim()) {
      toast.error("Please enter a video link");
      return;
    }

    // Basic URL validation
    try {
      new URL(videoLink);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/removal/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ link: videoLink }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to create removal job");
        return;
      }

      setCurrentJob(data);
      setVideoLink("");
      toast.success("Job created! Polling for results...");

      // Start polling for status
      const pollJob = async () => {
        let attempts = 0;
        const maxAttempts = 16; // ~5 seconds with 3-5 second intervals

        while (attempts < maxAttempts) {
          await new Promise((resolve) =>
            setTimeout(resolve, 3000 + Math.random() * 2000),
          );

          const statusResponse = await fetch(`/api/removal/${data.id}/status`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });

          if (!statusResponse.ok) break;

          const jobData = await statusResponse.json();
          setCurrentJob(jobData);

          if (jobData.status === "success") {
            toast.success("Video processed successfully!");
            break;
          } else if (jobData.status === "failed") {
            toast.error(jobData.error || "Failed to process video");
            break;
          }

          attempts++;
        }

        if (attempts >= maxAttempts) {
          toast.error("Processing timeout. Please check history for results.");
        }
      };

      pollJob();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadVideo = (link: string) => {
    window.open(link, "_blank");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case "success":
        return "bg-green-500/10 border-green-500/50 text-green-400";
      case "failed":
        return "bg-red-500/10 border-red-500/50 text-red-400";
      case "processing":
      case "polling":
        return "bg-blue-500/10 border-blue-500/50 text-blue-400";
      default:
        return "bg-slate-500/10 border-slate-500/50 text-slate-400";
    }
  };

  const getStatusIcon = (status: JobStatus) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5" />;
      case "failed":
        return <AlertCircle className="h-5 w-5" />;
      case "processing":
      case "polling":
        return <Loader2 className="h-5 w-5 animate-spin" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">
            Upload and remove watermarks from your videos
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Input Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upload Card */}
            <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-cyan-400" />
                  Remove Watermark
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Paste video link from TikTok, Instagram, YouTube, Shorts, and
                  more
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">
                      Video URL
                    </label>
                    <Input
                      type="url"
                      placeholder="https://www.tiktok.com/video/..."
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-slate-400 mt-2">
                      Supported: TikTok, Instagram, YouTube, Shorts, Reels, and
                      more
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Start Removal
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Current Job Status */}
            {currentJob && (
              <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">
                    Processing Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Status Badge */}
                  <div>
                    <div
                      className={`inline-flex items-center px-4 py-2 rounded-lg border ${getStatusColor(currentJob.status)}`}
                    >
                      {getStatusIcon(currentJob.status)}
                      <span className="ml-2 font-semibold capitalize">
                        {currentJob.status === "polling"
                          ? "Processing..."
                          : currentJob.status}
                      </span>
                    </div>
                  </div>

                  {/* Input URL */}
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-2">
                      Input URL
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        value={currentJob.inputLink}
                        className="bg-slate-700/30 border-slate-600 text-slate-300"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => copyToClipboard(currentJob.inputLink)}
                        className="border-slate-600"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Output URL - Success */}
                  {currentJob.status === "success" && currentJob.outputLink && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-slate-300 block mb-2">
                          Download Link
                        </label>
                        <div className="flex items-center gap-2">
                          <Input
                            readOnly
                            value={currentJob.outputLink}
                            className="bg-green-500/10 border-green-500/50 text-slate-300"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              copyToClipboard(currentJob.outputLink!)
                            }
                            className="border-green-500/50"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            onClick={() =>
                              downloadVideo(currentJob.outputLink!)
                            }
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Video Preview */}
                      <div>
                        <label className="text-sm font-medium text-slate-300 block mb-2">
                          Preview
                        </label>
                        <div className="bg-slate-700/30 rounded-lg overflow-hidden">
                          <video
                            src={currentJob.outputLink}
                            controls
                            className="w-full max-h-96"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {currentJob.status === "failed" && currentJob.error && (
                    <Alert className="bg-red-500/10 border-red-500/50">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-400 ml-2">
                        {currentJob.error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Metadata */}
                  <div className="pt-4 border-t border-slate-700 space-y-2 text-sm text-slate-400">
                    <div className="flex justify-between">
                      <span>Job ID:</span>
                      <code className="text-slate-300">{currentJob.id}</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Retries:</span>
                      <span>
                        {currentJob.retryCount}/{currentJob.maxRetries}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Polls:</span>
                      <span>
                        {currentJob.pollCount}/{currentJob.maxPolls}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Tips */}
            {!currentJob && (
              <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    Tips for Best Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-3 mt-1 flex-shrink-0"></span>
                      <span>
                        Use direct video links from TikTok, Instagram, YouTube,
                        etc.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-3 mt-1 flex-shrink-0"></span>
                      <span>
                        Keep your browser window open while processing
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-3 mt-1 flex-shrink-0"></span>
                      <span>Processing usually takes 30-60 seconds</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-3 mt-1 flex-shrink-0"></span>
                      <span>
                        Download results immediately - links expire after 24
                        hours
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm">Videos Processed</p>
                  <p className="text-2xl font-bold text-cyan-400">12</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Success Rate</p>
                  <p className="text-2xl font-bold text-green-400">100%</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Quota Remaining</p>
                  <p className="text-2xl font-bold text-blue-400">488/500</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {jobHistory.length === 0 ? (
                  <p className="text-slate-400 text-sm">No recent activity</p>
                ) : (
                  <div className="space-y-2">
                    {jobHistory.slice(0, 3).map((job) => (
                      <div key={job.id} className="text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 truncate">
                            Job #{job.id.slice(0, 8)}
                          </span>
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              job.status === "success"
                                ? "bg-green-400"
                                : job.status === "failed"
                                  ? "bg-red-400"
                                  : "bg-blue-400"
                            }`}
                          ></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
