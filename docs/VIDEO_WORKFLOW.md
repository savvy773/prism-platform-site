# 영상 작업 설명서

대본 파일 하나를 넣으면 같은 스타일·같은 품질의 영상이 나오는 팩토리입니다.

## 폴더 구조

```text
apps/video/projects/<영상 ID>/
  script.ts          유일하게 직접 쓰는 파일 (Git 관리)
  assets/            스크린샷 등 영상 전용 이미지 (Git 관리)
  audio/             장면별 MP3 + manifest.json (생성물이지만 Git 관리: 다른 PC에서 다시 과금하지 않도록)
  output/            <ID>.mp4, <ID>.srt, description.txt, thumbnail.png, youtube.json (생성물, Git 제외)
```

폴더가 곧 영상입니다. 레지스트리 등록이 필요 없고, 폴더를 지우면 흔적 없이 사라집니다. 집·회사 간 작업은 [Git 동기화 안내](GIT_SYNC.md)를 보세요.

## 명령

루트에서 `just video <명령> <ID…|--all>`:

| 명령 | 하는 일 |
| --- | --- |
| `new <id>` | 템플릿으로 `script.ts` 생성 |
| `tts <id>` | 내레이션 생성. 바뀐 장면만 다시 생성(과금 절약), `--force`로 전체 |
| `make <id>` | TTS → MP4·자막·챕터 설명·썸네일 렌더 |
| `preview <id> --frames=0-299` | 절반 해상도 짧은 렌더 |
| `still <id> --frame=N` | PNG 한 장 |
| `upload <id>` | YouTube 업로드(기본 비공개) + 자막 + 썸네일 |
| `publish <id>` | make + upload |
| `site <id>` | 사이트 `media/`로 MP4·포스터 복사 |
| `clean <id>` / `remove <id>` | 생성물만 삭제 / 폴더 통째로 삭제 |
| `list` | 영상 목록과 렌더·업로드 상태 |

여러 개를 한 번에: `just video make a b c` 또는 `just video make --all`. 하나가 실패해도 나머지는 계속합니다.

## 대본 쓰기

`templates/script.ts` 머리 주석에 장면 종류와 아이콘 목록이 있습니다.

- 장면: `title`, `outro`, `character`(기본 또는 `chaos`), `dashboard`(`workspace`·`erp`·`report`), `diagram`(`flow`·`hub`·`cards`·`compare`·`checklist`·`timeline`)
- `items`: `"아이콘:라벨"`. 타임라인은 `"09:00 라벨"`, 비교는 `pairs`
- `durationSec`는 최소 길이입니다. 실제 길이는 측정한 음성 길이 + 0.9초로 자동 맞춰집니다.
- `chapter`를 붙인 장면에서 YouTube 챕터가 시작됩니다(3개 이상일 때 설명란에 자동 기록).
- 화면 자막은 내레이션을 문장·쉼표 단위로 나눠 음성 길이에 맞춰 표시하고, 같은 타이밍으로 `.srt`를 만듭니다.

긴 영상(10~30분)도 한 대본으로 됩니다. 장면이 많아지면 같은 폴더에 `part-1.ts` 등으로 장면 배열을 나눠 `script.ts`에서 합쳐도 됩니다(이때 import 경로에 `.ts` 확장자를 붙이세요).

## TTS

- 기본: Gemini TTS `gemini-3.8-flash-lite-tts`. 할당량이 떨어지면 `gemini-3.8-flash-tts`로 자동 전환합니다(`fallbackModels`로 변경). `style`에 말투를 한국어로 지시합니다.
- `GEMINI_API_KEY`가 없거나 크레딧이 떨어지면 멈춥니다. 목소리가 섞이지 않도록 Edge TTS(`ko-KR-SunHiNeural`)는 `--provider=edge`를 붙였을 때만 씁니다.
- `lexicon`으로 읽는 법을 고정합니다. 예: `{ ERP: "이알피" }`
- Gemini 무료 티어는 분당 요청 수가 적어서 순차 생성하고, 429 응답이면 기다렸다가 다시 시도합니다. 장면마다 결과를 바로 저장하므로 중간에 끊겨도 이미 만든 장면은 다시 과금되지 않습니다.

## 효과음과 스크린샷

- 효과음(휙·뽁·딩·짜잔·뿅)은 `node scripts/make-sfx.mjs`가 코드로 합성합니다. 샘플 파일이 아니라서 라이선스 걱정이 없습니다. 장면 전환, 스티커 등장, 체크, 제목에서 자동으로 재생됩니다.
- 실제 화면은 `visualVariant: "screenshot"`과 `image: "assets/파일.png"`로 넣습니다. 파일은 영상 폴더의 `assets/`에 두고, 예시 데이터만 보이는 화면만 씁니다. 다크 화면도 반투명 프레임과 가장자리 페이드로 밝은 배경에 어울리게 표시되고, 세로로 긴 화면은 천천히 스크롤됩니다.

## 비밀 정보

- `apps/video/.env`: `GEMINI_API_KEY=...` (Git 제외, 형식은 `.env.example`)
- YouTube 인증 파일은 저장소 밖 `~/.config/prism-video/`에 둡니다.
- `client_secret.json`: Google Cloud에서 YouTube Data API v3를 켜고 만든 OAuth 클라이언트(데스크톱 앱) JSON
- `youtube-token.json`: `just video auth` 한 번으로 생성

## 형식

1920×1080, 30fps H.264. 벡터 그래픽이라 해상도를 올려도 깨지지 않지만, YouTube는 1080p 이상에 더 높은 비트레이트를 주므로 720p보다 선명합니다. 움직임이 완만한 일러스트라 60fps는 렌더 시간과 용량만 두 배가 됩니다.

## 앞으로의 방향

지금은 **사내 홍보 영상(YouTube)** 제작에 집중하고, 아래는 차차 진행합니다.

- **폴더 재구성**: 대본(시나리오)과 그 결과 영상이 한 폴더에 모이는 지금 원칙을 유지한 채, `projects/`를 `scenarios/` 같은 이름과 분류(예: 사내 홍보, 기능 소개, 교육)로 다시 짭니다. 이 저장소에서 떼어 내 독립된 영상 팩토리 저장소로 옮기는 것도 검토합니다.
- **하네스 개선**: 대본만 넣으면 같은 품질의 영상이 계속 나오도록 레이아웃, 효과음, 검사(스틸 자동 점검 등)를 공용 키트에 쌓아 갑니다. `.claude/skills/make-video`가 그 작업 순서를 담고 있습니다.
- **메인 캐릭터**: 지금은 범용 캐릭터(프리즘 가이드와 김 대리)를 씁니다. 대표 캐릭터를 정하면 `src/illustrated/`의 캐릭터만 바꾸면 되고, 모든 영상에 일관되게 적용됩니다.
- **배경 음악**: 효과음처럼 코드로 만들거나 라이선스가 확실한 음원을 공용 폴더에 두는 방식을 검토합니다.
