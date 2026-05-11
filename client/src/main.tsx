import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

/* 註冊 Service Worker 用於緩存和離線支持
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.log('Service Worker 註冊失敗:', error);
    });
  });
}
*/

// 動態加載分析腳本
const analyticsEndpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
const analyticsWebsiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;

if (analyticsEndpoint && analyticsWebsiteId) {
  const script = document.createElement("script");
  script.defer = true;
  const scriptSrc = analyticsEndpoint.endsWith('/') 
    ? `${analyticsEndpoint}script.js` 
    : `${analyticsEndpoint}/script.js`;
  script.src = scriptSrc;
  script.dataset.websiteId = analyticsWebsiteId;
  document.body.appendChild(script);
}
