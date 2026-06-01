# Cache Optimization Deployment Script (Windows)
# RS Medika Lestari - Production Cache Setup
# 
# Usage: .\scripts\cache-setup.ps1

$ErrorActionPreference = "Stop"

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  RS MEDIKA LESTARI - CACHE OPTIMIZATION SETUP             ║" -ForegroundColor Cyan
Write-Host "║  Version: 2.0 - Production Ready                          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if running in production
if ($env:NODE_ENV -eq "production") {
    Write-Host "⚠️  Running in PRODUCTION mode" -ForegroundColor Yellow
    $response = Read-Host "Are you sure? (yes/no)"
    if ($response -ne "yes") {
        Write-Host "Cancelled."
        exit 1
    }
}

Write-Host ""
Write-Host "📋 Checking environment..."

# Check required files
$requiredFiles = @(
    "lib/cache-manager.ts",
    "lib/cache-invalidator.ts",
    "lib/enhanced-request-cache.ts",
    "lib/service-worker-register.ts",
    "public/sw.js",
    "middleware.ts",
    "next.config.ts"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "❌ Missing: $file" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ All required files found" -ForegroundColor Green

Write-Host ""
Write-Host "🔨 Building production bundle..."

# Build Next.js
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📊 Cache Configuration Summary"
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow

Write-Host ""
Write-Host "🎯 Cache Headers:" -ForegroundColor Cyan
Write-Host "  • Static Assets (JS/CSS/Fonts): 1 year (immutable)"
Write-Host "  • Images: 30 days + stale-while-revalidate"
Write-Host "  • API Routes: 30 seconds + 60s CDN + stale"
Write-Host "  • HTML Pages: 1 minute + 5min CDN + 1 day stale"

Write-Host ""
Write-Host "📦 Memory Cache TTLs:" -ForegroundColor Cyan
Write-Host "  • Critical (Doctors, Rooms): 30-60 minutes"
Write-Host "  • High (Schedules, Doctor Detail): 10-15 minutes"
Write-Host "  • Medium (Mading, Stats): 2-5 minutes"
Write-Host "  • MCU Packages: 30 seconds (frequently updated)"

Write-Host ""
Write-Host "🌐 Service Worker Strategies:" -ForegroundColor Cyan
Write-Host "  • Static Assets: Cache First"
Write-Host "  • API Data: Stale While Revalidate"
Write-Host "  • HTML Pages: Network First"
Write-Host "  • Images: Cache with size limit (5MB)"

Write-Host ""
Write-Host "🔑 Key Features:" -ForegroundColor Cyan
Write-Host "  ✓ Request deduplication (no concurrent duplicates)"
Write-Host "  ✓ Exponential backoff retry logic"
Write-Host "  ✓ Offline support with stale-while-revalidate"
Write-Host "  ✓ Automatic cache invalidation"
Write-Host "  ✓ Built-in cache monitoring"
Write-Host "  ✓ Development cache debugger (Ctrl+Shift+D)"

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green

Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Deploy to production: npm run start"
Write-Host "  2. Verify cache headers: curl -I https://your-domain.com"
Write-Host "  3. Check Service Worker: Open DevTools → Application tab"
Write-Host "  4. Monitor cache stats: Check CacheManager.getInstance().getStats()"
Write-Host "  5. Test offline mode: Disable network and refresh"

Write-Host ""
Write-Host "📖 Documentation:" -ForegroundColor Cyan
Write-Host "  • Read: CACHE_OPTIMIZATION_GUIDE.md"
Write-Host "  • Cache Invalidation: lib/cache-invalidator.ts"
Write-Host "  • Service Worker: public/sw.js"
Write-Host "  • Monitoring: Check browser DevTools → Application tab"

Write-Host ""
Write-Host "🆘 Troubleshooting:" -ForegroundColor Cyan
Write-Host "  • Updates not visible? Hard refresh: Ctrl+Shift+Delete"
Write-Host "  • Service Worker not working? Check browser console"
Write-Host "  • Cache hit rate low? Increase TTL or check invalidation logic"

Write-Host ""
Write-Host "🚀 Ready for production!" -ForegroundColor Green
