# MEMORY.md — 세션 히스토리

> 이 문서는 사용자가 세션을 통해 내린 **명령들의 히스토리**를 보존한다.
> 시간이 지나도 이전 결정의 맥락을 잃지 않기 위함이다.

## 기록 시점

다음 두 경우에만 기록한다 — 그 외엔 추가하지 않는다.

1. **커밋을 만드는 시점** — 의미 있는 작업 단위가 끝났을 때, 무엇을·왜 했는지를 한 항목으로 남긴다.
2. **사용자가 명시적으로 "메모리에 저장해줘"라고 말할 때** — 즉시 기록한다.

## 기록 양식

각 항목은 다음 형식을 따른다:

```markdown
### YYYY-MM-DD — 한 줄 요약

- **요청**: 사용자가 무엇을 시켰는가 (원문 또는 핵심 인용)
- **결정/실행**: 무엇을 했는가, 왜 그렇게 했는가
- **영향 범위**: 어떤 파일·문서가 바뀌었는가
- **연결**: 관련 LOADMAP 항목, PR/커밋, 이전 메모리
```

핵심 원칙:
- **사실**과 **결정의 이유**를 함께 남긴다 — 코드만 보면 알 수 없는 "왜"가 핵심
- 코드 변경 자체는 git history가 보존하므로 **여기엔 결정의 맥락**만 남긴다
- 한 항목은 5~10줄을 넘지 않게 한다 — 길어지면 별도 문서로 빼고 링크

---

## 히스토리

### 2026-05-07 — Garden Notes 디자인 업그레이드 + 운영 결정

- **요청**: "프론트엔드 스킬을 사용해서 디자인을 업그레이드 시켜줘 — 따뜻한 톤은 유지하되 더 distinctive하게, 모바일 우선, 진행률 시각화·시간대 구분 강화·더 만족스러운 마이크로 인터랙션, 단 화려하지 말고 고요하게."
- **결정/실행**:
  - 3가지 컨셉(Apothecary Almanac / Dawn Meridian / Garden Notes) 중 **Garden Notes** 선택 — 손으로 다듬은 정원 일지 메타포, 흙·이끼·점토 톤
  - Fraunces 가변폰트 도입 (이탤릭 강조 + SOFT 축으로 옵티컬 사이즈별 차등). Noto Serif KR + DM Mono와 페어링
  - 페이퍼 결 노이즈 SVG 오버레이는 **사용자 요청으로 제거** — "괜히 더 안보이는 것 같다". 가독성 우선.
  - **앱 제목**: 본인 결정으로 "**나의 영양제 루틴**" 유지 (Quiet Garden / Modo / 영양제 테이블 제안 중). 이유: 가장 잘 설명하고 친숙함, 향후 분기 가능성도 열어둠
  - **주의 박스 재구성**: 본인 결정으로 한 박스 안에서 "**✕ 피하기 / ✓ 돕기**" 두 갈래로 나눔 (별도 박스 분리는 공간 낭비). 각각 4개 항목씩(피하기는 기존 3 + 칼슘 추가, 돕기는 신규 4개). 색조: 피하기=클레이, 돕기=이끼
  - **헤더**: 사용자 요청으로 원본의 중앙 정렬 + 영문 eyebrow(`DAILY SUPPLEMENT SCHEDULE`) 패턴을 새 디자인 톤으로 복원. eyebrow는 모스 그린 DM Mono 와이드 트래킹
  - **한국어 일괄화**: on empty / fasted / with meal / cap / tab / DAY · 057 / rooted today / reset today / C A V E A T 등 영문 잔재를 모두 한국어로 변환 (공복 / 식후 / 캡슐 / 정 / N일째 / 오늘 N/M 복용 / 오늘 체크 초기화 / 주 의)
  - **카드 정합 수정**: 태그를 `align-self: baseline` + `min-width: 52px` + `text-align: center`로 가지런히, 이름은 `word-break: keep-all`로 한국어 단어 보호
  - **인라인 onclick 제거**: `addEventListener`로 위임하여 [PRINCIPLE.md](PRINCIPLE.md) §5 안티패턴 해소
  - **localStorage**: `startDate` 키 신설(N일째 카운터 누적용). 기존 `supplementChecks` / `scheduleDate`는 호환 유지
  - **CACHE_VERSION**: v1 → v3 (디자인 갱신을 사용자 기기에 강제 반영)
- **개발 예정으로 등록 (LOADMAP P1)**:
  - 캘린더 + "잘했어요" 도장 — 현재 N일째 카운터를 월간 그리드로 교체, 완수일에 도장
  - 카테고리 탭 — 영양제 / 헬스 보충제(단백질·크레아틴 등)로 분리
