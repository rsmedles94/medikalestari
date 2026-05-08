"use client";

import { useState } from "react";
import { trackPageView, trackButtonClick } from "@/lib/tracking";

export default function AnalyticsDebugPage() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testPageView = async () => {
    setLoading(true);
    try {
      setResult("Testing trackPageView...");
      await trackPageView("/test-page");
      setResult("✅ trackPageView sent successfully");
    } catch (error) {
      setResult(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testButtonClick = async () => {
    setLoading(true);
    try {
      setResult("Testing trackButtonClick...");
      await trackButtonClick("Test Button", "/test-page");
      setResult("✅ trackButtonClick sent successfully");
    } catch (error) {
      setResult(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const checkSupabase = async () => {
    setLoading(true);
    try {
      setResult("Checking Supabase connection...");
      const response = await fetch("/api/admin/analytics?type=stats");
      const data = await response.json();
      setResult(
        `✅ Supabase connected! Data: ${JSON.stringify(data, null, 2)}`
      );
    } catch (error) {
      setResult(`❌ Supabase Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-6">Analytics Debug Panel</h1>

        <div className="space-y-4 mb-8">
          <button
            onClick={testPageView}
            disabled={loading}
            className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            Test trackPageView()
          </button>

          <button
            onClick={testButtonClick}
            disabled={loading}
            className="block w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            Test trackButtonClick()
          </button>

          <button
            onClick={checkSupabase}
            disabled={loading}
            className="block w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
          >
            Check Supabase Connection
          </button>
        </div>

        {result && (
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="font-semibold mb-2">Result:</h2>
            <pre className="text-sm overflow-auto whitespace-pre-wrap">
              {result}
            </pre>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm">
          <p className="mb-2">
            <strong>Instructions:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Click "Test trackPageView()" to send a test page view</li>
            <li>Click "Test trackButtonClick()" to send a test button click</li>
            <li>Click "Check Supabase Connection" to verify connection</li>
            <li>Wait ~30 seconds and check /admin/analytics for data</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
