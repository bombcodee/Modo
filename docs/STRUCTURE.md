# STRUCTURE.md — 프로젝트 구조와 상관관계

> 이 문서는 Modo 프로젝트의 **현재** 폴더·파일 구조와 각 파일의 책임, 그리고 파일 간 의존·호출 관계를 정리한다.
> 새 파일·폴더를 추가하면 즉시 이 문서를 갱신한다.

마지막 갱신: 2026-05-07

---

## 1. 폴더 트리

```
Modo/
├─ README.md               # 사용자 관점 소개 (앱이 무엇이고 어떻게 쓰는가)
├─ CLAUDE.md               # 개발자/Claude 진입점 (문서 맵·작업 흐름)
├─ package.md              # 사용 패키지·도구·기술 스택
├─ index.html              # 앱 본체 (루트 고정 — 진입점)
├─ manifest.json           # PWA 매니페스트 (루트 고정 — 관례 + index.html 참조)
├─ sw.js                   # Service Worker (★ 루트 고정 — SW scope 제약)
├─ assets/
│  └─ icons/
│     ├─ icon-192.png      # Android Chrome PWA 아이콘 (192×192)
│     ├─ icon-512.png      # 스플래시·고해상도 (512×512)
│     └─ apple-touch-icon.png  # iOS Safari 홈 화면 아이콘
└─ docs/
   ├─ PRINCIPLE.md         # 코드 규칙 (불변)
   ├─ STRUCTURE.md         # ← 이 문서
   ├─ LOADMAP.md           # 개발 로드맵 (PRD)
   └─ MEMORY.md            # 세션 히스토리
```

> ★ Service Worker는 자신이 위치한 디렉토리 이하만 제어할 수 있다. `/sw.js`에 두면 사이트 전체(`/`)가 scope가 되지만, `/assets/sw.js`에 두면 `/assets/` 아래만 캐시되어 페이지 자체가 오프라인에서 동작하지 않는다 — 그래서 루트 고정.

---

## 2. 파일별 책임

### 2-1. `index.html`
**책임**: 앱의 모든 것 — HTML 마크업, 스타일, 스크립트가 한 파일에 들어 있다.

| 섹션 | 줄(대략) | 내용 |
|------|---------|------|
| `<head>` 메타 | 1–26 | PWA 메타태그(manifest, theme-color, apple-touch-icon, favicon) |
| `<style>` | 28–357 | 디자인 토큰(`:root` CSS 변수) + 컴포넌트 스타일(.header / .time-block / .card / .warning-box / .check-btn / .reset-btn) + 키프레임 + 모바일 미디어쿼리 |
| `<body>` 마크업 | 359–514 | 헤더 → 5개 시간 블록(time-block) → 주의사항(warning-box) → 푸터(footer + reset-btn) |
| `<script>` | 516–572 | `toggleCheck` / `resetAll` / `saveState` / `loadState` + 날짜 비교 자동 초기화 + Service Worker 등록 |

**현재 한계**: HTML/CSS/JS가 한 파일에 섞여 있고, 영양제 데이터가 `<div class="card">`로 마크업에 하드코딩되어 있다 — [PRINCIPLE.md](PRINCIPLE.md) §0(로봇 구조)·§1-2(책임 분리) 위반. 분리 작업은 [LOADMAP.md](LOADMAP.md)의 리팩터링 항목 참조.

### 2-2. `manifest.json`
**책임**: PWA 매니페스트. 앱 이름, 아이콘 세트, 시작 URL, 표시 모드(`standalone`), 테마/배경색을 브라우저에 알린다.

**참조**: [index.html](../index.html) `<head>`의 `<link rel="manifest" href="/manifest.json">`

### 2-3. `sw.js` (Service Worker)
**책임**: 오프라인 동작 + 정적 자원 캐싱. Cache-First 전략으로 캐시에 있으면 즉시 반환, 없으면 네트워크에서 가져와 캐시에 저장한다.

**핵심 상수**:
- `CACHE_VERSION` — 새 배포 시 반드시 올린다 (사용자에게 새 버전 적용)
- `PRECACHE_URLS` — 앱 셸로 미리 캐시할 파일 목록

**이벤트**:
- `install` → 앱 셸 캐시
- `activate` → 이전 버전 캐시 정리
- `fetch` → 모든 GET 요청 가로채기 (same-origin만 캐시 저장, HTML 요청은 네트워크 실패 시 `/index.html` 폴백)