- **영향 범위**:
  - 수정: [index.html](../index.html) 935줄(이전 575줄), [sw.js](../sw.js) CACHE_VERSION
  - 문서 동기화: [README.md](../README.md), [package.md](../package.md)(Fraunces 추가), [docs/STRUCTURE.md](STRUCTURE.md)(줄 수·키·함수 갱신), [docs/LOADMAP.md](LOADMAP.md)(P1 신규 항목 + M1 ☑)
  - 커밋: `03e0196 feat: Garden Notes 디자인 업그레이드 + 한국어 정리 + LOADMAP 신규 기능`
- **알아둘 것**:
  - SW 캐시 함정으로 사용자가 변경을 못 보는 일이 있음 — 로컬 개발 중에도 CACHE_VERSION을 올려야 새 HTML이 반영. 브라우저 측에서는 DevTools → Application → Storage → Clear site data가 가장 확실
  - 카드 IDs(`card-mastic` 등)와 순서를 바꾸지 않은 덕에 기존 사용자(=본인)의 체크 상태가 보존됨. 향후 ID 기반 키로 마이그레이션할 때도 같은 IDs를 유지할 것

### 2026-05-07 — 첫 배포 (GitHub + Vercel)

- **요청**: "vercel에 올린다던지 그전에 깃헙에 올린다던지 — 다음 스탭 플랜을 짜고 순서대로 쭉 진행하자"
- **결정/실행**:
  - 정적 자산을 `assets/icons/`로 분리하고 [index.html](../index.html) / [manifest.json](../manifest.json) / [sw.js](../sw.js)의 경로 참조를 모두 갱신. SW scope 제약 때문에 `index.html` / `sw.js` / `manifest.json`은 루트 고정.
  - 배포 경로는 **GitHub → Vercel 자동 배포**(사용자 선택). CLI 직접 배포보다 이력 보존·이후 수정 효율이 우선.
  - 저장소는 **Public**(사용자 선택) — 추후 민감 데이터 추가 시 별도 데이터 파일을 `.gitignore`로 제외하기로.
  - 첫 커밋 `5ddcd03`로 문서 체계 + 코드 + 정리된 아이콘 구조를 한 번에 푸시.
- **영향 범위**:
  - 신규: `.gitignore`, `assets/icons/` (3개 PNG 이동), GitHub 저장소 `bombcodee/Modo`
  - 수정: [index.html](../index.html), [manifest.json](../manifest.json), [sw.js](../sw.js)의 아이콘 경로 / [README.md](../README.md) 라이브 링크 추가 / [docs/STRUCTURE.md](STRUCTURE.md), [docs/LOADMAP.md](LOADMAP.md) 갱신
  - 외부: 라이브 URL 발급 — **https://modo-puce.vercel.app/**
- **연결**: [LOADMAP.md](LOADMAP.md) M1 마일스톤 (iPhone 실기 검증 2개 항목만 사용자 손에 남음)
- **알아둘 것**: 다음 코드 변경 후 배포 시 [sw.js](../sw.js)의 `CACHE_VERSION`을 `'v1'` → `'v2'`로 올려야 사용자(=본인) 기기의 SW 캐시가 갱신됨.

### 2026-05-07 — 프로젝트 문서 체계 수립

- **요청**: "CLAUDE.md를 만들고, docs 폴더 안에 PRINCIPLE/MEMORY/LOADMAP/STRUCTURE 4종을 만들어 프로젝트가 짜임새 있게 연결되도록 해라. 코드는 로봇 팔다리 구조처럼 객체화하고, 모든 함수·클래스에는 왜·무엇·상관관계 주석을 달도록 PRINCIPLE에 명시할 것."
- **결정/실행**:
  - `CLAUDE.md`를 진입점으로 두고, 4개 docs 문서로 라우팅하는 구조를 채택
  - [PRINCIPLE.md](PRINCIPLE.md) §0에 "Robot Architecture" 철학을 못박아 모든 후속 코드의 기준으로 삼음
  - 현재 [index.html](../index.html)이 단일 파일에 모든 것을 담고 있어 PRINCIPLE 위반 — [LOADMAP.md](LOADMAP.md) §2 P0에 분리 작업을 우선순위로 등록
  - localStorage 키가 인덱스 기반이라 카드 순서 변경에 취약 → ID 기반으로 전환을 P0에 포함
- **영향 범위**:
  - 신규: `CLAUDE.md`, `docs/PRINCIPLE.md`, `docs/STRUCTURE.md`, `docs/LOADMAP.md`, `docs/MEMORY.md`
  - 코드 변경 없음 (문서만)
- **연결**: [LOADMAP.md](LOADMAP.md) M0 마일스톤 ☑

---

<!--
새 항목은 위쪽(가장 최근이 위)에 추가한다.
오래된 항목이 너무 많아지면 연도별 섹션으로 나눌 수 있다.
-->
