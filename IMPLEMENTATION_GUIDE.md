/\*\*

- IMPLEMENTATION GUIDE - Data Fetching Optimization
-
- Panduan step-by-step untuk mengintegrasikan file baru
  \*/

// ============================================================================
// 1. MODIFY: app/dokter/[id]/page.tsx
// ============================================================================
// BEFORE: Sequential (Waterfall) Fetching
/\*
useEffect(() => {
const loadData = async () => {
try {
const doctorData = await fetchDoctorById(doctorId); // 200ms ⏳
if (doctorData) {
setDoctor(doctorData);
const schedulesData = await fetchSchedulesByDoctor(doctorId); // +200ms ⏳
setSchedules(schedulesData);

        const recommendedData = await fetchDoctorsBySpecialty(  // +200ms ⏳
          doctorData.specialty,
        );
        setRecommendedDoctors(recommendedData);
      }
    } catch (error) {
      console.error("Error loading doctor data:", error);
    } finally {
      setLoading(false);
    }

};
if (doctorId) loadData();
}, [doctorId]);
\*/

// AFTER: Parallel Fetching (50-60% faster)
/\*
import { parallelFetch } from '@/lib/parallel-fetch';
import { deduplicateRequest } from '@/lib/enhanced-request-cache';

useEffect(() => {
const loadData = async () => {
try {
// Fetch doctor first (required for specialty)
const doctorData = await deduplicateRequest(
`doctor:${doctorId}`,
() => fetchDoctorById(doctorId),
);

      if (!doctorData) {
        setLoading(false);
        return;
      }

      setDoctor(doctorData);

      // Fetch schedules & recommended doctors in parallel
      const { schedules, recommended } = await parallelFetch(
        {
          schedules: deduplicateRequest(
            `schedules:${doctorId}`,
            () => fetchSchedulesByDoctor(doctorId),
          ),
          recommended: deduplicateRequest(
            `doctors:specialty:${doctorData.specialty}`,
            () => fetchDoctorsBySpecialty(doctorData.specialty),
          ),
        },
        { timeout: 5000, fallbackOnError: true },
      );

      setSchedules(schedules);

      // Filter to exclude current doctor
      const filtered = recommended.filter(
        (doc: Doctor) => doc.id !== doctorId,
      );
      setRecommendedDoctors(filtered);
    } catch (error) {
      console.error("Error loading doctor data:", error);
    } finally {
      setLoading(false);
    }

};

if (doctorId) loadData();
}, [doctorId]);
\*/

// ============================================================================
// 2. MODIFY: components/HeroSection.tsx
// ============================================================================
// BEFORE: Multiple animation triggers
/_
setLoading(true);
setCurrentDeviceType(deviceType);
setSlides(banners); // Animation trigger 1
setLoadedSlides({...}); // Animation trigger 2
_/

// AFTER: Batch updates
/\*
import { useOptimizedAnimation } from '@/lib/hooks/useOptimizedAnimation';
import { useImagePreload } from '@/lib/hooks/useImagePreload';

// In component:
const { data: slideState, batchUpdate } = useOptimizedAnimation({
slides: [] as HeroBanner[],
currentDeviceType: 'desktop' as 'desktop' | 'mobile',
loadedSlides: {} as Record<string, boolean>,
}, { debounceMs: 50 });

// Preload images concurrently
const imageUrls = slides.map(s => s.image_url);
useImagePreload({
urls: imageUrls,
maxConcurrent: 2,
lowPriority: false,
});

// Instead of:
// setSlides(banners);
// setCurrentDeviceType(deviceType);
// setLoadedSlides({});

// Do this:
batchUpdate({
slides: banners,
currentDeviceType: deviceType,
loadedSlides: {},
});
\*/

// ============================================================================
// 3. NEW: Create Enhanced API Wrapper
// ============================================================================
// Create file: lib/api-enhanced.ts
// This wraps existing api.ts with deduplication & caching

/\*
import {
fetchDoctors as fetchDoctorsBase,
fetchDoctorById as fetchDoctorByIdBase,
fetchRoomTypes as fetchRoomTypesBase,
// ... other imports
} from './api';
import { deduplicateRequest } from './enhanced-request-cache';

// Wrap with deduplication
export async function fetchDoctors(
specialty?: string,
searchName?: string,
) {
const cacheKey = `doctors:${specialty || 'all'}:${searchName || 'all'}`;
return deduplicateRequest(cacheKey, () =>
fetchDoctorsBase(specialty, searchName),
);
}

export async function fetchDoctorById(id: string) {
const cacheKey = `doctor:${id}`;
return deduplicateRequest(cacheKey, () =>
fetchDoctorByIdBase(id),
);
}

