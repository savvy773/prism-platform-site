# PRISM 소개 사이트 구조

이 저장소는 공개 소개 페이지와 독립 영상 제작 앱으로 구성됩니다. WEB, ERP, Auth 본체의 코드나 실제 업무 데이터는 포함하지 않습니다.

```mermaid
flowchart LR
  subgraph Page[GitHub Pages 정적 사이트]
    HTML[index.html]
    CSS[styles.css]
    Asset[assets 예시 이미지]
    Media[media 게시용 MP4]
  end
  subgraph Video[apps/video 영상 제작 앱]
    Script[projects/영상 ID/script.ts]
    Audio[projects/영상 ID/audio]
    Shared[src 공통 장면·마스코트·UI]
    Render[Remotion 컴포지션]
    Output[projects/영상 ID/output]
  end
  Script --> Render
  Shared --> Render
  Audio --> Render
  Render --> Output
  Render --> Media
  Media --> HTML
  Asset --> HTML
  CSS --> HTML
```

## 기술 스택

```mermaid
flowchart TB
  Content[장면 데이터와 내레이션] --> TS[TypeScript 7]
  TS --> React[React 19]
  React --> Remotion[Remotion 4]
  Remotion --> MP4[H.264 MP4]
  TTS[Edge TTS 음성 생성] --> Audio[장면별 MP3]
  Audio --> Remotion
  Biome[Biome 2] -. 코드 검사 .-> TS
  Pnpm[pnpm 12] -. 패키지 관리 .-> React
  MP4 --> Web[GitHub Pages]
  MP4 --> YouTube[YouTube 업로드용 파일]
```

`src/data/registry.ts`가 영상별 대본을 컴포지션으로 등록합니다. `src/compositions/ScriptVideo.tsx`는 대본의 장면 순서와 길이를 읽어 공통 렌더러를 실행합니다. 새 영상은 프로젝트 폴더와 레지스트리 항목을 추가하면 됩니다.

현재 랜딩 영상은 1920×1080, 30fps, 52초입니다. 새 YouTube 영상은 약 2분을 출발점으로 하고 대본에 맞춰 앞뒤 장면을 늘릴 수 있습니다. 총 프레임 수는 장면 길이의 합으로 계산됩니다.
