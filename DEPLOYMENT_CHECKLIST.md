# 🚀 DEPLOYMENT CHECKLIST - Cache Optimization v2.0

## Pre-Deployment: LOCAL TESTING

### 1. Build & Local Verification

- [ ] `npm run build` - Build production bundle
- [ ] `npm run start` - Run production server locally
- [ ] DevTools → Application → Manifest - Check Service Worker present
- [ ] DevTools → Network - Verify cache headers
- [ ] DevTools → Storage → Cache Storage - Check cached items

### 2. Service Worker Testing

```bash
# Test in browser DevTools Console
await caches.keys()
// Should show: rs-medika-static-v1, rs-medika-dynamic-v1, rs-medika-images-v1, rs-medika-api-v1
```

- [ ] Service Worker registers successfully
- [ ] Static assets cached (js, css files)
- [ ] Images cached (with size < 5MB)
- [ ] API responses cached with stale-while-revalidate
- [ ] Offline mode works (disable network → refresh → still loads)

### 3. Cache Performance Check

```bash
# In browser console
import { CacheManager } from "@/lib/cache-manager";
const manager = CacheManager.getInstance();
console.log(manager.getStats());
```

- [ ] Cache hit rate > 80%
- [ ] No excessive memory usage
- [ ] API responses fast (< 500ms)

### 4. Lighthouse Score

```bash
npm install -g @lighthouse/cli
lighthouse https://localhost:3000 --output-path=lighthouse.html
```

- [ ] Performance score > 85
- [ ] Cache-Control headers correct
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 2.5s

### 5. Manual Testing

- [ ] Home page loads fast (< 2s)
- [ ] Doctor search works
- [ ] Schedule booking works
- [ ] Images load correctly
- [ ] No console errors
- [ ] No 404 errors for static assets
- [ ] Mobile responsive (check on actual device)

---

## Production Deployment

### 1. Pre-Deployment Verification

- [ ] All tests passing: `npm run lint`
- [ ] No TypeScript errors: `npm run build`
- [ ] Commit changes: `git add . && git commit -m "Cache optimization v2.0"`
- [ ] Push to repository: `git push origin main`

### 2. Deploy to Production

```bash
# Option 1: Vercel
vercel deploy --prod

# Option 2: Self-hosted
git pull origin main
npm ci
npm run build
pm2 restart rsmedika
```

- [ ] Deployment successful
- [ ] No deployment errors
- [ ] Application loads on production domain

### 3. Post-Deployment Verification

#### 3a. Check Cache Headers

```bash
# Verify static assets
curl -I https://rsmedikalestari.com/_next/static/chunks/main.js
# Expected: Cache-Control: public, max-age=31536000, immutable

# Verify API routes
curl -I https://rsmedikalestari.com/api/doctors
# Expected: Cache-Control: public, max-age=30, s-maxage=60, stale-while-revalidate=300

# Verify HTML pages
curl -I https://rsmedikalestari.com/
# Expected: Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=86400
```

- [ ] Static assets have 1-year cache
- [ ] API responses have short cache
- [ ] HTML pages have moderate cache + stale-while-revalidate
- [ ] Vary headers present

#### 3b. Service Worker Check

```javascript
// In browser console on production
navigator.serviceWorker.getRegistrations();
// Should show active service worker

// Check cached items
await caches.keys().then((names) => {
  names.forEach(async (name) => {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    console.log(name, keys.length);
  });
});
```

- [ ] Service Worker registered
- [ ] Multiple caches present
- [ ] Cached items > 50

#### 3c. Performance Metrics

```javascript
// In browser console
window.performance
  .getEntriesByType("resource")
  .slice(0, 5)
  .forEach((r) => console.log(r.name, r.duration.toFixed(0) + "ms"));
```

- [ ] Most resources load < 500ms
- [ ] Images optimized (check network tab)
- [ ] No waterfall requests
- [ ] API calls deduplicated

#### 3d. Lighthouse Score

```bash
lighthouse https://rsmedikalestari.com --output-path=prod-lighthouse.html
```

- [ ] Performance score > 85
- [ ] Best Practices score > 90
- [ ] Cache-Control headers implemented
- [ ] Service Worker working

### 4. Monitoring Setup

#### 4a. Google Analytics

```javascript
// Track cache performance
gtag("event", "cache_hit_rate", {
  value: cacheManager.getStats().hitRate,
});
```

- [ ] Setup cache hit rate tracking
- [ ] Monitor API response times
- [ ] Track page load performance

#### 4b. Error Tracking (Sentry)

```javascript
import * as Sentry from "@sentry/nextjs";

// Track cache errors
Sentry.captureException(error, {
  tags: { type: "cache_error" },
});
```

- [ ] Configure error tracking for cache issues
- [ ] Setup alerts for cache errors
- [ ] Monitor Service Worker registration failures

#### 4c. CloudFlare/CDN Monitoring

- [ ] Check cache hit rate in CloudFlare dashboard
- [ ] Verify purge cache capability
- [ ] Setup page rule for cache optimization (if using CloudFlare)

