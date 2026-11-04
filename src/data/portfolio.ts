export const profile = {
  name: "Tarunya Kesharwani",
  email: "tarunyaprogrammer@gmail.com",
  github: "https://github.com/TarunyaProgrammer",
  linkedin: "https://www.linkedin.com/in/tarunyakesharwani/",
  resume: "https://www.tarunya.me/Resume.pdf",
  introduction:
    "A computer science & AI student, building at the intersection of engineering, products, and ideas that reach people.",
  education: "B.Tech · Computer Science & Artificial Intelligence",
  school: "Newton School of Technology · 2025–2029",
};
export const chapters = [
  {
    id: "overview",
    name: "The threshold",
    number: "00",
    progress: 0,
    title: "Hi, I’m Tarunya Kesharwani.",
    description:
      "Scroll to explore the ideas, systems, and people that shape what I build.",
  },
  {
    id: "origin",
    name: "Origin",
    number: "01",
    progress: 1 / 6,
    title: "Curiosity was the first tool.",
    description:
      "I study computer science and artificial intelligence at Newton School of Technology, and learn by turning questions into working systems.",
  },
  {
    id: "workshop",
    name: "The Workshop",
    number: "02",
    progress: 2 / 6,
    title: "Ideas become useful when they work.",
    description:
      "A few projects, each built around a concrete engineering problem.",
  },
  {
    id: "skills",
    name: "The Constellation",
    number: "03",
    progress: 3 / 6,
    title: "Different tools. Connected systems.",
    description:
      "A map of the languages, platforms, and practices I have worked with while building products and contributing to open source.",
  },
  {
    id: "proof",
    name: "The Proof",
    number: "04",
    progress: 4 / 6,
    title: "Work speaks louder than credentials.",
    description:
      "Open-source work means learning in public: making changes, explaining decisions, and helping other contributors find their footing.",
  },
  {
    id: "signal",
    name: "Signal Lab",
    number: "05",
    progress: 5 / 6,
    title: "What if an idea began as a voice note?",
    description:
      "A proposed campus experiment: help student builders turn a spoken idea into a project worth sharing, then learn from what happens next.",
  },
  {
    id: "horizon",
    name: "The Horizon",
    number: "06",
    progress: 1,
    title: "Every world needs its next chapter.",
    description:
      "Build something meaningful, put it in people’s hands, and learn from what they do.",
  },
] as const;
export const skillGroups = [
  { name: "Product engineering", items: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Zustand"] },
  { name: "Services & data", items: ["Node.js", "NestJS", "Hono", "PostgreSQL", "Supabase", "MongoDB", "Redis", "IndexedDB"] },
  { name: "AI & workflows", items: ["Gemini", "OpenAI API", "LangChain", "RAG", "Structured outputs"] },
  { name: "Delivery", items: ["Cloudflare Workers", "Docker", "GitHub Actions", "Vercel", "WebSockets"] },
] as const;
export type Project = {
  id: string;
  name: string;
  category: string;
  summary: string;
  problem: string;
  architecture: string;
  learning: string;
  stack: string[];
  url: string;
  color: string;
  symbol: string;
};
export const projects: Project[] = [
  {
    id: "webiu",
    name: "WebiU / GitHubAnalyzer",
    category: "OPEN-SOURCE INFRASTRUCTURE",
    summary: "Making repository activity useful to the people maintaining it.",
    problem:
      "Maintainers need a clear view of repository events without repeatedly asking the GitHub API for the same data.",
    architecture:
      "An edge telemetry layer with Hono on Cloudflare Workers, alongside NestJS and PostgreSQL services. GitHub webhooks provide event-driven updates; caching reduces redundant upstream requests.",
    learning:
      "The design question: where should freshness matter, and where can cached data do the work? This project puts that trade-off at the center.",
    stack: ["Hono", "Cloudflare Workers", "NestJS", "PostgreSQL"],
    url: "https://github.com/TarunyaProgrammer/GithubAnalyzer-PreGsocTask",
    color: "#647b65",
    symbol: "telemetry",
  },
  {
    id: "cabin",
    name: "Cabin",
    category: "DEVELOPER EXPERIENCE",
    summary:
      "A maintainer’s workspace, with the repository context kept close.",
    problem:
      "Reviewing contributions often means jumping between repositories, local terminals, CI results, and conversations.",
    architecture:
      "An Electron workspace combines local Git checkouts, multi-repository context, DCO and CI checks, and AI-assisted reviews.",
    learning:
      "The design question: how can an assistant surface useful context while keeping the maintainer in charge of the final review?",
    stack: ["Electron", "Git", "CI / DCO", "AI-assisted review"],
    url: "https://github.com/TarunyaProgrammer/Cabin-MaintainerOS",
    color: "#c17446",
    symbol: "workspace",
  },
  {
    id: "echo",
    name: "Echo",
    category: "REAL-TIME COMMUNICATION",
    summary: "Conversations that move at the speed of people.",
    problem:
      "A messaging interface needs to handle live connections and authentication without making the conversation feel like a network protocol.",
    architecture:
      "A full-stack messaging application with Socket.IO bidirectional channels, JWT authentication, and offline synchronization.",
    learning:
      "The design question: how should the interface communicate connection state and recovery when the network is unreliable?",
    stack: ["React", "Node.js", "Socket.IO", "JWT"],
    url: "https://github.com/TarunyaProgrammer/Echo-FullstackDeployed-ChatNow",
    color: "#6e939c",
    symbol: "messages",
  },
  {
    id: "streakly",
    name: "Streakly",
    category: "OFFLINE-FIRST PRODUCT",
    summary: "Build a habit. Even when the connection drops.",
    problem:
      "Everyday habit tracking should stay available without a reliable internet connection.",
    architecture:
      "A progressive web app using IndexedDB for local data and service workers for offline availability.",
    learning:
      "The design question: how can local storage and synchronization protect a user’s sense of continuity?",
    stack: ["PWA", "IndexedDB", "Service workers"],
    url: "https://github.com/TarunyaProgrammer/Streakly-Habit-Discipline-System",
    color: "#a58e63",
    symbol: "habits",
  },
];
export const achievements = [
  {
    title: "Google Summer of Code ’26",
    label: "C2SI · WebiU",
    description:
      "Selected developer working on event-driven services, GitHub webhooks, and distributed caching for open-source infrastructure.",
    url: "https://github.com/TarunyaProgrammer/Webiu",
    link: "Explore WebiU",
  },
  {
    title: "Learning goes both ways.",
    label: "GSSoC & SSoC · Mentorship",
    description:
      "Helping contributors navigate Git workflows, code reviews, and architectural decisions. Explaining a system is a useful test of understanding it.",
    url: profile.github,
    link: "Explore my GitHub",
  },
  {
    title: "Building the foundations.",
    label: "Newton School of Technology",
    description:
      "B.Tech in Computer Science & Artificial Intelligence, 2025–2029. Connecting the fundamentals with the messier reality of building products.",
    url: profile.resume,
    link: "View résumé",
  },
];
export const campaignStages = [
  {
    name: "Find the builders",
    label: "CAMPUS → COMMUNITY",
    title: "Start with a small, specific community.",
    body: "Recruit a pilot cohort through college coding clubs and student creators. Choose people with a real problem they want to solve, not just a large follower count.",
    output:
      "A short build brief, consent to share, and a baseline of each creator’s current workflow.",
  },
  {
    name: "Build out loud",
    label: "VOICE → WORKING IDEA",
    title: "Make the process the story.",
    body: "Give each builder a small product challenge. Use Wispr Flow for ideation, prompts, documentation, or feedback. Record the moments where speaking helps, and the moments where it doesn’t.",
    output:
      "A working prototype and one honest before-and-after story. Disclose the tools used.",
  },
  {
    name: "Share the signal",
    label: "STORY → DISTRIBUTION",
    title: "Show the transformation, not a feature list.",
    body: "Publish short creator-led videos: a spoken idea, the building process, and the result. Distribute through campus communities and creator channels with a clear invitation to try Flow.",
    output:
      "Creator-specific links with consent-aware campaign attribution. One landing page with one next step.",
  },
  {
    name: "Measure the habit",
    label: "FIRST TRY → REPEAT USE",
    title: "Views are a beginning. Retention is the test.",
    body: "Follow the journey from video engagement to sign-up, first successful dictation, activation, and seven-day retention. Interview people who stop. Compare cohorts before expanding.",
    output:
      "A decision: repeat, change the audience or message, or stop. No campaign outcomes are assumed.",
  },
];
export const metrics = [
  "Reach",
  "Video engagement",
  "Landing-page conversion",
  "Sign-ups",
  "First dictation",
  "Activation",
  "7-day retention",
];