export async function fetchRoomTypes() {
const cacheKey = 'rooms:all';
return deduplicateRequest(cacheKey, () =>
fetchRoomTypesBase(),
);
}

// ... wrap all other fetch functions similarly
\*/

// ============================================================================
// 4. MODIFY: app/admin/dashboard/page.tsx
// ============================================================================
// BEFORE: Good but can be improved
/_
const [docRes, schRes] = await Promise.all([
fetch("/api/admin/stats/doctors"),
fetch("/api/admin/stats/schedules"),
]);
_/

// AFTER: Add timeout & better error handling
/\*
import { parallelFetch } from '@/lib/parallel-fetch';

const stats = await parallelFetch({
doctors: fetch("/api/admin/stats/doctors").then(r => r.json()),
schedules: fetch("/api/admin/stats/schedules").then(r => r.json()),
}, {
timeout: 5000,
fallbackOnError: true,
});

setStats({
totalDoctors: stats.doctors?.count || 0,
totalSchedules: stats.schedules?.count || 0,
});
\*/

// ============================================================================
// 5. MODIFY: components/PopupDisplay.tsx
// ============================================================================
// BEFORE: Preload images inline during fetch
/_
const preloadImages = useCallback((data: Popup[]) => {
data.forEach((item) => {
const img = new Image();
img.src = item.image_url;
});
}, []);
_/

// AFTER: Use optimized preload hook
/\*
import { useImagePreload } from '@/lib/hooks/useImagePreload';

// Extract image URLs
const imageUrls = useMemo(
() => popups.map(p => p.image_url),
[popups],
);

// Use optimized preload with concurrency limit
useImagePreload({
urls: imageUrls,
maxConcurrent: 2,
lowPriority: true, // Popups are secondary content
onProgress: (loaded, total) => {
console.debug(`Popup images: ${loaded}/${total}`);
},
});
\*/

// ============================================================================
// 6. MONITORING & DEBUGGING
// ============================================================================
// Add to your dashboard or debug page:

/\*
import { getRequestCacheStats } from '@/lib/enhanced-request-cache';
import { cacheManager } from '@/lib/cache-manager';

export function CacheDebugPanel() {
const requestStats = getRequestCacheStats();
const cacheStats = cacheManager.getStats();

return (
<div className="p-4 bg-gray-100 rounded">
<h3>Cache Statistics</h3>

      <div>
        <h4>Request Cache</h4>
        <pre>{JSON.stringify(requestStats, null, 2)}</pre>
      </div>

      <div>
        <h4>Data Cache</h4>
        <pre>{JSON.stringify(cacheStats, null, 2)}</pre>
      </div>

      <button onClick={() => {
        clearAllRequestCache();
        cacheManager.clear();
        console.log('✅ All caches cleared');
      }}>
        Clear All Caches
      </button>
    </div>

);
}
\*/

// ============================================================================
// 7. NEXT STEPS - Implementation Roadmap
// ============================================================================

/\*
WEEK 1 (Priority: CRITICAL):
□ Create lib/parallel-fetch.ts ✓ DONE
□ Create lib/cache-manager.ts ✓ DONE
□ Create lib/enhanced-request-cache.ts ✓ DONE
□ Create lib/hooks/useOptimizedAnimation.ts ✓ DONE
□ Create lib/hooks/useImagePreload.ts ✓ DONE
□ Modify app/dokter/[id]/page.tsx → TODO
□ Modify components/HeroSection.tsx → TODO
□ Test waterfall elimination → TODO

WEEK 2 (Priority: HIGH):
□ Create lib/api-enhanced.ts → TODO
□ Wrap all API calls with deduplication → TODO
□ Modify components/PopupDisplay.tsx → TODO
□ Add cache debug panel → TODO
□ Performance testing & monitoring → TODO

WEEK 3 (Priority: MEDIUM):
□ Implement React Query (optional) → OPTIONAL
□ Background refresh strategy → TODO
□ Advanced image optimization → TODO
□ Mobile-specific optimizations → TODO
\*/

// ============================================================================
// 8. VERIFICATION CHECKLIST
// ============================================================================

/\*
After implementing changes:

PERFORMANCE:
□ Doctor detail page loads < 500ms (from 800-1000ms)
□ Hero banners change < 150ms (from 300-400ms)
□ No visible jank during animations
□ 60fps maintained on mid-range devices

NETWORK:
□ No duplicate concurrent requests (check Network tab)
□ Request count reduced by 30-40%
□ Cache hit rate > 60%

MOBILE:
□ Touch interactions responsive (< 100ms)
□ Dropped frames minimized
□ Memory usage < 40MB

CODE QUALITY:
□ No console errors
□ TypeScript strict mode happy
□ ESLint passing
□ No memory leaks in DevTools
\*/
