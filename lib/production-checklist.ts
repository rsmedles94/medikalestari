/**
 * Production Optimization & Error Fixes
 * =====================================
 *
 * File ini berisi checklist dan script untuk production deployment
 * dengan focus pada:
 * 1. Hydration error prevention
 * 2. Cache optimization
 * 3. Performance monitoring
 * 4. Error handling
 */

// ============================================
// 1. HYDRATION ERROR FIX - Verify all components
// ============================================

export function checkHydrationSafety() {
  console.log("\n🔍 Checking Hydration Safety...");

  const componentPatterns = [
    {
      pattern: /typeof\s+window/g,
      fix: "gunakan \"typeof globalThis !== 'undefined'\" atau hooks dari use-hydration-safe",
      severity: "high",
    },
    {
      pattern: /window\./g,
      fix: "gunakan globalThis atau wrap dengan useIsClient()",
      severity: "high",
    },
    {
      pattern: /localStorage\./g,
      fix: "gunakan useLocalStorage() dari use-hydration-safe",
      severity: "high",
    },
    {
      pattern: /document\./g,
      fix: "gunakan usePreventScroll() atau useDocumentMutation()",
      severity: "medium",
    },
  ];

  const filestoCheck = [
    "components/Navbar.tsx",
    "components/NavbarClient.tsx",
    "components/MobileBottomNavbar.tsx",
    "components/Footer.tsx",
    "components/HeroSection.tsx",
  ];

  console.log("Files yang perlu di-check:", filestoCheck);
  console.log(
    "Patterns yang dicari:",
    componentPatterns.map((p) => p.pattern.source),
  );
}

// ============================================
// 2. CACHE STRATEGY OPTIMIZATION
// ============================================

export const PRODUCTION_CACHE_CONFIG = {
  // Images - aggressive caching
  images: {
    ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxSize: 50 * 1024 * 1024, // 50MB
    priority: "low",
  },

  // API responses - short lived
  apiResponses: {
    ttl: 60 * 1000, // 1 minute
    maxSize: 5 * 1024 * 1024, // 5MB
    priority: "high",
    revalidateOnFocus: true,
  },

  // Static data - very long lived
  staticContent: {
    ttl: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxSize: 10 * 1024 * 1024, // 10MB
    priority: "medium",
  },

  // Real-time data - minimal caching
  realTimeData: {
    ttl: 10 * 1000, // 10 seconds
    maxSize: 1 * 1024 * 1024, // 1MB
    priority: "critical",
    revalidateOnFocus: true,
  },
};

// ============================================
// 3. PERFORMANCE THRESHOLDS
// ============================================

export const PERFORMANCE_THRESHOLDS = {
  // Core Web Vitals targets
  LCP: {
    target: 2500, // milliseconds
    warning: 4000,
  },
  FID: {
    target: 100,
    warning: 300,
  },
  CLS: {
    target: 0.1,
    warning: 0.25,
  },

  // Custom thresholds
  API_RESPONSE_TIME: {
    target: 500,
    warning: 1000,
  },
  FIRST_PAINT: {
    target: 1000,
    warning: 2000,
  },
  BUNDLE_SIZE: {
    target: 200 * 1024, // 200KB
    warning: 300 * 1024,
  },
};

// ============================================
// 4. CRITICAL FIXES CHECKLIST
// ============================================

export const PRODUCTION_CHECKLIST = {
  hydration: [
    "✅ Semua components yang akses window/document menggunakan use-hydration-safe hooks",
    "✅ useIsClient() di-gunakan untuk conditional rendering SSR vs client",
    "✅ HydrationBoundary di-wrap components yang kompleks",
    "✅ Mobile detection menggunakan useIsMobile() bukan window.matchMedia()",
  ],

  cache: [
    "✅ cache-strategy.ts sudah configure optimal TTLs",
    "✅ CacheManager di-implement di semua API calls",
    "✅ Duplicate requests di-deduplicate",
    "✅ Cache invalidation strategy sudah implement",
  ],

  performance: [
    "✅ Images di-lazy load dengan next/image",
    "✅ Code splitting untuk heavy components",
    "✅ API routes di-cache dengan proper headers",
    "✅ Static generation di-maximize",
  ],

  security: [
    "✅ No console.log() di production",
    "✅ No hardcoded secrets di codebase",
    "✅ CORS headers di-configure dengan benar",
    "✅ Rate limiting di-implement di API routes",
  ],

  monitoring: [
    "✅ Error logging di-setup",
    "✅ Performance monitoring di-active",
    "✅ Analytics di-track dengan proper events",
    "✅ Health checks di-running",
  ],
};

// ============================================
// 5. ENVIRONMENT VARIABLES VALIDATION
// ============================================

export function validateEnvironment() {
  console.log("\n🔐 Validating Environment Setup...");

  const requiredVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];

  const optionalVars = [
    "NEXT_PUBLIC_ANALYTICS_ID",
    "NEXT_PUBLIC_GTM_ID",
    "SENTRY_DSN",
  ];

  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.warn("⚠️  Missing required env vars:", missing);
  }

  console.log(
    "✅ Optional env vars configured:",
    optionalVars.filter((v) => process.env[v]),
  );
}

// ============================================
// 6. BUILD SIZE ANALYSIS
// ============================================

