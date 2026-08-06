import type { NativeLangData } from "./types";

const ko: NativeLangData = {
  lang: "ko",
  ogLocale: "ko_KR",
  canonicalSlug: "/ko",
  title: "무료 화상 채팅 — 낯선 사람과 대화",
  description:
    "Vidibro — 회원가입 없는 무료 랜덤 화상 채팅. K-팝, 드라마, 게임을 좋아하는 전 세계 사람들과 1대1로 대화하세요. 지금 바로 시작.",
  h1: "Vidibro — 무료 화상 채팅",
  tagline: "가입 불필요. 전 세계 낯선 사람과 지금 바로 대화하세요.",
  intro:
    "Vidibro는 계정 등록 없이 완전 무료로 이용할 수 있는 랜덤 화상 채팅 서비스입니다. 영상 통화·음성 통화·텍스트 채팅 세 가지 모드를 제공하며, 스마트폰과 PC 모두 브라우저에서 바로 이용할 수 있습니다. 전 세계 180개국 이상의 사용자와 실시간으로 연결되며, 개인 정보는 일절 저장되지 않습니다. K-팝, K-드라마, 게임, 한국 음식 등 공통 관심사로 자연스럽게 대화를 시작해보세요.",
  btnVideo: "영상 채팅 시작",
  btnVoice: "음성 채팅",
  btnText: "텍스트 채팅",
  peakHoursDisplay: "19:00 – 00:00 KST",
  langCount: "3",
  whyTitle: "왜 Vidibro를 선택하는가",
  whyBlurb: "한국 사용자들이 특히 선호하는 이유를 소개합니다.",
  whyCards: [
    {
      title: "데이터 미저장",
      body: "통화는 브라우저 간 P2P 연결로 이루어집니다. 계정이 없으므로 대화 기록이 남지 않습니다.",
      tone: "emerald",
    },
    {
      title: "모바일 최적화",
      body: "영상은 최대 600kbps로 조절되어 LTE 환경에서도 끊김 없이 통화할 수 있습니다.",
      tone: "cyan",
    },
    {
      title: "스티커 & 리액션",
      body: "공통 언어가 없어도 이모지 스티커와 전체 화면 리액션으로 감정을 즉시 표현할 수 있습니다.",
      tone: "pink",
    },
    {
      title: "읽음 확인",
      body: "텍스트 채팅에서는 상대방이 메시지를 읽었는지 읽음 표시로 확인할 수 있습니다.",
      tone: "purple",
    },
    {
      title: "다국어 사용자",
      body: "한국어, 영어, 일본어, 중국어 등 다양한 언어의 사용자가 전 세계에서 참여하고 있습니다.",
      tone: "amber",
    },
    {
      title: "한 번의 탭으로 다음으로",
      body: "다음 버튼 하나로 즉시 다른 상대방으로 전환됩니다. 설명 없이 언제든 새로운 만남으로.",
      tone: "emerald",
    },
  ],
  localTitle: "한국 사용자를 위한 로컬 정보",
  peakNote:
    "퇴근 및 하교 후 저녁 시간대가 가장 활발합니다. 주말 심야에는 대기 시간이 더욱 짧아집니다.",
  phrases: [
    { native: "안녕하세요", romanized: "Annyeonghaseyo", meaning: "Hello" },
    { native: "반갑습니다", romanized: "Bangapseumnida", meaning: "Nice to meet you" },
    { native: "감사합니다", romanized: "Gamsahamnida", meaning: "Thank you" },
    { native: "또 이야기해요", romanized: "Tto iyagihaeyo", meaning: "Let's talk again" },
  ],
  starters: [
    "좋아하는 K-팝 아티스트는 누구인가요?",
    "요즘 어떤 드라마를 보고 있나요?",
    "한국 음식 중 가장 좋아하는 것은?",
    "PC방 게임을 즐기나요?",
    "한국 여행을 해본 적 있나요?",
  ],
  connectivity:
    "한국은 세계 최고 수준의 5G 인프라를 보유하고 있습니다. 전국 대부분 지역에서 초고속 인터넷이 지원되어 화상 통화 품질이 매우 안정적입니다.",
  famousTitle: "한국 문화로 대화를 시작하세요",
  famousFacts: [
    {
      title: "K-팝 & K-드라마",
      body: "BTS, BLACKPINK, 뉴진스 등 전 세계를 사로잡은 K-팝과 오징어 게임, 이상한 변호사 우영우 같은 K-드라마는 어디서든 통하는 대화 주제입니다.",
      tone: "purple",
    },
    {
      title: "PC방 & 게이밍 문화",
      body: "한국은 PC방 문화와 e스포츠의 발상지입니다. 리그 오브 레전드, 배틀그라운드 등 게임 이야기로 전 세계 게이머와 쉽게 대화할 수 있습니다.",
      tone: "cyan",
    },
    {
      title: "한국 음식 (한식)",
      body: "삼겹살, 김치, 떡볶이, 비빔밥 — 전 세계적으로 인기 있는 한식은 언제나 흥미로운 대화 주제입니다. K-푸드 열풍은 지금도 계속되고 있습니다.",
      tone: "amber",
    },
    {
      title: "K-뷰티 & 패션",
      body: "한국의 스킨케어 루틴과 K-뷰티 트렌드는 전 세계 뷰티 산업에 영향을 주고 있습니다. 패션과 뷰티 이야기로 자연스럽게 대화를 이어갈 수 있습니다.",
      tone: "pink",
    },
  ],
  howTitle: "사용 방법 4단계",
  steps: [
    { step: 1, title: "모드 선택", body: "영상·음성·텍스트 세 가지 모드 중 하나를 선택하세요. 카메라 없이도 음성이나 텍스트로 이용 가능합니다." },
    { step: 2, title: "접근 허용", body: "영상·음성 모드는 카메라·마이크 허용이 필요합니다. 텍스트 채팅은 별도 허용 불필요." },
    { step: 3, title: "매칭", body: "짧은 카운트다운 후 랜덤으로 상대방이 결정됩니다. 피크 시간대에는 수초 내 연결됩니다." },
    { step: 4, title: "언제든 다음으로", body: "다음 버튼 하나로 즉시 다른 상대방으로 전환됩니다. 설명 없이 언제든 새로운 만남으로 이동하세요." },
  ],
  whatIsTitle: "랜덤 화상 채팅이란?",
  whatIsBody:
    "랜덤 화상 채팅은 인터넷에서 낯선 사람과 실시간으로 영상 통화하는 서비스입니다. Vidibro는 1대1 매칭 방식을 채택하여 전 세계 사용자와 우연한 만남을 제공합니다. 과거 Omegle로 알려진 이 방식의 서비스는 어학 연습, 이문화 교류, 심심풀이에 많이 활용됩니다. Vidibro는 회원가입 없이 개인 정보 입력도 전혀 필요하지 않습니다.",
  cloneTitle: "다른 서비스와의 차이점",
  cloneBlurb: "많은 Omegle 대체 서비스가 있지만, 스마트폰 사용성에서 큰 차이가 있습니다.",
  cloneRows: [
    { feature: "계정 등록", us: "불필요", them: "필요한 경우가 많음" },
    { feature: "영상·음성·텍스트 모두 지원", us: true, them: "주로 영상만" },
    { feature: "P2P 연결", us: true, them: false },
    { feature: "모바일 데이터 최적화", us: true, them: false },
    { feature: "대화 기록 저장", us: "없음", them: "서비스마다 다름" },
    { feature: "비용", us: "무료", them: "광고 있거나 유료 플랜" },
  ],
  safetyTitle: "안전하게 사용하는 방법",
  safetyNote:
    "P2P 연결이므로 영상은 서버에 저장되지 않습니다. 하지만 상대방을 선택할 수 없으므로 기본 규칙을 지키는 것이 중요합니다.",
  safetyBody:
    "실명, 주소, 직장, 금융 정보는 절대 알려주지 마세요. 불편한 상대방은 즉시 신고·차단할 수 있습니다. 신고 버튼은 통화 중 언제든 사용 가능하며, 누르면 즉시 대화가 종료되고 다음 매칭으로 이동됩니다.",
  safetyLinkText: "커뮤니티 가이드라인 읽기 →",
  faqTitle: "자주 묻는 질문",
  faqs: [
    { question: "Vidibro는 무료인가요?", answer: "네, 완전히 무료입니다. 계정 생성도 필요 없고 신용카드 등록도 전혀 필요하지 않습니다." },
    { question: "회원가입이 필요한가요?", answer: "필요하지 않습니다. 사이트에 접속해 모드를 선택하면 바로 시작할 수 있습니다." },
    { question: "스마트폰에서 사용할 수 있나요?", answer: "네, iOS와 Android 모두 브라우저에서 이용 가능합니다. 앱 설치도 필요 없습니다." },
    { question: "한국어 사용자와 연결될 수 있나요?", answer: "언어 필터는 없지만 저녁 피크 시간대에는 한국어 사용자와 연결될 가능성이 높습니다." },
    { question: "대화는 녹음·저장되나요?", answer: "아니요. P2P 연결이므로 서버에 데이터가 전송되지 않으며 대화 기록도 일절 저장되지 않습니다." },
  ],
  ctaTitle: "지금 바로 대화를 시작하세요",
  ctaBody: "가입 불필요, 기록 없음. 아직 만나지 못한 누군가와의 대화가 시작됩니다.",
};

export default ko;
