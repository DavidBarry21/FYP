import { useState, useEffect, ReactNode } from "react";

/* ─── GLOBAL STYLES ───────────────────────────────────────────────── */
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #07090f; --surface: #0e1220; --glass: rgba(255,255,255,0.04);
    --border: rgba(255,255,255,0.08); --accent: #00e5ff; --danger: #ff3b5c;
    --success: #00e096; --warning: #ffb830; --text: #e8eaf0; --muted: #7a8099;
    --radius: 14px; --font-head: 'Syne', sans-serif; --font-body: 'DM Sans', sans-serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  .fade-up  { animation: fadeUp .45s ease both; }
  .fade-up-d1 { animation: fadeUp .45s .1s ease both; }
  .fade-up-d2 { animation: fadeUp .45s .2s ease both; }
  .fade-up-d3 { animation: fadeUp .45s .3s ease both; }
  .fade-up-d4 { animation: fadeUp .45s .4s ease both; }
`;

/* ─── TYPES ──────────────────────────────────────────────────────── */
type Page = "home"|"about"|"learn"|"quiz"|"risk"|"scenario"|"research"|"what"|"why"|"protect";

interface BadgeProps  { children: ReactNode; color?: string; }
interface CardProps   { children: ReactNode; style?: React.CSSProperties; onClick?: () => void; className?: string; }
interface BtnProps    { children: ReactNode; onClick?: () => void; variant?: string; style?: React.CSSProperties; ariaLabel?: string; disabled?: boolean; }
interface SectionProps{ children: ReactNode; style?: React.CSSProperties; }
interface HeadingProps{ badge?: string; title: string; sub?: string; }
interface NavProps    { setPage: (p: Page) => void; }

interface QuizImage  { src: string; label: string; isReal: boolean; }
interface Question {
  type: "single"|"multi"|"video";
  q: string; hint: string; exp: string;
  img?: string; a?: string;
  correct?: number; images?: QuizImage[];
  video?: string;
}
interface LogEntry   { correct: boolean; conf: number; }
interface ScenarioOption { text: string; correct: boolean; feedback: string; }
interface ScenarioItem {
  title: string; icon: string; badge: string; badgeColor: string;
  setup: string; question: string; options: ScenarioOption[];
}
interface ResearchItem {
  year: string; title: string; authors: string; tag: string; color: string; summary: string; relevance: string;
}

/* ─── SHARED COMPONENTS ──────────────────────────────────────────── */
function Badge({ children, color = "var(--accent)" }: BadgeProps) {
  return (
    <span style={{
      background: color + "22", color, border: `1px solid ${color}44`,
      borderRadius: "99px", padding: "2px 10px", fontSize: ".72rem",
      fontFamily: "var(--font-head)", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase" as const,
    }}>{children}</span>
  );
}

function Card({ children, style = {}, onClick, className = "" }: CardProps) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className={className}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov && onClick ? "rgba(255,255,255,0.07)" : "var(--glass)",
        border: `1px solid ${hov && onClick ? "rgba(255,255,255,0.16)" : "var(--border)"}`,
        borderRadius: "var(--radius)", padding: "24px",
        cursor: onClick ? "pointer" : "default",
        transition: "all .22s ease",
        transform: hov && onClick ? "translateY(-3px)" : "none",
        ...style,
      }}
    >{children}</div>
  );
}

function Btn({ children, onClick, variant = "primary", style = {}, ariaLabel, disabled = false }: BtnProps) {
  const [hov, setHov] = useState(false);
  const colors: Record<string, { bg: string; color: string; border?: string }> = {
    primary: { bg: "var(--accent)", color: "#07090f" },
    danger:  { bg: "var(--danger)", color: "#fff" },
    ghost:   { bg: hov ? "rgba(255,255,255,0.08)" : "transparent", color: "var(--text)", border: "1px solid var(--border)" },
    success: { bg: "var(--success)", color: "#07090f" },
  };
  const c = colors[variant] ?? colors.primary;
  return (
    <button
      aria-label={ariaLabel ?? (typeof children === "string" ? children : undefined)}
      disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: c.bg, color: c.color, border: c.border ?? "none",
        borderRadius: "var(--radius)", padding: "10px 22px",
        fontFamily: "var(--font-head)", fontWeight: 700, fontSize: ".88rem",
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
        transition: "all .18s ease", transform: hov && !disabled ? "translateY(-1px)" : "none",
        letterSpacing: ".04em", ...style,
      }}
    >{children}</button>
  );
}

function SectionWrap({ children, style = {} }: SectionProps) {
  return (
    <section style={{ maxWidth: "900px", margin: "0 auto", padding: "20px 16px 60px", ...style }}>
      {children}
    </section>
  );
}

function PageHeading({ badge, title, sub }: HeadingProps) {
  return (
    <div style={{ marginBottom: "40px" }} className="fade-up">
      {badge && <div style={{ marginBottom: "10px" }}><Badge>{badge}</Badge></div>}
      <h2 style={{ fontFamily: "var(--font-head)", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: sub ? "12px" : 0 }}>{title}</h2>
      {sub && <p style={{ color: "var(--muted)", fontSize: "1rem", lineHeight: 1.6, maxWidth: "620px" }}>{sub}</p>}
    </div>
  );
}

function Divider() {
  return <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "32px 0" }} />;
}

/* ─── NAV ─────────────────────────────────────────────────────────── */
const NAV_ITEMS: { id: Page; label: string }[] = [
  { id: "home", label: "Home" }, { id: "about", label: "About" },
  { id: "learn", label: "Learn" }, { id: "quiz", label: "Quiz" },
  { id: "risk", label: "Risks" }, { id: "scenario", label: "Scenarios" },
  { id: "research", label: "Research" },
];

/* ─── APP ─────────────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState<Page>("home");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = globalStyle;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(7,9,15,0.85)", backdropFilter: "blur(14px)", borderBottom: "1px solid var(--border)", padding: "0 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "62px" }}>
          <button onClick={() => setPage("home")} aria-label="Go to home page" style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.05rem", color: "var(--text)", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "var(--accent)" }}>⬡</span> DeepfakeAware
          </button>
          <nav aria-label="Main navigation" style={{ display: "flex", gap: "4px", flexWrap: "wrap" as const }}>
            {NAV_ITEMS.map(n => (
              <button key={n.id} onClick={() => setPage(n.id)} aria-current={page === n.id ? "page" : undefined}
                style={{ background: page === n.id ? "rgba(0,229,255,.12)" : "none", border: "none", color: page === n.id ? "var(--accent)" : "var(--muted)", borderRadius: "8px", padding: "7px 14px", fontFamily: "var(--font-head)", fontWeight: 600, fontSize: ".82rem", cursor: "pointer", letterSpacing: ".04em", transition: "all .15s" }}
              >{n.label}</button>
            ))}
          </nav>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        {page === "home"     && <Home setPage={setPage} />}
        {page === "about"    && <About />}
        {page === "learn"    && <Learn />}
        {page === "quiz"     && <Quiz />}
        {page === "risk"     && <Risk />}
        {page === "scenario" && <Scenario />}
        {page === "research" && <Research />}
        {page === "what"     && <What setPage={setPage} />}
        {page === "why"      && <Why setPage={setPage} />}
        {page === "protect"  && <Protect setPage={setPage} />}
      </main>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "24px", textAlign: "center", color: "var(--muted)", fontSize: ".82rem", fontFamily: "var(--font-head)" }}>
        Created by David Barry · Final Year Project 2026 · Deepfake Awareness Platform
      </footer>
    </div>
  );
}

/* ─── HOME ────────────────────────────────────────────────────────── */
function Home({ setPage }: NavProps) {
  const stats = [
    { value: "96%", label: "of deepfake videos target women" },
    { value: "500%", label: "increase in deepfakes since 2019" },
    { value: "$25B", label: "estimated fraud losses by 2027" },
  ];
  return (
    <SectionWrap>
      <div className="fade-up" style={{ textAlign: "center", padding: "60px 0 40px" }}>
        <Badge color="var(--danger)">Final Year Project — UCC 2026</Badge>
        <h1 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "clamp(2.2rem,6vw,4rem)", marginTop: "16px", lineHeight: 1.1 }}>
          Can You Spot a <span style={{ color: "var(--accent)" }}>Deepfake?</span>
        </h1>
        <p style={{ color: "var(--muted)", marginTop: "16px", maxWidth: "600px", margin: "16px auto 0", lineHeight: 1.7 }}>
          Deepfakes are not just a technical problem — they are a <strong style={{ color: "var(--text)" }}>human one</strong>. No firewall can stop them. Only awareness, critical thinking, and informed behaviour can.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "28px", flexWrap: "wrap" as const }}>
          <Btn onClick={() => setPage("quiz")} ariaLabel="Take the detection quiz">🧠 Take the Quiz</Btn>
          <Btn onClick={() => setPage("learn")} variant="ghost" ariaLabel="Start learning">📚 Start Learning</Btn>
        </div>
      </div>

      <div className="fade-up-d1">
        <Card style={{ background: "rgba(0,229,255,0.05)", borderColor: "rgba(0,229,255,0.2)", textAlign: "center", marginBottom: "32px" }}>
          <p style={{ color: "var(--muted)", fontSize: ".78rem", fontFamily: "var(--font-head)", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" as const, marginBottom: "8px" }}>Research Question</p>
          <p style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.1rem", color: "var(--accent)", fontStyle: "italic" }}>
            "Exploring the Human Factor in Cyber Security: Awareness, Behaviour and Risk"
          </p>
          <p style={{ color: "var(--muted)", fontSize: ".85rem", marginTop: "10px", lineHeight: 1.6 }}>
            Deepfakes exploit human perception rather than technical vulnerabilities. Understanding them means understanding ourselves.
          </p>
        </Card>
      </div>

      <div className="fade-up-d2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "16px", marginBottom: "32px" }}>
        {stats.map((s, i) => (
          <Card key={i} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-head)", fontSize: "2.2rem", fontWeight: 800, color: "var(--accent)" }}>{s.value}</div>
            <div style={{ color: "var(--muted)", fontSize: ".85rem", marginTop: "6px" }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="fade-up-d2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "16px" }}>
        <Card onClick={() => setPage("what")} style={{ borderLeft: "3px solid var(--accent)" }}>
          <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>🧠</div>
          <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: "8px" }}>What are Deepfakes?</h3>
          <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.6 }}>Understand the AI technology behind synthetic media.</p>
        </Card>
        <Card onClick={() => setPage("why")} style={{ borderLeft: "3px solid var(--danger)" }}>
          <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>⚠️</div>
          <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: "8px" }}>Why It Matters</h3>
          <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.6 }}>Explore the real-world harms deepfakes cause.</p>
        </Card>
        <Card onClick={() => setPage("protect")} style={{ borderLeft: "3px solid var(--success)" }}>
          <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>🛡️</div>
          <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: "8px" }}>How to Protect Yourself</h3>
          <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.6 }}>Practical steps to guard against deepfake threats.</p>
        </Card>
      </div>

      <div className="fade-up-d3" style={{ display: "flex", gap: "12px", marginTop: "32px", flexWrap: "wrap" as const }}>
        <Btn onClick={() => setPage("risk")} variant="ghost">⚠️ Risks</Btn>
        <Btn onClick={() => setPage("scenario")} variant="ghost">🎭 Scenarios</Btn>
        <Btn onClick={() => setPage("research")} variant="ghost">📖 Research</Btn>
      </div>
    </SectionWrap>
  );
}

/* ─── ABOUT ───────────────────────────────────────────────────────── */
function About() {
  return (
    <SectionWrap>
      <PageHeading badge="About" title="About This Platform" sub="An interactive educational website exploring deepfakes through the lens of human behaviour, cybersecurity awareness, and social impact." />
      <Card className="fade-up" style={{ background: "rgba(0,229,255,0.05)", borderColor: "rgba(0,229,255,0.2)", marginBottom: "24px", textAlign: "center" }}>
        <p style={{ color: "var(--muted)", fontSize: ".78rem", fontFamily: "var(--font-head)", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" as const, marginBottom: "8px" }}>Research Question</p>
        <p style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.15rem", color: "var(--accent)", fontStyle: "italic" }}>
          "Exploring the Human Factor in Cyber Security: Awareness, Behaviour and Risk"
        </p>
      </Card>
      <Card className="fade-up-d1" style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "1.6rem", marginBottom: "10px" }}>📋</div>
        <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: "12px" }}>About the Project</h3>
        <p style={{ color: "var(--muted)", fontSize: ".9rem", lineHeight: 1.8, marginBottom: "12px" }}>
          The development of artificial intelligence has allowed for the development of deepfakes — digital media that is manipulated to deceive people. While these technologies have beneficial uses in entertainment and research, they also carry serious ethical and social implications.
        </p>
        <p style={{ color: "var(--muted)", fontSize: ".9rem", lineHeight: 1.8 }}>
          This platform combines technical explanations with interactive tools — including a quiz that challenges users to differentiate between real and AI-generated media — to build genuine digital literacy for everyday users.
        </p>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "16px", marginBottom: "24px" }}>
        {[
          { icon: "💻", title: "Information Technology", color: "var(--accent)", body: "Understanding how deepfakes are technically created — GANs, diffusion models — and how detection algorithms attempt to identify them." },
          { icon: "📖", title: "Digital Humanities", color: "var(--warning)", body: "Exploring how synthetic media affects trust in digital content, journalism, and cultural memory." },
          { icon: "🌍", title: "Sociology", color: "var(--success)", body: "Examining the social consequences of deepfakes — from erosion of collective trust to impact on democratic processes." },
        ].map((item, i) => (
          <Card key={i} className="fade-up-d2" style={{ borderTop: `3px solid ${item.color}` }}>
            <div style={{ fontSize: "1.4rem", marginBottom: "8px" }}>{item.icon}</div>
            <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: "8px", color: item.color }}>{item.title}</h3>
            <p style={{ color: "var(--muted)", fontSize: ".85rem", lineHeight: 1.7 }}>{item.body}</p>
          </Card>
        ))}
      </div>
      <Divider />
      <div className="fade-up-d3">
        <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.2rem", marginBottom: "16px" }}>👨‍💻 About the Developer</h3>
        <Card>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" as const, alignItems: "flex-start" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--success))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.4rem", flexShrink: 0 }}>DB</div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1.1rem", marginBottom: "4px" }}>David Barry</h4>
              <p style={{ color: "var(--accent)", fontSize: ".82rem", fontFamily: "var(--font-head)", fontWeight: 600, marginBottom: "12px" }}>Final Year Student · Digital Humanities & Information Technology · University College Cork</p>
              <p style={{ color: "var(--muted)", fontSize: ".9rem", lineHeight: 1.8, marginBottom: "10px" }}>
                I'm a final year student at UCC studying Digital Humanities and Information Technology, with a minor in Sociology. I completed my Leaving Certificate at Coláiste an Phiarsaigh in Glanmire, Cork.
              </p>
              <p style={{ color: "var(--muted)", fontSize: ".9rem", lineHeight: 1.8 }}>
                Most recently I completed a 9-month internship with <strong style={{ color: "var(--text)" }}>Gas Networks Ireland</strong>, and stepped back at the end of 2025 to focus fully on my final semester.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "8px", marginTop: "14px" }}>
                {["Digital Humanities", "Information Technology", "Sociology (Minor)", "UCC", "Cork, Ireland"].map(t => (
                  <Badge key={t} color="var(--muted)">{t}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
      <Divider />
      <Card className="fade-up" style={{ background: "rgba(0,229,255,0.05)", borderColor: "rgba(0,229,255,0.2)" }}>
        <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: "12px" }}>⚙️ Technologies Used</h3>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "8px" }}>
          {["React", "TypeScript", "CSS Variables", "YouTube Embed API", "CodeSandbox"].map(t => (
            <Badge key={t} color="var(--accent)">{t}</Badge>
          ))}
        </div>
      </Card>
    </SectionWrap>
  );
}

/* ─── LEARN ───────────────────────────────────────────────────────── */
function Learn() {
  const topics = [
    { title: "How Deepfakes Are Made", icon: "🤖", body: "Deepfakes use Generative Adversarial Networks (GANs) — two neural networks that compete. One generates fake images, the other tries to detect them. Over thousands of iterations, the generator becomes incredibly convincing." },
    { title: "Signs of a Deepfake", icon: "🔍", body: "Look for unnatural blinking, mismatched skin tones, blurry edges around hair and faces, audio that doesn't sync with lip movements, and inconsistent lighting." },
    { title: "Audio Deepfakes", icon: "🎙️", body: "Voice cloning can replicate someone's voice from just a few seconds of audio. These are used in fraud schemes — like fake calls from 'CEOs' authorising bank transfers." },
    { title: "Detection Tools", icon: "🛡️", body: "Tools like Microsoft Video Authenticator, Deepware Scanner, and FotoForensics can detect manipulation artefacts. No tool is 100% reliable — human scepticism remains essential." },
  ];
  return (
    <SectionWrap>
      <PageHeading badge="Education" title="Learn About Deepfakes" sub="Build your understanding of synthetic media — from how it's created to how you can spot it." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "16px", marginBottom: "40px" }}>
        {topics.map((t, i) => (
          <Card key={i} className={`fade-up-d${i}`}>
            <div style={{ fontSize: "1.6rem", marginBottom: "10px" }}>{t.icon}</div>
            <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: "10px" }}>{t.title}</h3>
            <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.7 }}>{t.body}</p>
          </Card>
        ))}
      </div>
      <Divider />
      <div className="fade-up">
        <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: "16px" }}>📺 Watch & Learn</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "20px" }}>
          {[
            { label: "What is a Deepfake?", src: "https://www.youtube.com/embed/cQ54GDm1eL0" },
            { label: "Deepfake Detection Explained", src: "https://www.youtube.com/embed/AmUC4m6w1wo" },
          ].map((v, i) => (
            <div key={i}>
              <p style={{ color: "var(--muted)", fontSize: ".82rem", marginBottom: "8px", fontFamily: "var(--font-head)", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: ".06em" }}>{v.label}</p>
              <div style={{ borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--border)" }}>
                <iframe width="100%" height="220" src={v.src} title={v.label} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ display: "block" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrap>
  );
}

/* ─── QUIZ ────────────────────────────────────────────────────────── */
const QUESTIONS: Question[] = [
  { type: "single", q: "Is this person real or AI-generated?", hint: "Check the skin texture and eyes carefully.", img: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&q=80", a: "real", exp: "✅ Real. Natural imperfections, varied skin texture, and genuine catch-lights in the eyes are signs of a real photo." },
  { type: "single", q: "Real photograph or AI-generated face?", hint: "Look at the ears, hairline, and background blending.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", a: "real", exp: "✅ Real. Authentic lighting falloff, visible pores, and natural asymmetry are markers of a genuine photo." },
  { type: "single", q: "Does this look like a real or synthetic face?", hint: "AI faces often have overly smooth skin and perfect symmetry.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80", a: "real", exp: "✅ Real. Genuine photos show natural variations — stubble texture, natural skin tones, and real environmental lighting." },
  { type: "multi", q: "One of these images is AI-generated. Which one?", hint: "Look for unnaturally smooth skin, perfect symmetry, or background artefacts.", correct: 3, images: [
    { src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&q=80", label: "A", isReal: true },
    { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80", label: "B", isReal: true },
    { src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80", label: "C", isReal: true },
    { src: "https://images.unsplash.com/photo-1639628735078-ed2f038a193e?w=300&q=80", label: "D", isReal: false },
  ], exp: "❌ Image D. AI-generated portraits often show overly uniform skin texture and unnatural background transitions." },
  { type: "video", q: "Watch this clip. Is it a real video or a deepfake?", hint: "Watch for lip sync, blinking rhythm, and edge artefacts around the face.", video: "https://www.youtube.com/embed/AmUC4m6w1wo", a: "fake", exp: "🔍 Deepfake. Look for subtle edge artefacts at the hairline and slightly unnatural blinking frequency." },
  { type: "multi", q: "Three are AI-generated, one is a real photograph. Find the real one.", hint: "Real photos have natural lighting inconsistencies and imperfect backgrounds.", correct: 3, images: [
    { src: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&q=80", label: "A", isReal: false },
    { src: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&q=80", label: "B", isReal: false },
    { src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80", label: "C", isReal: false },
    { src: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=300&q=80", label: "D", isReal: true },
  ], exp: "✅ Image D is the real photograph. Natural photos show genuine environmental lighting that AI still struggles to fully replicate." },
];

function Quiz() {
  const [phase, setPhase]     = useState<"intro"|"question"|"result">("intro");
  const [i, setI]             = useState(0);
  const [score, setScore]     = useState(0);
  const [conf, setConf]       = useState(50);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selected, setSelected] = useState<number|string|null>(null);
  const [log, setLog]         = useState<LogEntry[]>([]);

  const q = QUESTIONS[i];

  function handleAnswer(ans: number | string) {
    if (answered) return;
    const correct = q.type === "multi" ? ans === q.correct : ans === q.a;
    const pts = (correct ? 10 : -5) + Math.floor(conf / 10);
    setScore(s => s + pts);
    setSelected(ans);
    setAnswered(true);
    setFeedback(q.exp);
    setLog(l => [...l, { correct, conf }]);
  }

  function handleNext() {
    if (i < QUESTIONS.length - 1) {
      setI(i + 1); setAnswered(false); setFeedback(""); setSelected(null); setConf(50);
    } else { setPhase("result"); }
  }

  function restart() {
    setPhase("intro"); setI(0); setScore(0); setConf(50);
    setAnswered(false); setFeedback(""); setSelected(null); setLog([]);
  }

  if (phase === "intro") return (
    <SectionWrap>
      <PageHeading badge="Quiz" title="Deepfake Detection Challenge" sub="Test your ability to spot AI-generated media. Decide what's real and what's fake." />
      <Card className="fade-up" style={{ maxWidth: "520px" }}>
        <ul style={{ color: "var(--muted)", fontSize: ".9rem", lineHeight: 2, listStyle: "none" }}>
          <li>📋 <strong style={{ color: "var(--text)" }}>{QUESTIONS.length} questions</strong> — images and a video</li>
          <li>🎯 Rate your <strong style={{ color: "var(--text)" }}>confidence</strong> to earn bonus points</li>
          <li>✅ Correct = <strong style={{ color: "var(--success)" }}>+10 pts</strong></li>
          <li>❌ Wrong = <strong style={{ color: "var(--danger)" }}>-5 pts</strong></li>
          <li>💡 Confidence bonus = up to <strong style={{ color: "var(--warning)" }}>+10 pts</strong></li>
        </ul>
        <Btn onClick={() => setPhase("question")} style={{ marginTop: "20px", width: "100%" }} ariaLabel="Start the quiz">Start Quiz →</Btn>
      </Card>
    </SectionWrap>
  );

  if (phase === "result") {
    const correct = log.filter(l => l.correct).length;
    const avgConf = Math.round(log.reduce((a, b) => a + b.conf, 0) / log.length);
    const pct = Math.round((correct / QUESTIONS.length) * 100);
    const grade = pct >= 80 ? "🏆 Expert Detector" : pct >= 60 ? "👍 Competent" : pct >= 40 ? "⚠️ Developing" : "📚 Needs Work";
    return (
      <SectionWrap>
        <PageHeading badge="Results" title="Quiz Complete!" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Final Score", value: String(score), color: "var(--accent)" },
            { label: "Correct Answers", value: `${correct}/${QUESTIONS.length}`, color: "var(--success)" },
            { label: "Accuracy", value: `${pct}%`, color: "var(--warning)" },
            { label: "Avg Confidence", value: `${avgConf}%`, color: "var(--muted)" },
          ].map((s, idx) => (
            <Card key={idx} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontFamily: "var(--font-head)", fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ color: "var(--muted)", fontSize: ".8rem", marginTop: "4px" }}>{s.label}</div>
            </Card>
          ))}
        </div>
        <Card style={{ marginBottom: "20px", textAlign: "center" }}>
          <div style={{ fontSize: "1.4rem", fontFamily: "var(--font-head)", fontWeight: 800 }}>{grade}</div>
          <p style={{ color: "var(--muted)", marginTop: "8px", fontSize: ".9rem" }}>
            {pct >= 80 ? "Outstanding! You have a strong eye for detecting synthetic media." : pct >= 60 ? "Good effort. A few more hints could sharpen your detection skills." : "Keep learning! Head to the Learn section to improve."}
          </p>
        </Card>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" as const }}>
          <Btn onClick={restart} ariaLabel="Restart the quiz">🔄 Try Again</Btn>
        </div>
      </SectionWrap>
    );
  }

  return (
    <SectionWrap>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <Badge>{`Q${i + 1} of ${QUESTIONS.length}`}</Badge>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ color: "var(--muted)", fontSize: ".82rem" }}>Score:</span>
          <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, color: "var(--accent)" }}>{score}</span>
        </div>
      </div>
      <div style={{ height: "4px", background: "var(--glass)", borderRadius: "2px", marginBottom: "28px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(i / QUESTIONS.length) * 100}%`, background: "var(--accent)", borderRadius: "2px", transition: "width .4s ease" }} />
      </div>
      <div className="fade-up">
        <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1.2rem", marginBottom: "6px" }}>{q.q}</h3>
        {q.hint && <p style={{ color: "var(--muted)", fontSize: ".85rem", marginBottom: "20px" }}>💡 {q.hint}</p>}
      </div>

      {q.type === "single" && q.img && (
        <div className="fade-up-d1">
          <img src={q.img} alt="Evaluate this image" style={{ width: "100%", maxWidth: "380px", borderRadius: "var(--radius)", border: "1px solid var(--border)", display: "block", marginBottom: "20px" }} />
          {!answered && (
            <div style={{ display: "flex", gap: "12px" }}>
              <Btn onClick={() => handleAnswer("real")} variant="success" ariaLabel="Mark as real">✅ Real</Btn>
              <Btn onClick={() => handleAnswer("fake")} variant="danger" ariaLabel="Mark as fake">🤖 Fake</Btn>
            </div>
          )}
        </div>
      )}

      {q.type === "multi" && q.images && (
        <div className="fade-up-d1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "12px", marginBottom: "20px" }}>
          {q.images.map((img, idx) => {
            let borderColor = "var(--border)";
            if (answered) borderColor = idx === q.correct ? "var(--success)" : (idx === selected ? "var(--danger)" : "var(--border)");
            return (
              <button key={idx} onClick={() => !answered && handleAnswer(idx)} aria-label={`Select image ${img.label}`}
                style={{ background: "none", border: `2px solid ${borderColor}`, borderRadius: "var(--radius)", padding: 0, cursor: answered ? "default" : "pointer", overflow: "hidden", transition: "border-color .2s" }}>
                <div style={{ position: "relative" }}>
                  <img src={img.src} alt={`Option ${img.label}`} style={{ width: "100%", display: "block" }} />
                  <div style={{ position: "absolute", top: "8px", left: "8px", background: "rgba(0,0,0,.7)", borderRadius: "99px", padding: "2px 8px", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: ".75rem" }}>{img.label}</div>
                  {answered && idx === q.correct && <div style={{ position: "absolute", top: "8px", right: "8px", background: "var(--success)", borderRadius: "99px", padding: "2px 8px", fontSize: ".75rem", fontWeight: 700 }}>✓</div>}
                  {answered && idx === selected && idx !== q.correct && <div style={{ position: "absolute", top: "8px", right: "8px", background: "var(--danger)", borderRadius: "99px", padding: "2px 8px", fontSize: ".75rem", fontWeight: 700 }}>✗</div>}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {q.type === "video" && q.video && (
        <div className="fade-up-d1">
          <div style={{ borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--border)", marginBottom: "20px" }}>
            <iframe width="100%" height="280" src={q.video} title="Evaluate this video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ display: "block" }} />
          </div>
          {!answered && (
            <div style={{ display: "flex", gap: "12px" }}>
              <Btn onClick={() => handleAnswer("real")} variant="success" ariaLabel="Mark as real">✅ Real Video</Btn>
              <Btn onClick={() => handleAnswer("fake")} variant="danger" ariaLabel="Mark as deepfake">🤖 Deepfake</Btn>
            </div>
          )}
        </div>
      )}

      {!answered && q.type !== "multi" && (
        <div style={{ marginTop: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <label htmlFor="conf-slider" style={{ color: "var(--muted)", fontSize: ".85rem" }}>How confident are you?</label>
            <span style={{ fontFamily: "var(--font-head)", fontWeight: 700, color: conf > 70 ? "var(--success)" : conf > 40 ? "var(--warning)" : "var(--danger)" }}>{conf}%</span>
          </div>
          <input id="conf-slider" type="range" min="0" max="100" value={conf} onChange={e => setConf(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--accent)" }} aria-label="Confidence level" />
        </div>
      )}

      {answered && (
        <Card style={{ marginTop: "20px", borderColor: "rgba(0,229,255,0.2)", background: "rgba(0,229,255,0.05)" }}>
          <p style={{ fontSize: ".9rem", lineHeight: 1.7 }}>{feedback}</p>
          <Btn onClick={handleNext} style={{ marginTop: "16px" }} ariaLabel={i < QUESTIONS.length - 1 ? "Next question" : "See results"}>
            {i < QUESTIONS.length - 1 ? "Next Question →" : "See Results →"}
          </Btn>
        </Card>
      )}
    </SectionWrap>
  );
}

/* ─── RISK ────────────────────────────────────────────────────────── */
function Risk() {
  const risks = [
    { icon: "🎭", title: "Political Manipulation", color: "var(--danger)", body: "Deepfake videos of politicians saying things they never said have been used to spread misinformation and influence elections. In 2024, a deepfake robocall mimicking a U.S. presidential candidate was used to suppress voter turnout." },
    { icon: "💸", title: "Financial Fraud", color: "var(--warning)", body: "Criminals use voice cloning to impersonate CEOs in phone calls, instructing employees to transfer funds. A UK energy firm lost £201,000 to such an attack in 2019 — the first documented case of AI voice fraud." },
    { icon: "💔", title: "Non-Consensual Intimate Images", color: "var(--danger)", body: "96% of deepfake videos online are non-consensual intimate imagery targeting women. This causes severe psychological harm and reputational damage. Many countries now criminalise their creation and distribution." },
    { icon: "🪪", title: "Identity Theft", color: "var(--warning)", body: "Synthetic faces can be used to pass identity verification systems at banks and online platforms. AI-generated IDs and live deepfake webcam feeds have been used in real fraud attempts." },
    { icon: "📰", title: "Misinformation", color: "var(--accent)", body: "Deepfakes contribute to an 'infodemic' where it becomes impossible to trust visual evidence. This erodes public trust in journalism, institutions, and even genuine footage of real events." },
    { icon: "🎓", title: "Academic & Workplace Fraud", color: "var(--muted)", body: "Deepfakes are increasingly used to cheat in remote interviews and online exams. This poses serious challenges for remote hiring and assessment." },
  ];
  return (
    <SectionWrap>
      <PageHeading badge="Risks" title="The Real-World Risks of Deepfakes" sub="Understanding the threats is the first step to protecting yourself and your community." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "16px" }}>
        {risks.map((r, i) => (
          <Card key={i} className={`fade-up-d${Math.min(i, 3)}`} style={{ borderTop: `3px solid ${r.color}` }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>{r.icon}</div>
            <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: "10px", color: r.color }}>{r.title}</h3>
            <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.7 }}>{r.body}</p>
          </Card>
        ))}
      </div>
    </SectionWrap>
  );
}

/* ─── SCENARIO ────────────────────────────────────────────────────── */
function ScenarioOptions({ options }: { options: ScenarioOption[] }) {
  const [chosen, setChosen] = useState<number|null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {options.map((o, oi) => {
        const isChosen = chosen === oi;
        return (
          <div key={oi}>
            <button onClick={() => setChosen(oi)} aria-label={o.text}
              style={{ width: "100%", textAlign: "left", background: isChosen ? (o.correct ? "rgba(0,224,150,.08)" : "rgba(255,59,92,.08)") : "var(--glass)", border: `1px solid ${isChosen ? (o.correct ? "var(--success)" : "var(--danger)") : "var(--border)"}`, borderRadius: "var(--radius)", padding: "12px 16px", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: ".9rem", cursor: "pointer", transition: "all .18s" }}>
              {o.text}
            </button>
            {isChosen && <p style={{ color: "var(--muted)", fontSize: ".85rem", lineHeight: 1.6, marginTop: "8px", paddingLeft: "4px" }}>{o.feedback}</p>}
          </div>
        );
      })}
    </div>
  );
}

function Scenario() {
  const [active, setActive] = useState<number|null>(null);
  const scenarios: ScenarioItem[] = [
    { title: "The CEO Phone Call", icon: "📞", badge: "Finance", badgeColor: "var(--warning)", setup: "You receive an urgent phone call from what sounds exactly like your CEO. They ask you to immediately wire €80,000 to a new supplier account — it's confidential and needs to happen today.", question: "What do you do?", options: [
      { text: "Transfer the money — it sounds exactly like them.", correct: false, feedback: "❌ Dangerous. Voice cloning can perfectly replicate someone's voice from a few seconds of audio. Always verify unusual financial requests through a separate, known channel." },
      { text: "Hang up and call the CEO back on their known number.", correct: true, feedback: "✅ Correct. Never act on unexpected financial requests without independent verification." },
      { text: "Ask for more details about the supplier before transferring.", correct: false, feedback: "⚠️ Partial. Asking questions is better than complying, but the AI can answer convincingly. Verify via a completely separate channel." },
    ]},
    { title: "The Viral Political Video", icon: "🏛️", badge: "Politics", badgeColor: "var(--danger)", setup: "A video goes viral showing a well-known politician admitting to corruption on camera. It looks completely real. Millions are sharing it the day before a major election.", question: "How do you evaluate this?", options: [
      { text: "Share it — the video looks real and everyone else is sharing it.", correct: false, feedback: "❌ This is how misinformation spreads exponentially. Viral momentum is not evidence of authenticity." },
      { text: "Wait for fact-checkers and check for the original source before engaging.", correct: true, feedback: "✅ Correct. Check the original source, look for established news coverage, and use fact-checking sites before sharing." },
      { text: "Assume it's a deepfake because it's too convenient politically.", correct: false, feedback: "⚠️ Scepticism is good, but dismissing all uncomfortable evidence as deepfakes is also harmful. Verify properly." },
    ]},
    { title: "The Job Interview Swap", icon: "💼", badge: "Workplace", badgeColor: "var(--accent)", setup: "You're conducting a remote job interview. The candidate is impressive, but their video keeps flickering oddly around their face and their lip sync seems slightly off.", question: "As the interviewer, what should you do?", options: [
      { text: "Ignore it — video calls often have tech issues.", correct: false, feedback: "❌ Face-edge flickering and lip-sync issues are classic deepfake artefacts. Don't dismiss these warning signs." },
      { text: "Ask them to do an unexpected action like turning sideways.", correct: true, feedback: "✅ Smart. Deepfake systems struggle with sudden head movements or unusual angles. Asking someone to hold their hand in front of their face can also break the illusion." },
      { text: "End the call and reject them immediately.", correct: false, feedback: "⚠️ Too extreme without certainty. Gather more evidence first — you could be wrong about a legitimate candidate." },
    ]},
  ];
  return (
    <SectionWrap>
      <PageHeading badge="Scenarios" title="Real-World Scenario Training" sub="How would you react? Work through realistic situations involving deepfake threats." />
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {scenarios.map((s, si) => (
          <Card key={si} className={`fade-up-d${si}`}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" as const }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={{ fontSize: "1.8rem" }}>{s.icon}</span>
                <div><Badge color={s.badgeColor}>{s.badge}</Badge><h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginTop: "6px" }}>{s.title}</h3></div>
              </div>
              <Btn variant="ghost" onClick={() => setActive(active === si ? null : si)} ariaLabel={active === si ? "Collapse" : "Expand"}>
                {active === si ? "Collapse ↑" : "Read Scenario →"}
              </Btn>
            </div>
            {active === si && (
              <div style={{ marginTop: "20px" }}>
                <Divider />
                <p style={{ lineHeight: 1.7, marginBottom: "12px" }}>{s.setup}</p>
                <p style={{ fontFamily: "var(--font-head)", fontWeight: 700, color: "var(--accent)", marginBottom: "16px" }}>❓ {s.question}</p>
                <ScenarioOptions options={s.options} />
              </div>
            )}
          </Card>
        ))}
      </div>
    </SectionWrap>
  );
}

