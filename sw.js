/**
 * Service Worker - 오프라인 지원
 *
 * 동작 원리:
 * 1) install 이벤트: 앱이 처음 설치될 때, 필요한 파일들을 미리 캐시에 저장
 * 2) fetch 이벤트: 모든 네트워크 요청을 가로채서, 캐시에 있으면 캐시에서 반환 (오프라인 동작 가능)
 * 3) activate 이벤트: 새 버전이 배포되면 이전 캐시를 정리
 *
 * 전략: Cache-First (캐시 우선)
 *   - 영양제 체크리스트는 자주 바뀌지 않는 정적 컨텐츠라서 캐시 우선이 적합
 *   - 새 버전을 배포하려면 아래 CACHE_VERSION 숫자만 올리면 됨
 */

// 캐시 버전 - HTML/CSS/JS 수정 후 배포할 때마다 이 숫자를 올려야 사용자에게 새 버전이 적용됩니다
const CACHE_VERSION = 'v1';
const CACHE_NAME = `supplement-cache-${CACHE_VERSION}`;

// 미리 캐시할 파일 목록 (앱 셸)
// 이 파일들이 모두 캐시되어야 오프라인에서 앱이 정상 동작합니다
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/icons/apple-touch-icon.png'
];

/**
 * install 이벤트
 * Service Worker가 처음 설치될 때 한 번만 호출됨
 * 핵심 파일들을 캐시에 저장해서 오프라인 사용을 준비
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] 핵심 파일 캐싱 시작');
      return cache.addAll(PRECACHE_URLS);
    }).then(() => {
      // 새 SW를 즉시 활성화 (기존 SW를 기다리지 않음)
      return self.skipWaiting();
    })
  );
});

/**
 * activate 이벤트
 * 새 Service Worker가 활성화될 때 호출됨
 * 이전 버전의 캐시를 모두 삭제해서 디스크 공간 낭비 방지
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)  // 현재 캐시가 아닌 것만
          .map((name) => {
            console.log('[SW] 이전 캐시 삭제:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      // 활성화 즉시 모든 클라이언트(탭)에 적용
      return self.clients.claim();
    })
  );
});

/**
 * fetch 이벤트
 * 페이지에서 발생하는 모든 네트워크 요청을 가로챔
 *
 * 전략: Cache-First with Network Fallback
 *   1) 캐시에 있으면 즉시 캐시 반환 (빠름, 오프라인 가능)
 *   2) 캐시에 없으면 네트워크에서 가져오고, 동시에 캐시에 저장
 *   3) 네트워크도 실패하면 (오프라인 + 미캐시) 그냥 실패
 */
self.addEventListener('fetch', (event) => {
  // GET 요청만 캐싱 (POST/PUT 등은 캐싱하면 안 됨)
  if (event.request.method !== 'GET') return;

  // 다른 도메인(예: Google Fonts)은 캐싱 정책이 다를 수 있으므로,
  // same-origin 요청만 처리합니다.
  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1) 캐시 히트: 즉시 반환
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2) 캐시 미스: 네트워크에서 가져오기
      return fetch(event.request).then((networkResponse) => {
        // 정상 응답이고 same-origin이면 캐시에 저장
        // (외부 CDN은 CORS 정책 때문에 캐시가 깨질 수 있어서 제외)
        if (networkResponse.ok && isSameOrigin) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // 3) 네트워크도 실패 (오프라인 + 미캐시)
        // HTML 요청이면 메인 페이지를 fallback으로 반환
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/index.html');
        }
        // 그 외는 그냥 에러
      });
    })
  );
});
