#!/bin/bash

# Test Script untuk Hero Banners API
# Usage: bash scripts/test-hero-banners-api.sh

echo "🔍 Testing Hero Banners API..."
echo ""

# Get base URL from environment or use default
BASE_URL="${BASE_URL:-http://localhost:3000}"

echo "📌 Testing Desktop Banners"
echo "URL: $BASE_URL/api/admin/hero-banners?device_type=desktop"
curl -s "$BASE_URL/api/admin/hero-banners?device_type=desktop" | jq '.' || echo "❌ Failed or invalid JSON"

echo ""
echo "📌 Testing Mobile Banners"
echo "URL: $BASE_URL/api/admin/hero-banners?device_type=mobile"
curl -s "$BASE_URL/api/admin/hero-banners?device_type=mobile" | jq '.' || echo "❌ Failed or invalid JSON"

echo ""
echo "📌 Testing All Banners (no filter)"
echo "URL: $BASE_URL/api/admin/hero-banners"
curl -s "$BASE_URL/api/admin/hero-banners" | jq '.' || echo "❌ Failed or invalid JSON"

echo ""
echo "✅ Done!"
