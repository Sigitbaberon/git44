import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Copy,
  RefreshCw,
  Key,
  BarChart3,
  Code2,
  Zap
} from "lucide-react";
import { toast } from "sonner";

export default function DeveloperAPI() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiKey, setApiKey] = useState("git44_sk_test_abc123def456ghi789");

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
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
          <h1 className="text-4xl font-bold text-white mb-2">Developer API</h1>
          <p className="text-slate-400">Integrate git44 watermark removal into your application</p>
        </div>

        {/* API Key Section */}
        <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Key className="h-5 w-5 mr-2 text-cyan-400" />
              API Key
            </CardTitle>
            <CardDescription className="text-slate-400">
              Your secret API key for authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-700/30 rounded-lg p-4 font-mono text-sm">
              <div className="flex items-center justify-between">
                <code className="text-slate-300 break-all">{apiKey}</code>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => copyToClipboard(apiKey)}
                  className="flex-shrink-0 ml-4"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              ⚠️ Keep your API key secret. Never share it publicly or commit it to version control.
            </p>
            <Button 
              variant="outline" 
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate New Key
            </Button>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Requests</p>
                  <p className="text-3xl font-bold text-cyan-400">1,247</p>
                </div>
                <Zap className="h-8 w-8 text-cyan-400/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Quota Remaining</p>
                  <p className="text-3xl font-bold text-green-400">9,753/10,000</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-400/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Success Rate</p>
                  <p className="text-3xl font-bold text-blue-400">98.7%</p>
                </div>
                <Code2 className="h-8 w-8 text-blue-400/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documentation */}
        <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Documentation</CardTitle>
            <CardDescription className="text-slate-400">
              Get started with code examples
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="curl" className="w-full">
              <TabsList className="bg-slate-700 border-b border-slate-600">
                <TabsTrigger value="curl" className="text-slate-300 data-[state=active]:text-white">cURL</TabsTrigger>
                <TabsTrigger value="node" className="text-slate-300 data-[state=active]:text-white">Node.js</TabsTrigger>
                <TabsTrigger value="python" className="text-slate-300 data-[state=active]:text-white">Python</TabsTrigger>
                <TabsTrigger value="php" className="text-slate-300 data-[state=active]:text-white">PHP</TabsTrigger>
              </TabsList>

              <TabsContent value="curl" className="space-y-4 mt-4">
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-slate-300 text-sm font-mono">
{`curl -X POST https://api.git44.dev/v1/generate \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "link": "https://www.tiktok.com/video/123456"
  }'`}
                  </pre>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(`curl -X POST https://api.git44.dev/v1/generate \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "link": "https://www.tiktok.com/video/123456"
  }'`)}
                  className="border-slate-600"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </TabsContent>

              <TabsContent value="node" className="space-y-4 mt-4">
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-slate-300 text-sm font-mono">
{`const response = await fetch(
  'https://api.git44.dev/v1/generate',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ${apiKey}',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      link: 'https://www.tiktok.com/video/123456'
    })
  }
);

const data = await response.json();
console.log(data);`}
                  </pre>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(`const response = await fetch(
  'https://api.git44.dev/v1/generate',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ${apiKey}',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      link: 'https://www.tiktok.com/video/123456'
    })
  }
);

const data = await response.json();
console.log(data);`)}
                  className="border-slate-600"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </TabsContent>

              <TabsContent value="python" className="space-y-4 mt-4">
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-slate-300 text-sm font-mono">
{`import requests

headers = {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
}

data = {
    'link': 'https://www.tiktok.com/video/123456'
}

response = requests.post(
    'https://api.git44.dev/v1/generate',
    headers=headers,
    json=data
)

print(response.json())`}
                  </pre>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(`import requests

headers = {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
}

data = {
    'link': 'https://www.tiktok.com/video/123456'
}

response = requests.post(
    'https://api.git44.dev/v1/generate',
    headers=headers,
    json=data
)

print(response.json())`)}
                  className="border-slate-600"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </TabsContent>

              <TabsContent value="php" className="space-y-4 mt-4">
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-slate-300 text-sm font-mono">
{`<?php
$url = 'https://api.git44.dev/v1/generate';
$apiKey = '${apiKey}';

$data = [
    'link' => 'https://www.tiktok.com/video/123456'
];

$options = [
    'http' => [
        'method' => 'POST',
        'header' => 'Authorization: Bearer ' . $apiKey . "\\r\\n" .
                    'Content-Type: application/json\\r\\n',
        'content' => json_encode($data)
    ]
];

$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);
$result = json_decode($response);
?>`}
                  </pre>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(`<?php
$url = 'https://api.git44.dev/v1/generate';
$apiKey = '${apiKey}';

$data = [
    'link' => 'https://www.tiktok.com/video/123456'
];

$options = [
    'http' => [
        'method' => 'POST',
        'header' => 'Authorization: Bearer ' . $apiKey . "\\r\\n" .
                    'Content-Type: application/json\\r\\n',
        'content' => json_encode($data)
    ]
];

$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);
$result = json_decode($response);
?>`)}
                  className="border-slate-600"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </TabsContent>
            </Tabs>

            {/* Response Format */}
            <div className="mt-8 pt-8 border-t border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Response Format</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-slate-300 font-medium mb-2">Processing</p>
                  <div className="bg-slate-900 rounded-lg p-4 text-sm font-mono text-slate-300 overflow-x-auto">
{`{
  "status": "processing",
  "taskId": "task_xyz123",
  "link": null
}`}
                  </div>
                </div>
                <div>
                  <p className="text-slate-300 font-medium mb-2">Success</p>
                  <div className="bg-slate-900 rounded-lg p-4 text-sm font-mono text-slate-300 overflow-x-auto">
{`{
  "status": "success",
  "taskId": "task_xyz123",
  "link": "https://cdn.git44.dev/..."
}`}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <p className="text-slate-300 font-medium mb-2">Error</p>
                  <div className="bg-slate-900 rounded-lg p-4 text-sm font-mono text-slate-300 overflow-x-auto">
{`{
  "status": "failed",
  "error": "Invalid video URL or processing failed"
}`}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
