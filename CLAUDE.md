# Modo — 개발자/Claude 진입점

> 이 문서는 코드 작업자(사용자 본인 + Claude)를 위한 **프로젝트 진입점**이다.
> 앱 자체에 대한 사용자 관점 설명은 [README.md](README.md)를 참조한다.

---

## 한 줄 요약

매일 챙겨먹는 영양제를 시간대별로 체크하는 PWA(Progressive Web App). 단일 사용자, 클라이언트 사이드 only.

자세한 기능 설명·등록된 영양제·설치 방법 → [README.md](README.md)

---

## 문서 맵

이 프로젝트는 다음 문서들로 일관되게 관리된다. 작업 종류에 따라 진입 문서가 다르다.

### 사용자 관점
- **[README.md](README.md)** — 앱 소개, 기능, 사용 방법. 사용자/외부 방문자가 가장 먼저 본다.

### 개발 관점 (Claude가 사용)

| 문서 | 언제 보는가 | 무엇이 들어 있나 |
|------|-------------|------------------|
| **[docs/PRINCIPLE.md](docs/PRINCIPLE.md)** | 코드를 한 줄이라도 쓰기 전 | 코드 규칙 — 객체화/모듈화 원칙(로봇 구조), 주석 규칙(왜·무엇·상관관계), 명명 규칙, 안티패턴 |
| **[docs/STRUCTURE.md](docs/STRUCTURE.md)** | 어디에 무엇을 추가할지 막힐 때, 영향 범위 확인할 때 | 폴더·파일 트리, 각 파일의 책임, 파일 간 의존·호출 관계 |
| **[docs/LOADMAP.md](docs/LOADMAP.md)** | 새 기능 시작 전 | 개발 설계(PRD), 진행 중·완료 항목, 토의 사항. 완료 시 ☑·~~취소선~~ |
| **[docs/MEMORY.md](docs/MEMORY.md)** | 이전 결정의 맥락이 필요할 때 | 사용자가 내린 명령들의 히스토리. 커밋 시점 또는 명시적 요청 시 기록 |
| **[package.md](package.md)** | 사용된 기술·도구가 궁금할 때, 새 의존성 추가 검토 시 | 사용 중인 패키지·웹 API·외부 리소스, 도입하지 않은 것의 이유, 향후 도입 후보 |

---

## 작업 흐름 (Claude가 따라야 할 순서)

1. 사용자의 요청을 받으면 **[docs/LOADMAP.md](docs/LOADMAP.md)** 에서 관련 항목·우선순위를 먼저 확인한다.
2. 코드를 수정하기 전 **[docs/STRUCTURE.md](docs/STRUCTURE.md)** 에서 영향 범위(어떤 파일들이 엮여 있는지)를 파악한다.
3. 코드를 작성·수정할 때는 **[docs/PRINCIPLE.md](docs/PRINCIPLE.md)** 의 규칙을 위반하지 않는지 매번 점검한다.
4. 새 패키지·라이브러리·웹 API를 도입할 때는 **[package.md](package.md)** 에 즉시 반영한다.
5. 새 파일·폴더·모듈 관계를 추가했다면 **[docs/STRUCTURE.md](docs/STRUCTURE.md)** 를 즉시 갱신한다.
6. LOADMAP의 항목이 완료되면 체크박스를 ☑로 바꾸고 ~~취소선~~을 적용한다.
7. 의미 있는 작업 단위(커밋 단위) 또는 사용자의 명시적 요청 시 **[docs/MEMORY.md](docs/MEMORY.md)** 에 결정·맥락을 기록한다.

---

## 파일 구조 (한눈에)

```
Modo/
├─ README.md           # 사용자용 소개
├─ CLAUDE.md           # ← 이 파일 (개발자/Claude 진입점)
├─ package.md          # 사용 패키지·도구·기술 스택
├─ index.html          # 앱 본체 (현재 단일 파일 — 분리 예정)
├─ manifest.json       # PWA 매니페스트
├─ sw.js               # Service Worker
├─ icon-192.png / icon-512.png / apple-touch-icon.png
└─ docs/
   ├─ PRINCIPLE.md     # 코드 규칙
   ├─ STRUCTURE.md     # 폴더·파일 구조와 상관관계
   ├─ LOADMAP.md       # 개발 로드맵 (PRD)
   └─ MEMORY.md        # 세션 히스토리
```

각 파일의 책임·상관관계는 [docs/STRUCTURE.md](docs/STRUCTURE.md), 사용 도구는 [package.md](package.md) 참조.
