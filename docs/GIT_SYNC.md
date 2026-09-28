# 집 ↔ 회사 Git 동기화

같은 저장소(`git@github.com:savvy773/prism-platform-site.git`, `main` 브랜치)를 집 PC와 회사 PC에서 번갈아 작업할 때의 순서입니다. 원칙은 하나입니다. **작업 시작 전에 `pull`, 작업 끝나면 `push`.**

## Git에 없는 것 (PC마다 따로 준비)

| 항목 | 위치 | 준비 방법 |
| --- | --- | --- |
| Gemini API 키 | `apps/video/.env` | `.env.example`을 복사해 키 입력. 채팅·메일로 보내지 말고 직접 입력 |
| YouTube 인증 | `~/.config/prism-video/` | 업로드할 PC에서 `just video auth` 한 번 |
| 패키지 | `apps/video/node_modules/` | `pnpm install` |
| 렌더 결과 | `apps/video/projects/*/output/` | `just video render <ID>`로 다시 만듦 (음성은 Git에 있어 재과금 없음) |

## 처음 한 번 (새 PC, 예: 회사)

```bash
# 필요 도구: git, node, pnpm, just, uv (WSL이면 리눅스 쪽에 설치)
git clone git@github.com:savvy773/prism-platform-site.git prism-page
cd prism-page/apps/video
pnpm install
cp .env.example .env        # 편집기로 열어 GEMINI_API_KEY 입력
cd ../..
just video check            # 타입·린트·컴포지션 확인
```

SSH 키가 없으면 `ssh-keygen -t ed25519` 후 공개 키(`~/.ssh/id_ed25519.pub`)를 GitHub → Settings → SSH keys에 등록합니다.

## 집에서 작업을 마칠 때 (→ 회사로 넘기기)

```bash
cd ~/code/prism-page
git status                  # 무엇이 바뀌었는지 확인 (.env가 보이면 안 됨)
git add -A
git commit -m "작업 내용 요약"
git push
```

`just push`를 쓰면 add·commit·push를 한 번에 하고 커밋 메시지를 자동으로 붙입니다.

## 회사에서 작업을 시작할 때 (← 집에서 받기)

```bash
cd ~/code/prism-page
git pull --rebase
cd apps/video && pnpm install && cd ../..   # 패키지가 바뀌었을 때만 필요, 해도 무방
just video list                             # 영상 목록과 렌더 상태 확인
just video render <ID>                      # 영상 파일이 필요하면 다시 렌더
```

## 반대 방향 (회사 → 집)

똑같습니다. 회사에서 끝낼 때 `git add -A && git commit -m "..." && git push`, 집에서 시작할 때 `git pull --rebase`.

## 충돌이 났을 때

```bash
git pull --rebase           # "CONFLICT" 메시지가 나오면
git status                  # 충돌 파일 확인 후 편집기로 <<<<<<< 부분 정리
git add <정리한 파일>
git rebase --continue
git push
```

되돌리고 싶으면 `git rebase --abort`로 pull 전 상태로 돌아갑니다.

## 자주 하는 실수

- 시작 전에 `pull`을 잊고 작업함 → 끝날 때 `git pull --rebase` 후 `push`하면 대부분 자동으로 합쳐집니다.
- `.env`를 커밋하려 함 → `.gitignore`에 있어서 `git add -A`로는 올라가지 않습니다. `git status`에 보이면 멈추고 확인하세요.
- 양쪽에서 같은 대본(`script.ts`)을 동시에 고침 → 한쪽에서 먼저 `push`하고 다른 쪽은 `pull` 후 작업하세요.
- `main`에 `push`하면 GitHub Pages 사이트가 바로 갱신됩니다. 공개되면 안 되는 영상은 `media/`에 넣지 마세요.