/* ─── RESEARCH ────────────────────────────────────────────────────── */
function Research() {
  const [tab, setTab] = useState<"literature"|"similar">("literature");
  const literature: ResearchItem[] = [
    { year: "2024", title: "The Human Factor in Deepfake Detection: A Systematic Review", authors: "Park & Zamora (2024)", tag: "Human Factor", color: "var(--accent)", summary: "Synthesises 60+ studies on media literacy and user behaviour. Identifies consistent overestimation of human detection capability. Guided comparison tasks and exposure to synthetic artefacts improve detection rates.", relevance: "Directly supports the rationale for this platform. Frames deepfake detection as a behavioural problem, not just a technical one — justifying the interactive, education-first approach." },
    { year: "2024–25", title: "Diffusion Models and the Future of Synthetic Video Generation", authors: "Huang et al. (2024–2025)", tag: "Technology", color: "var(--warning)", summary: "Analyses how diffusion models have surpassed GANs. Traditional visual tells used to detect deepfakes are increasingly eliminated by newer models. Consumer-level tools producing convincing video are now widely available.", relevance: "Provides the technological backdrop. Reinforces the need for behavioural and contextual awareness since visual artefacts are disappearing as reliable indicators." },
    { year: "2025", title: "Deepfake Literacy in the Age of Misinformation", authors: "Santos & Brennan (2025)", tag: "Sociology", color: "var(--success)", summary: "Cross-country survey data shows exposure to deepfakes produces widespread scepticism toward all media — the 'liar's dividend'. Deepfake literacy must address social dynamics of trust, not just detection skills.", relevance: "Informs the sociological dimension. Confirms harms extend beyond individual deception to collective trust and democratic processes." },
    { year: "2023–24", title: "Review of User-Facing Deepfake Tools: Transparency, Usability and Ethics", authors: "Levin & Hartmann (2023–2024)", tag: "Usability", color: "var(--danger)", summary: "Studies usability of commercial detection tools. Users frequently misunderstand confidence scores and either overtrust or distrust automated tools. Argues strongly for transparency and accessible language.", relevance: "Shapes design philosophy — reinforcing the importance of clear explanations and plain language rather than raw algorithmic outputs." },
    { year: "2024", title: "Detect DeepFakes: How to Counteract Misinformation Created by AI", authors: "MIT Media Lab", tag: "Interactive", color: "var(--muted)", summary: "15,000+ participants distinguished deepfake videos from real ones. Humans and machines performed similarly on average, but combining both yielded highest accuracy. Misleading model predictions lowered human accuracy.", relevance: "Directly inspired the quiz feature. Demonstrates that interactive, experience-based learning enhances media literacy more effectively than passive delivery." },
  ];
  const similar: ResearchItem[] = [
    { year: "2024", title: "SURF Deepwater", authors: "SURF Security (2024)", tag: "Tool", color: "var(--accent)", summary: "First AI deepfake detector designed to warn users in real time during browsing. Checks face expressions, texture artefacts, abnormal motion, and voice distortions. Claims up to 98% accuracy.", relevance: "Demonstrates the trend toward everyday detection environments. However, Deepwater is proprietary and enterprise-focused — not freely available. This reinforces the need for open educational resources." },
    { year: "2024–25", title: "Deepfake-Eval-2024 Benchmark", authors: "Academic Consortium (updated 2025)", tag: "Benchmark", color: "var(--warning)", summary: "Tests deepfake detectors against thousands of real-world videos. Consistently finds models perform well in lab settings but suffer 40–50% accuracy drops on naturally occurring online deepfakes.", relevance: "Justifies the educational approach. Automated detection alone cannot guarantee user safety — users must develop critical awareness and contextual judgment." },
    { year: "2025", title: "Vastav.AI", authors: "Zero Defend Security (2025)", tag: "Tool", color: "var(--success)", summary: "Cloud-based service analysing images, audio, and video using forensic analysis, metadata inspection, and machine learning. Generates detailed reports including manipulation heatmaps.", relevance: "While powerful, raises concerns around user privacy and cost barriers. Its visual explanation tools inspired the use of clear visual aids in this platform's educational content." },
  ];
  const current = tab === "literature" ? literature : similar;
  return (
    <SectionWrap>
      <PageHeading badge="Research" title="Research & Literature" sub="The academic literature and existing projects that informed the design and content of this platform." />
      <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
        {([["literature", "📚 Literature Review"], ["similar", "🔍 Similar Projects"]] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} aria-pressed={tab === id}
            style={{ background: tab === id ? "rgba(0,229,255,.12)" : "var(--glass)", border: `1px solid ${tab === id ? "rgba(0,229,255,.3)" : "var(--border)"}`, color: tab === id ? "var(--accent)" : "var(--muted)", borderRadius: "var(--radius)", padding: "9px 18px", fontFamily: "var(--font-head)", fontWeight: 700, fontSize: ".85rem", cursor: "pointer", transition: "all .15s" }}>
            {label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {current.map((p, i) => (
          <Card key={i} className={`fade-up-d${Math.min(i, 3)}`}>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "16px", alignItems: "start" }}>
              <div style={{ textAlign: "center", minWidth: "64px" }}>
                <div style={{ fontFamily: "var(--font-head)", fontWeight: 800, fontSize: "1rem", color: "var(--accent)", marginBottom: "6px" }}>{p.year}</div>
                <Badge color={p.color}>{p.tag}</Badge>
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: "1rem", marginBottom: "4px", lineHeight: 1.4 }}>{p.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: ".78rem", marginBottom: "10px", fontStyle: "italic" }}>{p.authors}</p>
                <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.7, marginBottom: "10px" }}>{p.summary}</p>
                <div style={{ background: "rgba(0,229,255,0.05)", borderLeft: "3px solid var(--accent)", padding: "8px 12px", borderRadius: "0 8px 8px 0" }}>
                  <p style={{ color: "var(--text)", fontSize: ".82rem", lineHeight: 1.6 }}><strong style={{ color: "var(--accent)", fontFamily: "var(--font-head)" }}>Relevance: </strong>{p.relevance}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </SectionWrap>
  );
}

