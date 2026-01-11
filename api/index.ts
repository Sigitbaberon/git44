import serverless from "serverless-http";
import { createServer } from "../server/index";

const app = createServer();

// Vercel handler (Node v3 runtime)
export const handler = serverless(app);
export default handler;