**참조**: [index.html](../index.html)의 SW 등록 스크립트 (`navigator.serviceWorker.register('/sw.js')`)

### 2-4. 아이콘 파일들 (`assets/icons/`)
모든 아이콘은 `assets/icons/`에 모아둔다. 정적 자산을 루트와 분리해 디렉토리를 깔끔하게 유지하기 위함.

- `assets/icons/icon-192.png` / `icon-512.png` — `manifest.json`이 참조 (Android/Chrome PWA 설치 시)
- `assets/icons/apple-touch-icon.png` — `index.html` `<head>`가 직접 참조 (iOS 홈 화면)
- 세 파일 모두 [sw.js](../sw.js)의 `PRECACHE_URLS`에 등록되어 오프라인 캐시 대상

### 2-5. 루트 문서
- [README.md](../README.md) — 사용자 관점 앱 소개 (기능 설명, 등록된 영양제, 설치 방법)
- [CLAUDE.md](../CLAUDE.md) — 개발자/Claude 진입점 (문서 맵, 작업 흐름)
- [package.md](../package.md) — 사용 중인 패키지·웹 API·도구, 도입 안 한 것의 이유, 향후 후보

### 2-6. 문서 (docs/)
- [PRINCIPLE.md](PRINCIPLE.md) — 코드 규칙 (불변)
- [STRUCTURE.md](STRUCTURE.md) — 본 문서
- [LOADMAP.md](LOADMAP.md) — 개발 계획·진행 상태
- [MEMORY.md](MEMORY.md) — 세션 히스토리

---

## 3. 상관관계 — 누가 누구를 부르는가

### 3-1. 런타임 의존 그래프 (현재 상태)

```
[브라우저]
    │ 최초 요청
    ▼
[index.html]  ◀──────────── /assets/icons/apple-touch-icon.png (직접 link)
    │
    ├─ <link rel="manifest"> ───▶ [manifest.json] ──▶ /assets/icons/icon-192.png, /assets/icons/icon-512.png
    │
    ├─ <script> 인라인 JS
    │     │
    │     ├─ toggleCheck() ───▶ saveState() ──▶ localStorage('supplementChecks')
    │     ├─ resetAll()    ───▶ localStorage.removeItem(...)
    │     └─ 페이지 로드 시 ──▶ 날짜 비교 ──▶ loadState() 또는 자동 초기화
    │
    └─ navigator.serviceWorker.register('/sw.js') ──▶ [sw.js]
                                                          │
                                                          ├─ install ──▶ caches.addAll(PRECACHE_URLS)
                                                          ├─ activate ──▶ 이전 캐시 삭제
                                                          └─ fetch    ──▶ 캐시 또는 네트워크
```

### 3-2. 문서 참조 그래프

```
일반 사용자 / 외부 방문자
   │
   ▼
README.md  ─────▶ (필요 시) CLAUDE.md, package.md, docs/STRUCTURE.md, docs/LOADMAP.md

개발자 / Claude
   │
   ▼
CLAUDE.md ─┬─▶ README.md            (앱 자체 설명)
           ├─▶ package.md           (어떤 도구를 쓰는가)  ◀─ 의존성 변경 시 갱신
           ├─▶ docs/PRINCIPLE.md    (어떻게 짤 것인가)
           ├─▶ docs/STRUCTURE.md    (어디에 있는가)      ◀─ 새 파일 추가 시 갱신 필수
           ├─▶ docs/LOADMAP.md      (무엇을 할 것인가)
           └─▶ docs/MEMORY.md       (무엇을 했는가)

LOADMAP / PRINCIPLE / MEMORY / package 끼리는 직접 링크 가능
```

### 3-3. 코드 모듈 간 결합 (현재)

현재는 모든 코드가 [index.html](../index.html) 한 파일 안에 있어 모듈 경계가 없다. 함수·DOM·localStorage 키가 같은 스코프에서 직접 참조된다.

