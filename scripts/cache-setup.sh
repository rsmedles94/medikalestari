#!/bin/bash

##############################################################################
# Cache Optimization Deployment Script
# RS Medika Lestari - Production Cache Setup
# 
# Usage: ./scripts/cache-setup.sh
##############################################################################

set -e

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  RS MEDIKA LESTARI - CACHE OPTIMIZATION SETUP                ║"
echo "║  Version: 2.0 - Production Ready                             ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running in production
if [ "$NODE_ENV" = "production" ]; then
    echo -e "${YELLOW}⚠️  Running in PRODUCTION mode${NC}"
    read -p "Are you sure? (yes/no) " -n 3 -r
    echo
    if [[ ! $REPLY =~ ^yes$ ]]; then
        echo "Cancelled."
        exit 1
    fi
fi

echo ""
echo "📋 Checking environment..."

# Check required files
REQUIRED_FILES=(
    "lib/cache-manager.ts"
    "lib/cache-invalidator.ts"
    "lib/enhanced-request-cache.ts"
    "lib/service-worker-register.ts"
    "public/sw.js"
    "middleware.ts"
    "next.config.ts"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Missing: $file${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ All required files found${NC}"

echo ""
echo "🔨 Building production bundle..."

# Build Next.js
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build completed successfully${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo ""
echo "📊 Cache Configuration Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "🎯 Cache Headers:"
echo "  • Static Assets (JS/CSS/Fonts): 1 year (immutable)"
echo "  • Images: 30 days + stale-while-revalidate"
echo "  • API Routes: 30 seconds + 60s CDN + stale"
echo "  • HTML Pages: 1 minute + 5min CDN + 1 day stale"

echo ""
echo "📦 Memory Cache TTLs:"
echo "  • Critical (Doctors, Rooms): 30-60 minutes"
echo "  • High (Schedules, Doctor Detail): 10-15 minutes"
echo "  • Medium (Mading, Stats): 2-5 minutes"
echo "  • MCU Packages: 30 seconds (frequently updated)"

echo ""
echo "🌐 Service Worker Strategies:"
echo "  • Static Assets: Cache First"
echo "  • API Data: Stale While Revalidate"
echo "  • HTML Pages: Network First"
echo "  • Images: Cache with size limit (5MB)"

echo ""
echo "🔑 Key Features:"
echo "  ✓ Request deduplication (no concurrent duplicates)"
echo "  ✓ Exponential backoff retry logic"
echo "  ✓ Offline support with stale-while-revalidate"
echo "  ✓ Automatic cache invalidation"
echo "  ✓ Built-in cache monitoring"
echo "  ✓ Development cache debugger (Ctrl+Shift+D)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "✅ Setup Complete!"

echo ""
echo "📝 Next Steps:"
echo "  1. Deploy to production: npm run start"
echo "  2. Verify cache headers: curl -I https://your-domain.com"
echo "  3. Check Service Worker: Open DevTools → Application tab"
echo "  4. Monitor cache stats: Check CacheManager.getInstance().getStats()"
echo "  5. Test offline mode: Disable network and refresh"

echo ""
echo "📖 Documentation:"
echo "  • Read: CACHE_OPTIMIZATION_GUIDE.md"
echo "  • Cache Invalidation: lib/cache-invalidator.ts"
echo "  • Service Worker: public/sw.js"
echo "  • Monitoring: Check browser DevTools → Application tab"

echo ""
echo "🆘 Troubleshooting:"
echo "  • Updates not visible? Hard refresh: Ctrl+Shift+Delete"
echo "  • Service Worker not working? Check browser console"
echo "  • Cache hit rate low? Increase TTL or check invalidation logic"

echo ""
echo "🚀 Ready for production!"
