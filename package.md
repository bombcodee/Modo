# package.md — 사용 패키지·도구·기술 스택

> 이 문서는 Modo 프로젝트가 **현재 사용하고 있는** 패키지·라이브러리·웹 API·도구를 한 곳에 모은 레퍼런스다.
> 새 의존성을 도입하거나 제거하면 즉시 이 문서를 갱신한다.

마지막 갱신: 2026-05-07

---

## 0. 한 줄 요약

> **빌드 도구·번들러·프레임워크 없음.** 순수 HTML + CSS + 바닐라 JavaScript로 작성된 정적 웹 앱이며, 브라우저 표준 Web API(Service Worker, Cache API, localStorage)만 사용한다.

`package.json`이 없는 이유: npm 의존성이 0개이기 때문. 추후 모듈 분리·번들링 도입 시 추가될 수 있다 ([§5 향후 도입 후보](#5-향후-도입-후보) 참조).

---

## 1. 런타임 의존성

### 1-1. 브라우저 표준 (별도 설치 불필요)

| 기술 | 용도 | 사용 위치 |
|------|------|----------|
| **HTML5** | 마크업 | [index.html](index.html) |
| **CSS3** (CSS Variables, Flexbox, `@keyframes`, `@media`) | 디자인 토큰·레이아웃·애니메이션·반응형 | [index.html](index.html) `<style>` |
| **Vanilla JavaScript (ES2015+)** | 체크 인터랙션·상태 저장 | [index.html](index.html) `<script>` |
| **Web Storage API** (`localStorage`) | 체크 상태·날짜 영속화 | `saveState`, `loadState`, 자정 자동 초기화 |
| **Service Worker API** | 오프라인 캐시·앱 셸 | [sw.js](sw.js) |
| **Cache Storage API** (`caches.open`, `cache.addAll`) | 정적 자원 캐싱 | [sw.js](sw.js) install/fetch 핸들러 |
| **Fetch API** | Service Worker 내부 네트워크 호출 | [sw.js](sw.js) `fetch` 이벤트 |
| **Web App Manifest** | PWA 설치·홈 화면 아이콘·테마 | [manifest.json](manifest.json) |

### 1-2. 외부 리소스 (CDN)

| 리소스 | 출처 | 용도 |
|--------|------|------|
| **Noto Serif KR** (300/400/600) | Google Fonts | 한국어 본문 글꼴 |
| **DM Mono** (300/400) | Google Fonts | 라벨·뱃지·메타 정보용 모노스페이스 |

로드 위치: [index.html](index.html) `<head>`의 `<link href="https://fonts.googleapis.com/...">`.

> ⚠ 외부 도메인이라 [sw.js](sw.js)의 캐시 정책(same-origin only)에서 제외됨 — 첫 로드 후 폰트가 캐시된다는 보장은 브라우저 HTTP 캐시에만 의존한다.

---

## 2. 정적 자원

| 자원 | 크기 | 용도 |
|------|------|------|
| `icon-192.png` | 192×192 | Android Chrome PWA 아이콘 (`manifest.json`이 참조) |
| `icon-512.png` | 512×512 | 스플래시 화면·고해상도 아이콘 (`manifest.json`이 참조) |
| `apple-touch-icon.png` | iOS 표준 사이즈 | iOS Safari 홈 화면 아이콘 ([index.html](index.html) `<link rel="apple-touch-icon">`) |

---

## 3. 개발·실행 도구 (선택)

소스 코드 자체에는 의존성이 없지만, 로컬 개발·테스트 시 다음 중 아무거나 사용할 수 있다.

### 3-1. 로컬 정적 서버 (Service Worker 테스트에 필수)

Service Worker는 `https://` 또는 `http://localhost`에서만 동작하므로, 파일을 더블클릭(`file://`)으로 열면 SW 등록이 실패한다. 다음 중 하나를 사용:

| 도구 | 명령 | 비고 |
|------|------|------|
| Python (내장) | `python -m http.server 8000` | 별도 설치 불필요 |
| Node.js | `npx serve .` | Node 환경에서 가장 간편 |
| VS Code | "Live Server" 확장 | IDE 통합 |

### 3-2. 권장 IDE / 에디터
- **Visual Studio Code** — 본 프로젝트는 VS Code 기반 (워크스페이스 컨벤션은 거기에 맞춤)

### 3-3. 배포 호스팅 (검토 단계)
정적 파일만 있으면 되므로 다음 중 어디든 배포 가능:
- **Vercel** — 자동 https + Git 연동 (현재 우선 검토 대상)
- **Netlify** — 동일 클래스
- **GitHub Pages** — 무료, 도메인 제한 있음
- **Cloudflare Pages** — CDN 강점

> 배포 시 [sw.js](sw.js) 내부의 `CACHE_VERSION` 값을 올려야 사용자에게 새 버전이 적용된다 — 이건 인프라가 아니라 코드 컨벤션이지만 배포 절차에 묶여 있어 여기 명시.

---

## 4. 도입하지 않은 것 (Why-not)

다음은 검토했지만 **현재는 도입하지 않은** 도구들이다. 결정의 맥락을 남긴다.

| 항목 | 도입 안 한 이유 |
|------|-----------------|
| **React / Vue / Svelte** | 단일 페이지·단순 인터랙션·낮은 상태 복잡도. 프레임워크 비용 > 이익 |
| **Tailwind / styled-components** | CSS Variable 기반 디자인 토큰만으로 충분히 깔끔. 빌드 단계 없이 유지 가능 |
| **Vite / Webpack / esbuild** | 모듈 분리 전이라 번들러 도입은 시기상조. [LOADMAP.md](docs/LOADMAP.md) P0 리팩터링 후 재검토 |
| **TypeScript** | 코드량 적고 단독 사용자. 도입 시 빌드 단계 필요 — 모듈 분리와 함께 검토 |
| **테스트 프레임워크 (Vitest/Jest)** | 현재 로직이 매우 단순. Storage 모듈 분리 시 단위 테스트 도입 검토 ([LOADMAP.md](docs/LOADMAP.md) P2) |
| **Tailwind CSS** | CSS 변수와 약 300줄짜리 스타일이면 충분. 추가 빌드 비용 회피 |
| **외부 푸시 서비스 (FCM 등)** | 알림 기능 자체가 토의 단계 ([LOADMAP.md](docs/LOADMAP.md) §3) |

---

## 5. 향후 도입 후보

[LOADMAP.md](docs/LOADMAP.md)의 작업이 진행되면서 도입이 검토될 수 있는 도구들. 도입이 결정되면 §1로 옮긴다.

| 후보 | 트리거 시점 | 용도 |
|------|------------|------|
| **Vite** (빌드 도구) | 모듈 분리(LOADMAP P0) 후 ES Module 번들링이 필요해질 때 | 개발 서버 + 프로덕션 번들 |
| **TypeScript** | 모듈 수가 5개 이상으로 늘어나 타입 추적이 어려워질 때 | 정적 타입 |
| **Vitest** | Storage / Data 모듈 분리 후 | 단위 테스트 |
| **IndexedDB** (Web API, 별도 설치 불필요) | 복용 이력 기능 추가 시 | localStorage보다 큰 데이터 영속화 |
| **Workbox** | Service Worker 캐시 전략이 복잡해질 때 | SW 추상화 라이브러리 |
| **Notification API** (Web API) | 복용 알림 기능 도입 시 | 푸시 알림 |

---

## 6. 의존성 갱신 가이드

- 새 외부 스크립트·폰트·라이브러리를 추가하면 §1 또는 §3에 즉시 추가
- 도구를 검토했지만 도입하지 않기로 결정했다면 §4에 이유와 함께 기록
- §5의 후보가 도입되면 §1·§4로 이동
- 새 의존성이 [sw.js](sw.js)의 `PRECACHE_URLS` / 캐시 정책에 영향을 주는지 항상 확인 — 미반영 시 오프라인에서 깨짐
