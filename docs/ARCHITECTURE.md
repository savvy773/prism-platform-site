# PRISM 소개 사이트 구조

공개 소개 페이지와 대본 기반 영상 팩토리로 구성됩니다. WEB, ERP, Auth 본체의 코드나 실제 업무 데이터는 포함하지 않습니다.

```mermaid
flowchart LR
  subgraph Page[GitHub Pages 정적 사이트]
    HTML[index.html] --> Media[media 게시용 MP4]
  end
  subgraph Factory[apps/video 영상 팩토리]
    Script[projects/ID/script.ts] --> CLI[scripts/video.mjs]
    CLI -->|Gemini TTS| Audio[audio/*.mp3 + manifest.json]
    Audio --> Render[Remotion 컴포지션]
    Script --> Render
    Kit[src/illustrated 2D 키트] --> Render
    Render --> Output[output/ MP4·SRT·설명·썸네일]
  end
  Output -->|just video upload| YouTube
  Output -->|just video site| Media
```

- `src/data/registry.ts`: `projects/*/script.ts`를 자동으로 찾아 컴포지션으로 등록
- `src/Root.tsx`: `calculateMetadata`로 `manifest.json`의 음성 길이를 읽어 장면 길이를 정함
- `src/data/captions.ts`: 화면 자막과 `.srt`가 같은 타이밍을 쓰도록 공유
- `src/illustrated/`: 테마, 폰트(Jua·Gowun Dodum), 아이콘, 캐릭터(프리즘 가이드·김 대리), 스티커, 효과음(`sfx/`, `scripts/make-sfx.mjs`로 생성), 장면 템플릿(스크린샷 포함)

스택: TypeScript 7, React 19, Remotion 4, Biome 2, pnpm 12, Gemini TTS(선택: Edge TTS), YouTube Data API v3.