/* ─── WHAT / WHY / PROTECT ────────────────────────────────────────── */
function What({ setPage }: NavProps) {
  return (
    <SectionWrap>
      <Btn variant="ghost" onClick={() => setPage("home")} ariaLabel="Go back to home" style={{ marginBottom: "24px" }}>← Back</Btn>
      <PageHeading badge="Explainer" title="What Are Deepfakes?" sub="A deep dive into the technology behind AI-generated synthetic media." />
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {[
          { icon: "🧬", title: "The Technology", body: "Deepfakes use Generative Adversarial Networks (GANs) — two competing neural networks. A generator creates fake content; a discriminator tries to detect it. Through thousands of training cycles, the generator becomes extremely convincing." },
          { icon: "📷", title: "What Can Be Faked?", body: "Any type of media can be manipulated: faces swapped in video, voices cloned from a few seconds of audio, images of people who never existed, and text that mimics someone's writing style." },
          { icon: "📈", title: "How Realistic Are They?", body: "State-of-the-art deepfakes are indistinguishable from real content in many cases. Research from 2022 showed participants could correctly identify AI-generated faces only 48% of the time — barely better than chance." },
          { icon: "⚡", title: "How Fast Is This Moving?", body: "In 2017, a convincing deepfake required a studio and thousands of images. By 2024, the same result can be achieved in minutes on a consumer laptop using free, open-source tools." },
        ].map((item, i) => (
          <Card key={i} className={`fade-up-d${i}`}>
            <div style={{ display: "flex", gap: "16px" }}>
              <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>{item.icon}</span>
              <div>
                <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: "8px" }}>{item.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: ".9rem", lineHeight: 1.7 }}>{item.body}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </SectionWrap>
  );
}