| 함수 | 의존 | 호출처 |
|------|------|--------|
| `toggleCheck(btn, cardId)` | DOM(btn, cardId), `saveState` | `<div class="check-btn" onclick="...">` 인라인 |
| `resetAll()` | DOM(`.check-btn`, `.card`), localStorage | `<button class="reset-btn" onclick="...">` 인라인 |
| `saveState()` | DOM(`.check-btn`), localStorage | `toggleCheck` |
| `loadState()` | DOM(`.check-btn`, `.card`), localStorage | 페이지 로드 시 (날짜 동일하면) |
| 날짜 비교 블록 | localStorage, `Date` | 페이지 로드 시 즉시 실행 |

이 결합 구조는 [PRINCIPLE.md](PRINCIPLE.md) §0/§1을 위반한다 — [LOADMAP.md](LOADMAP.md)의 모듈 분리 항목에서 다룬다.

### 3-4. 목표 모듈 구조 (리팩터링 후 — 미구현)

[LOADMAP.md](LOADMAP.md)에서 추적되는 분리 작업이 완료되면 다음 구조가 된다.

```
Modo/
├─ index.html
├─ styles/
│  └─ main.css
├─ src/
│  ├─ data/
│  │  └─ supplements.js        # 영양제 정의 (Data 계층)
│  ├─ storage/
│  │  └─ supplement-storage.js # localStorage 래퍼 (Storage 계층)
│  ├─ ui/
│  │  ├─ schedule-renderer.js  # 시간 블록·카드 렌더 (UI 계층)
│  │  └─ check-button.js       # 체크박스 컴포넌트
│  ├─ controller/
│  │  └─ check-controller.js   # 클릭 → Storage → UI 반영 (Controller 계층)
│  └─ app.js                   # 부트스트랩
├─ sw.js
└─ manifest.json
```

각 모듈은 [PRINCIPLE.md](PRINCIPLE.md) §1-2의 계층 규칙에 따라 자기보다 안쪽 계층만 참조한다.

---

## 4. 데이터 흐름 (Runtime)

### 4-1. 페이지 로드 시
1. 브라우저 → `index.html` 요청 → SW가 캐시/네트워크에서 응답
2. HTML 파싱 → 인라인 `<style>`, `<script>` 실행
3. `<script>` 즉시 실행 블록: `localStorage['scheduleDate']`와 오늘 날짜 비교
   - 다르면: `'scheduleDate'`를 오늘로 갱신, `'supplementChecks'` 삭제 (자동 초기화)
   - 같으면: `loadState()` 호출 → 저장된 체크 상태를 DOM에 반영
4. SW 등록 (`load` 이벤트 후)

### 4-2. 사용자가 체크박스 클릭 시
1. 인라인 `onclick="toggleCheck(this, 'card-xxx')"` 실행
2. `toggleCheck` → 버튼·카드에 클래스 토글 → `saveState()` 호출
3. `saveState`가 모든 체크박스를 순회해 인덱스 → boolean 객체를 만들고 `localStorage`에 JSON 직렬화

### 4-3. "오늘 체크 초기화" 클릭 시
1. 인라인 `onclick="resetAll()"`
2. 모든 `.check-btn`/.card에서 `checked`/`checked-card` 클래스 제거
3. `localStorage.removeItem('supplementChecks')`
4. (`scheduleDate`는 그대로 유지 — 날짜는 그대로지만 체크만 초기화)

### 4-4. localStorage 키
| 키 | 값 | 의미 |
|-----|----|----|
| `supplementChecks` | `JSON: { "0": true, "1": false, ... }` | 체크박스 인덱스별 체크 여부 |
| `scheduleDate` | `string`, e.g. `"Thu May 07 2026"` | 마지막으로 상태가 저장된 날짜 (자동 초기화 트리거) |

> ⚠ 현재 키는 **인덱스 기반**이라 카드 순서가 바뀌면 상태가 어긋난다 — [LOADMAP.md](LOADMAP.md)에서 ID 기반으로 변경 예정.

---

## 5. 문서 갱신 의무

다음 변경이 발생하면 **이 문서를 즉시 갱신**한다 — [PRINCIPLE.md](PRINCIPLE.md) §4-4.

- 새 파일/폴더 추가 → §1 트리, §2 책임 추가
- 모듈 간 새 의존 추가 → §3 그래프 갱신
- 새 데이터 흐름 추가 (예: 새 localStorage 키, 새 이벤트) → §4 갱신
- 리팩터링으로 구조 변경 → §3-4 목표 구조와 §1 현행 구조 동기화

갱신을 잊으면 다음 작업자가 잘못된 가정을 하고 코드를 깨뜨린다.