### 5. Cache Invalidation Setup

#### 5a. Manual Invalidation (Admin Panel)

```typescript
// Example: Clear doctor cache when updating doctor
import { CacheInvalidator } from "@/lib/cache-invalidator";

export async function updateDoctor(id: string, data: any) {
  // Update database
  await db.doctors.update(id, data);

  // Invalidate cache
  CacheInvalidator.invalidateDoctors();

  return { success: true };
}
```

- [ ] Implement invalidation in admin panel
- [ ] Test manual cache clearing
- [ ] Document cache invalidation API

#### 5b. CDN Cache Purging

- [ ] Configure CDN purge API (if available)
- [ ] Setup automated purge on updates
- [ ] Document purge process

#### 5c. Browser Notification

```typescript
// Notify users about updates
window.addEventListener("sw-update-available", () => {
  // Show toast/modal
  showUpdateNotification();
});
```

- [ ] Implement update notification
- [ ] Test auto-reload on update
- [ ] Verify user experience

---

## Common Issues & Solutions

### Issue: Updates not visible in production

**Diagnosis:**

```bash
# Hard refresh
Ctrl+Shift+Delete (Windows/Linux)
Cmd+Shift+Delete (Mac)

# Or programmatically
import { clearServiceWorkerCaches } from "@/lib/service-worker-register";
await clearServiceWorkerCaches();
```

**Solution:**

1. Check cache headers are correct
2. Verify Service Worker update
3. Clear CDN cache if applicable
4. Check CloudFlare rules

### Issue: Service Worker not registering

**Diagnosis:**

```javascript
navigator.serviceWorker
  .getRegistrations()
  .then((registrations) => console.log(registrations));
```

**Solution:**

1. Check `/public/sw.js` exists
2. Verify HTTPS enabled (required for Service Worker)
3. Check browser support (old browsers don't support SW)
4. Check browser console for errors

### Issue: Cache hit rate low (< 60%)

**Diagnosis:**

```typescript
const stats = CacheManager.getInstance().getStats();
console.log(`Hit rate: ${stats.hitRate}%`);
console.log(`Keys: ${stats.keys}`);
```

**Solution:**

1. Increase TTL for frequently accessed data
2. Check cache keys are consistent
3. Verify request deduplication working
4. Check for cache invalidation too aggressive

### Issue: High memory usage

**Solution:**

1. Reduce cache size by clearing old entries
2. Implement memory limit
3. Reduce TTL for large data
4. Check for memory leaks in Service Worker

---

## Rollback Plan

If deployment causes issues:

```bash
# Option 1: Revert to previous version
git revert HEAD
git push origin main

# Option 2: Quick rollback
pm2 restart rsmedika --cron="0 0 * * *"

# Option 3: Clear all caches
# Execute in production:
import { CacheInvalidator } from "@/lib/cache-invalidator";
CacheInvalidator.invalidateAll();
```

- [ ] Have previous deployment version tagged
- [ ] Document rollback procedure
- [ ] Test rollback process locally first

---

## Post-Deployment Monitoring (1 Week)

### Day 1

- [ ] Monitor error rates
- [ ] Check Service Worker registration success rate
- [ ] Verify cache hit rate > 80%
- [ ] Monitor API response times

### Day 2-3

- [ ] Check Lighthouse scores
- [ ] Verify no memory leaks
- [ ] Check user complaints/feedback
- [ ] Monitor cache invalidation logs

### Day 4-7

- [ ] Compare performance metrics before/after
- [ ] Verify cache strategy working as expected
- [ ] Check offline mode functionality
- [ ] Collect performance data for reporting

---

## Success Metrics

Expected improvements after deployment:

| Metric                 | Target           | How to Check                      |
| ---------------------- | ---------------- | --------------------------------- |
| Cache Hit Rate         | > 90%            | `CacheManager.getStats().hitRate` |
| API Response Time      | < 100ms (cached) | DevTools Network tab              |
| Page Load Time         | < 2s             | Lighthouse / DevTools Timing      |
| Time to Interactive    | < 3s             | Lighthouse / DevTools             |
| Service Worker Success | > 99%            | Analytics tracking                |
| Memory Usage           | < 50MB           | Browser DevTools Memory tab       |

---

## Documentation Links

- 📖 [Cache Optimization Guide](./CACHE_OPTIMIZATION_GUIDE.md)
- 🔧 [Cache Manager](./lib/cache-manager.ts)
- 🚀 [Service Worker](./public/sw.js)
- 📦 [Cache Invalidator](./lib/cache-invalidator.ts)
- ⚙️ [Next.js Config](./next.config.ts)
- 🔗 [Middleware](./middleware.ts)

---

## Sign-Off

- [ ] All checklist items completed
- [ ] Testing passed
- [ ] Deployment successful
- [ ] Monitoring setup complete
- [ ] Documentation updated
- [ ] Team notified

**Date**: ******\_\_\_******  
**Deployed By**: ******\_\_\_******  
**Verified By**: ******\_\_\_******