function Why({ setPage }: NavProps) {
  return (
    <SectionWrap>
      <Btn variant="ghost" onClick={() => setPage("home")} ariaLabel="Go back to home" style={{ marginBottom: "24px" }}>← Back</Btn>
      <PageHeading badge="Impact" title="Why Deepfakes Matter" sub="The societal, legal, and personal implications of synthetic media at scale." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "16px" }}>
        {[
          { icon: "⚖️", title: "Erosion of Trust", color: "var(--danger)", body: "When anyone can fabricate convincing video evidence, the concept of visual proof breaks down. Courts, journalists, and individuals all rely on visual evidence — deepfakes undermine this foundation." },
          { icon: "🗳️", title: "Democracy at Risk", color: "var(--warning)", body: "Deepfake political content can swing elections, suppress turnout, and incite division. The 2024 election cycle saw the first widespread deployment of AI-generated campaign content at scale." },
          { icon: "🧠", title: "Psychological Harm", color: "var(--accent)", body: "Victims of deepfake abuse experience severe anxiety, depression, and social withdrawal. The harm is real even when the content is entirely fabricated." },
          { icon: "📜", title: "Legal Gaps", color: "var(--success)", body: "Laws have struggled to keep pace. While the EU AI Act addresses deepfakes, enforcement is patchy and cross-border prosecution remains extremely difficult." },
        ].map((item, i) => (
          <Card key={i} className={`fade-up-d${i}`} style={{ borderTop: `3px solid ${item.color}` }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>{item.icon}</div>
            <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: "8px", color: item.color }}>{item.title}</h3>
            <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.7 }}>{item.body}</p>
          </Card>
        ))}
      </div>
    </SectionWrap>
  );
}

