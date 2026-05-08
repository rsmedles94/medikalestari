"use client";

import { useState, useEffect } from "react";
import { trackPageView, trackButtonClick } from "@/lib/tracking";

export default function AnalyticsDebugPage() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [environment, setEnvironment] = useState<string>("");

  useEffect(() => {
    // Get session ID
    const sid = sessionStorage.getItem("_analytics_session_id") || "not-set";
    setSessionId(sid);

    // Get environment info
    const env = `
URL: ${typeof window !== "undefined" ? window.location.href : "N/A"}
Host: ${typeof window !== "undefined" ? window.location.host : "N/A"}
User Agent: ${typeof navigator !== "undefined" ? navigator.userAgent : "N/A"}
    `.trim();
    setEnvironment(env);
  }, []);

  const testPageView = async () => {
    setLoading(true);
    try {
      setResult("📤 Sending page view event...\n");
      await trackPageView("/analytics-debug");
      setResult((prev) => prev + "✅ Page view sent to API\n");

      // Tungah sebentar lalu check
      await new Promise((r) => setTimeout(r, 1000));
      setResult(
        (prev) =>
          prev + "⏳ Event should appear in /admin/analytics within 30 seconds",
      );
    } catch (error) {
      setResult(
        (prev) =>
          prev +
          `\n❌ Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const testButtonClick = async () => {
    setLoading(true);
    try {
      setResult("📤 Sending button click event...\n");
      await trackButtonClick("Debug Test Button", "/analytics-debug");
      setResult((prev) => prev + "✅ Button click sent to API\n");

      await new Promise((r) => setTimeout(r, 1000));
      setResult(
        (prev) =>
          prev + "⏳ Event should appear in /admin/analytics within 30 seconds",
      );
    } catch (error) {
      setResult(
        (prev) =>
          prev +
          `\n❌ Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const checkSupabase = async () => {
    setLoading(true);
    try {
      setResult("🔍 Checking Supabase connection...\n");
      const response = await fetch("/api/admin/analytics?type=stats");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(
        (prev) =>
          prev +
          `✅ Supabase connected!\n\nStats:\n${JSON.stringify(data, null, 2)}`,
      );
    } catch (error) {
      setResult(
        `❌ Supabase Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const getRecentEvents = async () => {
    setLoading(true);
    try {
      setResult("📊 Fetching recent events...\n");
      const response = await fetch(
        "/api/admin/analytics?type=pages&period=today",
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      interface EventCount {
        event_name: string;
        count: number;
      }

      const pages: EventCount[] = await response.json();
      const clickRes = await fetch(
        "/api/admin/analytics?type=clicks&period=today",
      );
      const clicks: EventCount[] = await clickRes.json();

      setResult(
        (prev) =>
          prev +
          `✅ Today's Events:\n\n📄 Page Views (${pages.length}):\n${
            pages.length > 0
              ? pages
                  .slice(0, 5)
                  .map((p) => `  - ${p.event_name}: ${p.count}`)
                  .join("\n")
              : "  (none)"
          }\n\n🖱️ Button Clicks (${clicks.length}):\n${
            clicks.length > 0
              ? clicks
                  .slice(0, 5)
                  .map((c) => `  - ${c.event_name}: ${c.count}`)
                  .join("\n")
              : "  (none)"
          }`,
      );
    } catch (error) {
      setResult(
        `❌ Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-4xl font-bold mb-2">🔧 Analytics Debug Panel</h1>
        <p className="text-gray-600 mb-8">
          Test tracking dan verify Supabase connection
        </p>

        {/* Environment Info */}
        <div className="mb-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold mb-2">Session Info:</h2>
          <p className="text-sm mb-3">
            <strong>Session ID:</strong>{" "}
            <code className="bg-gray-200 px-2 py-1 rounded">{sessionId}</code>
          </p>
          <pre className="text-xs bg-white p-2 rounded border overflow-auto">
            {environment}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-8">
          <button
            onClick={testPageView}
            disabled={loading}
            className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            📄 Test Page View
          </button>

          <button
            onClick={testButtonClick}
            disabled={loading}
            className="block w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
          >
            🖱️ Test Button Click
          </button>

          <button
            onClick={getRecentEvents}
            disabled={loading}
            className="block w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            📊 View Events
          </button>

          <button
            onClick={checkSupabase}
            disabled={loading}
            className="block w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 transition"
          >
            🔗 Check Supabase Connection
          </button>
        </div>

        {/* Result Display */}
        {result && (
          <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm">
            <pre className="whitespace-pre-wrap overflow-x-auto">{result}</pre>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm space-y-2">
          <h3 className="font-bold text-blue-900">
            📋 Troubleshooting Checklist:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            <li>
              ✅ Check environment info di atas - pastikan URL sesuai
              production/localhost
            </li>
            <li>✅ Klik Test Page View - pastikan response OK</li>
            <li>✅ Tunggu 2-3 detik, lalu klik View Events</li>
            <li>✅ Event baru seharusnya muncul di hasil</li>
            <li>
              ✅ Jika still 0, cek browser DevTools - Network tab - pastikan
              requests berhasil (200 status)
            </li>
            <li>
              ✅ Klik Check Supabase Connection - pastikan stats tidak error
            </li>
            <li>
              ✅ Jika masih error, check environment variables:
              NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
            </li>
          </ul>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800">
          <strong>💡 Tips:</strong>
          <ul className="list-disc list-inside mt-2">
            <li>Data mungkin butuh 30 detik untuk sync di panel admin</li>
            <li>Buka DevTools (F12) → Console untuk melihat detailed logs</li>
            <li>
              Cek filter period di /admin/analytics - pastikan sesuai dengan
              waktu event
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