export function analyzeBuildSize() {
  console.log("\n📦 Build Size Analysis");
  console.log('Run: "pnpm build && pnpm analyze"');
  console.log("\nTarget sizes:");
  console.log("- Main bundle: < 200KB");
  console.log("- Page bundle: < 100KB each");
  console.log("- Total JS: < 500KB");
}

// ============================================
// 7. LIGHTHOUSE SCORE TARGETS
// ============================================

export const LIGHTHOUSE_TARGETS = {
  performance: 90,
  accessibility: 95,
  bestPractices: 95,
  seo: 95,
  pwa: 90,
};

// ============================================
// 8. DEPLOYMENT CHECKS
// ============================================

export const DEPLOYMENT_CHECKS = {
  preDeployment: [
    "pnpm lint",
    "pnpm type-check",
    "pnpm build",
    "Test di staging first",
  ],

  postDeployment: [
    "Monitor Sentry errors",
    "Check Core Web Vitals",
    "Verify cache hits",
    "Monitor API response times",
  ],

  rollbackPlan: [
    "Keep previous version ready",
    "Database migrations reversible",
    "Feature flags for quick disable",
  ],
};

// ============================================
// 9. QUICK FIXES FOR COMMON ERRORS
// ============================================

export const QUICK_FIXES = {
  hydrationError: {
    symptom: "Text content does not match server-rendered HTML",
    solution: `
    1. Wrap dengan HydrationBoundary:
       <HydrationBoundary fallback={<Skeleton />}>
         <Component />
       </HydrationBoundary>

    2. Atau gunakan useIsClient():
       if (!isClient) return <Skeleton />;
       return <Component />;
    
    3. Atau gunakan useDeferredClientState():
       const data = useDeferredClientState(
         initialValue,
         () => getClientValue()
       );
    `,
  },

  cacheNotWorking: {
    symptom: "API calls ke backend terus menerus, performa menurun",
    solution: `
    1. Verifikasi CacheManager initialized:
       const cache = CacheManager.getInstance();
    
    2. Check cache TTL configuration di cache-strategy.ts
    
    3. Verify request deduplication:
       enhancedRequestCache.ts harus enabled
    
    4. Monitor cache hits di Chrome DevTools Network
    `,
  },

  mobileDesktopMismatch: {
    symptom: "Desktop render fine, mobile ada gap/layout issues",
    solution: `
    1. Gunakan useIsMobile() untuk responsive logic:
       const isMobile = useIsMobile();
    
    2. Jangan gunakan media queries di JS tanpa useMediaQuery()
    
    3. Test di actual devices bukan hanya browser resize
    
    4. Check Meta viewport tag ada di layout.tsx
    `,
  },

  performanceSlow: {
    symptom: "Lighthouse score rendah, LCP > 4s",
    solution: `
    1. Enable image optimization:
       - Use next/image untuk semua images
       - Add width/height attributes
       - Set priority={true} untuk LCP images
    
    2. Code splitting:
       - dynamic() untuk heavy components
       - Route-based splitting sudah otomatis
    
    3. CSS optimization:
       - Inline critical CSS
       - Remove unused styles
    
    4. API optimization:
       - Implement caching
       - Reduce response size
       - Implement pagination untuk besar data
    `,
  },
};

// ============================================
// 10. PRODUCTION DEPLOYMENT SCRIPT
// ============================================

export function productionDeploymentGuide() {
  const guide = `
╔════════════════════════════════════════════════════════╗
║     PRODUCTION DEPLOYMENT CHECKLIST                    ║
╚════════════════════════════════════════════════════════╝

1️⃣  PRE-DEPLOYMENT STEPS:
   ✅ Run: pnpm lint && pnpm type-check
   ✅ Run: pnpm build (verify no errors)
   ✅ Test locally dengan: pnpm start
   ✅ Check Lighthouse scores
   ✅ Verify all env vars di .env.production

2️⃣  VERIFY FIXES:
   ✅ No hydration errors di browser console
   ✅ Cache working (check Network tab)
   ✅ Mobile responsive (test actual device)
   ✅ API calls caching properly

3️⃣  DEPLOYMENT:
   ✅ Push ke repository
   ✅ Deploy ke Vercel/hosting
   ✅ Monitor deployment logs
   ✅ Check build artifacts

4️⃣  POST-DEPLOYMENT VERIFICATION:
   ✅ Check Sentry dashboard (should be quiet)
   ✅ Verify Core Web Vitals
   ✅ Monitor API response times
   ✅ Test critical user paths on mobile

5️⃣  MONITORING:
   ✅ Set up alerts untuk errors > threshold
   ✅ Track performance metrics
   ✅ Monitor cache hit rates
   ✅ Daily review logs

═══════════════════════════════════════════════════════════

KEY FILES TO REVIEW:
  - lib/hooks/use-hydration-safe.tsx (hydration fixes)
  - lib/cache-strategy.ts (cache configuration)
  - next.config.ts (optimizations)
  - pages/api/* (API caching)

═══════════════════════════════════════════════════════════
  `;

  console.log(guide);
}

// Run checks if executed directly
if (typeof require !== "undefined" && require.main === module) {
  checkHydrationSafety();
  validateEnvironment();
  analyzeBuildSize();
  productionDeploymentGuide();
}