function Protect({ setPage }: NavProps) {
  const steps = [
    { icon: "🔍", title: "Verify Before Sharing", body: "Check media against fact-checking services like Snopes or AFP Fact Check before sharing. Look for the original source URL and cross-reference with mainstream coverage." },
    { icon: "🖱️", title: "Use Detection Tools", body: "Free tools like Deepware Scanner and Microsoft Video Authenticator can analyse media for manipulation artefacts. No tool is perfect, but they add a useful layer of verification." },
    { icon: "📞", title: "Verify Calls Independently", body: "If you receive an unexpected call requesting something unusual, hang up and call back using a number you already have. Voice cloning makes this essential practice." },
    { icon: "🔒", title: "Limit Your Digital Footprint", body: "Deepfakes require source material. Reducing public availability of your photos and video makes you a harder target." },
    { icon: "🎓", title: "Train Your Eye", body: "Practice spotting deepfakes. Look for: edge artefacts around the face, unnatural blinking, audio/lip sync mismatches, and inconsistent lighting." },
    { icon: "📣", title: "Report It", body: "If you encounter deepfake abuse, report it to the platform immediately. In many countries, non-consensual intimate deepfakes are now illegal." },
  ];
  return (
    <SectionWrap>
      <Btn variant="ghost" onClick={() => setPage("home")} ariaLabel="Go back to home" style={{ marginBottom: "24px" }}>← Back</Btn>
      <PageHeading badge="Protection" title="How to Protect Yourself" sub="Practical, actionable steps to defend against deepfake threats." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "16px" }}>
        {steps.map((s, i) => (
          <Card key={i} className={`fade-up-d${Math.min(i, 3)}`}>
            <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>{s.icon}</div>
            <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: "8px" }}>{s.title}</h3>
            <p style={{ color: "var(--muted)", fontSize: ".88rem", lineHeight: 1.7 }}>{s.body}</p>
          </Card>
        ))}
      </div>
      <Card className="fade-up" style={{ marginTop: "24px", background: "rgba(0,224,150,0.06)", borderColor: "rgba(0,224,150,0.2)" }}>
        <h3 style={{ fontFamily: "var(--font-head)", fontWeight: 700, marginBottom: "10px", color: "var(--success)" }}>🆘 If You're a Victim</h3>
        <p style={{ color: "var(--muted)", fontSize: ".9rem", lineHeight: 1.7 }}>
          Contact <strong style={{ color: "var(--text)" }}>Revenge Porn Helpline</strong> (UK), <strong style={{ color: "var(--text)" }}>Cyber Civil Rights Initiative</strong> (US), or your local police cybercrime unit. Document everything and report to the hosting platform immediately.
        </p>
      </Card>
    </SectionWrap>
  );
}

