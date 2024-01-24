// Next.js preview pdf target url
const PROD_URL = "https://sidebar-pdf-preview.vercel.app";
const DEV_URL = "http://localhost:3000";

export const POST_MESSAGE_SOURCE_TITLE = "SIDEBAR-DRAFTING-HOST";
export const POST_MESSAGE_BASE_URL =
  process.env.NODE_ENV === "production" ? PROD_URL : DEV_URL;
