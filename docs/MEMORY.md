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
