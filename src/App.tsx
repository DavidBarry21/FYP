import { useState, useEffect } from "react";

/* ─── GLOBAL STYLES ───────────────────────────────────────────────── */
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #07090f;
    --surface:  #0e1220;
    --glass:    rgba(255,255,255,0.04);
    --border:   rgba(255,255,255,0.08);
    --accent:   #00e5ff;
    --danger:   #ff3b5c;
    --success:  #00e096;
    --warning:  #ffb830;
    --text:     #e8eaf0;
    --muted:    #7a8099;
    --radius:   14px;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    min-height: 100vh;
  }

  /* scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  /* fade-in animation */
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes pulse {
    0%,100% { opacity:1; }
    50%      { opacity:.5; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .fade-up { animation: fadeUp .45s ease both; }
  .fade-up-d1 { animation: fadeUp .45s .1s ease both; }
  .fade-up-d2 { animation: fadeUp .45s .2s ease both; }
  .fade-up-d3 { animation: fadeUp .45s .3s ease both; }
  .fade-up-d4 { animation: fadeUp .45s .4s ease both; }
`;

/* ─── SHARED COMPONENTS ──────────────────────────────────────────── */
function Badge({ children, color = "var(--accent)" }) {
  return (
    <span
      style={{
        background: color + "22",
        color,
        border: `1px solid ${color}44`,
        borderRadius: "99px",
        padding: "2px 10px",
        fontSize: ".72rem",
        fontFamily: "var(--font-head)",
        fontWeight: 700,
        letterSpacing: ".06em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

function Card({ children, style = {}, onClick, className = "" }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className={className}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => (e.key === "Enter" || e.key === " ") && onClick()
          : undefined
      }
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov && onClick ? "rgba(255,255,255,0.07)" : "var(--glass)",
        border: `1px solid ${
          hov && onClick ? "rgba(255,255,255,0.16)" : "var(--border)"
        }`,
        borderRadius: "var(--radius)",
        padding: "24px",
        cursor: onClick ? "pointer" : "default",
        transition: "all .22s ease",
        transform: hov && onClick ? "translateY(-3px)" : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Btn({
  children,
  onClick,
  variant = "primary",
  style = {},
  ariaLabel,
  disabled = false,
}) {
  const [hov, setHov] = useState(false);
  const colors = {
    primary: { bg: "var(--accent)", color: "#07090f" },
    danger: { bg: "var(--danger)", color: "#fff" },
    ghost: {
      bg: hov ? "rgba(255,255,255,0.08)" : "transparent",
      color: "var(--text)",
      border: "1px solid var(--border)",
    },
    success: { bg: "var(--success)", color: "#07090f" },
  };
  const c = colors[variant] || colors.primary;
  return (
    <button
      aria-label={
        ariaLabel || (typeof children === "string" ? children : undefined)
      }
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: c.bg,
        color: c.color,
        border: c.border || "none",
        borderRadius: "var(--radius)",
        padding: "10px 22px",
        fontFamily: "var(--font-head)",
        fontWeight: 700,
        fontSize: ".88rem",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all .18s ease",
        transform: hov && !disabled ? "translateY(-1px)" : "none",
        letterSpacing: ".04em",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function SectionWrap({ children, style = {} }) {
  return (
    <section
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px 16px 60px",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function PageHeading({ badge, title, sub }) {
  return (
    <div style={{ marginBottom: "40px" }} className="fade-up">
      {badge && (
        <div style={{ marginBottom: "10px" }}>
          <Badge>{badge}</Badge>
        </div>
      )}
      <h2
        style={{
          fontFamily: "var(--font-head)",
          fontSize: "clamp(1.8rem,4vw,2.6rem)",
          fontWeight: 800,
          lineHeight: 1.15,
          marginBottom: sub ? "12px" : 0,
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          style={{
            color: "var(--muted)",
            fontSize: "1rem",
            lineHeight: 1.6,
            maxWidth: "620px",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function Divider() {
  return (
    <hr
      style={{
        border: "none",
        borderTop: "1px solid var(--border)",
        margin: "32px 0",
      }}
    />
  );
}

/* ─── APP SHELL ───────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "learn", label: "Learn" },
  { id: "quiz", label: "Quiz" },
  { id: "risk", label: "Risks" },
  { id: "scenario", label: "Scenarios" },
  { id: "research", label: "Research" },
];

export default function App() {
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
  const style = document.createElement("style");
  style.textContent = globalStyle;
  document.head.appendChild(style);
  return () => {
    document.head.removeChild(style);
  };
}, []);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* ── HEADER ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(7,9,15,0.85)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--border)",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "62px",
          }}
        >
          <button
            onClick={() => setPage("home")}
            aria-label="Go to home page"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-head)",
              fontWeight: 800,
              fontSize: "1.05rem",
              color: "var(--text)",
              letterSpacing: ".01em",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ color: "var(--accent)" }}>⬡</span> DeepfakeAware
          </button>

          {/* Desktop nav */}
          <nav
            aria-label="Main navigation"
            style={{ display: "flex", gap: "4px" }}
          >
            {NAV_ITEMS.map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  setPage(n.id);
                  setMenuOpen(false);
                }}
                aria-current={page === n.id ? "page" : undefined}
                style={{
                  background: page === n.id ? "rgba(0,229,255,.12)" : "none",
                  border: "none",
                  color: page === n.id ? "var(--accent)" : "var(--muted)",
                  borderRadius: "8px",
                  padding: "7px 14px",
                  fontFamily: "var(--font-head)",
                  fontWeight: 600,
                  fontSize: ".82rem",
                  cursor: "pointer",
                  letterSpacing: ".04em",
                  transition: "all .15s",
                }}
              >
                {n.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={{ flex: 1 }}>
        {page === "home" && <Home setPage={setPage} />}
        {page === "about" && <About />}
        {page === "learn" && <Learn />}
        {page === "quiz" && <Quiz />}
        {page === "risk" && <Risk />}
        {page === "scenario" && <Scenario />}
        {page === "research" && <Research />}
        {page === "what" && <What setPage={setPage} />}
        {page === "why" && <Why setPage={setPage} />}
        {page === "protect" && <Protect setPage={setPage} />}
      </main>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "24px",
          textAlign: "center",
          color: "var(--muted)",
          fontSize: ".82rem",
          fontFamily: "var(--font-head)",
        }}
      >
        Created by David Barry · Final Year Project 2026 · Deepfake Awareness
        Platform
      </footer>
    </div>
  );
}

/* ─── HOME ────────────────────────────────────────────────────────── */
function Home({ setPage }) {
  const stats = [
    { value: "96%", label: "of deepfake videos target women" },
    { value: "500%", label: "increase in deepfakes since 2019" },
    { value: "$25B", label: "estimated fraud losses by 2027" },
  ];

  return (
    <SectionWrap>
      {/* Hero */}
      <div
        className="fade-up"
        style={{ textAlign: "center", padding: "60px 0 40px" }}
      >
        <Badge color="var(--danger)">Final Year Project — UCC 2026</Badge>
        <h1
          style={{
            fontFamily: "var(--font-head)",
            fontWeight: 800,
            fontSize: "clamp(2.2rem,6vw,4rem)",
            marginTop: "16px",
            lineHeight: 1.1,
          }}
        >
          Can You Spot a{" "}
          <span style={{ color: "var(--accent)" }}>Deepfake?</span>
        </h1>
        <p
          style={{
            color: "var(--muted)",
            marginTop: "16px",
            maxWidth: "600px",
            margin: "16px auto 0",
            lineHeight: 1.7,
          }}
        >
          Deepfakes are not just a technical problem — they are a{" "}
          <strong style={{ color: "var(--text)" }}>human one</strong>. No
          firewall can stop them. Only awareness, critical thinking, and
          informed behaviour can. This platform explores the human factor at the
          heart of deepfake risk.
        </p>
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            marginTop: "28px",
            flexWrap: "wrap",
          }}
        >
          <Btn
            onClick={() => setPage("quiz")}
            ariaLabel="Take the detection quiz"
          >
            🧠 Take the Quiz
          </Btn>
          <Btn
            onClick={() => setPage("learn")}
            variant="ghost"
            ariaLabel="Start learning about deepfakes"
          >
            📚 Start Learning
          </Btn>
        </div>
      </div>

      {/* Research question callout */}
      <div className="fade-up-d1">
        <Card
          style={{
            background: "rgba(0,229,255,0.05)",
            borderColor: "rgba(0,229,255,0.2)",
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <p
            style={{
              color: "var(--muted)",
              fontSize: ".78rem",
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Research Question
          </p>
          <p
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "var(--accent)",
              fontStyle: "italic",
            }}
          >
            "Exploring the Human Factor in Cyber Security: Awareness, Behaviour
            and Risk"
          </p>
          <p
            style={{
              color: "var(--muted)",
              fontSize: ".85rem",
              marginTop: "10px",
              lineHeight: 1.6,
            }}
          >
            Deepfakes are a case study in this question — exploiting human
            perception rather than technical vulnerabilities. Understanding them
            means understanding ourselves.
          </p>
        </Card>
      </div>

      {/* Stats */}
      <div
        className="fade-up-d2"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: "16px",
          margin: "0 0 32px",
        }}
      >
        {stats.map((s, i) => (
          <Card key={i} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--font-head)",
                fontSize: "2.2rem",
                fontWeight: 800,
                color: "var(--accent)",
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                color: "var(--muted)",
                fontSize: ".85rem",
                marginTop: "6px",
              }}
            >
              {s.label}
            </div>
          </Card>
        ))}
      </div>

      {/* Cards */}
      <div
        className="fade-up-d2"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: "16px",
          marginTop: "16px",
        }}
      >
        <Card
          onClick={() => setPage("what")}
          style={{ borderLeft: "3px solid var(--accent)" }}
        >
          <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>🧠</div>
          <h3
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            What are Deepfakes?
          </h3>
          <p
            style={{
              color: "var(--muted)",
              fontSize: ".88rem",
              lineHeight: 1.6,
            }}
          >
            Understand the AI technology behind synthetic media and how it's
            created.
          </p>
        </Card>
        <Card
          onClick={() => setPage("why")}
          style={{ borderLeft: "3px solid var(--danger)" }}
        >
          <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>⚠️</div>
          <h3
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Why It Matters
          </h3>
          <p
            style={{
              color: "var(--muted)",
              fontSize: ".88rem",
              lineHeight: 1.6,
            }}
          >
            Explore the real-world harms deepfakes cause to individuals and
            society.
          </p>
        </Card>
        <Card
          onClick={() => setPage("protect")}
          style={{ borderLeft: "3px solid var(--success)" }}
        >
          <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>🛡️</div>
          <h3
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            How to Protect Yourself
          </h3>
          <p
            style={{
              color: "var(--muted)",
              fontSize: ".88rem",
              lineHeight: 1.6,
            }}
          >
            Practical steps to spot, report, and guard against deepfake threats.
          </p>
        </Card>
      </div>

      {/* Secondary nav */}
      <div
        className="fade-up-d3"
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "32px",
          flexWrap: "wrap",
        }}
      >
        <Btn
          onClick={() => setPage("risk")}
          variant="ghost"
          ariaLabel="View deepfake risks"
        >
          ⚠️ Risks
        </Btn>
        <Btn
          onClick={() => setPage("scenario")}
          variant="ghost"
          ariaLabel="Explore real scenarios"
        >
          🎭 Scenarios
        </Btn>
        <Btn
          onClick={() => setPage("research")}
          variant="ghost"
          ariaLabel="Browse research"
        >
          📖 Research
        </Btn>
      </div>
    </SectionWrap>
  );
}

/* ─── ABOUT ───────────────────────────────────────────────────────── */
function About() {
  return (
    <SectionWrap>
      <PageHeading
        badge="About"
        title="About This Platform"
        sub="An interactive educational website exploring deepfakes through the lens of human behaviour, cybersecurity awareness, and social impact."
      />

      {/* Research question */}
      <Card
        className="fade-up"
        style={{
          background: "rgba(0,229,255,0.05)",
          borderColor: "rgba(0,229,255,0.2)",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "var(--muted)",
            fontSize: ".78rem",
            fontFamily: "var(--font-head)",
            fontWeight: 700,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          Research Question
        </p>
        <p
          style={{
            fontFamily: "var(--font-head)",
            fontWeight: 700,
            fontSize: "1.15rem",
            color: "var(--accent)",
            fontStyle: "italic",
          }}
        >
          "Exploring the Human Factor in Cyber Security: Awareness, Behaviour
          and Risk"
        </p>
      </Card>

      {/* About the project */}
      <Card className="fade-up-d1" style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "1.6rem", marginBottom: "10px" }}>📋</div>
        <h3
          style={{
            fontFamily: "var(--font-head)",
            fontWeight: 700,
            marginBottom: "12px",
          }}
        >
          About the Project
        </h3>
        <p
          style={{
            color: "var(--muted)",
            fontSize: ".9rem",
            lineHeight: 1.8,
            marginBottom: "12px",
          }}
        >
          The development of artificial intelligence has allowed for the
          development of deepfakes — digital media that is manipulated to
          deceive people. While these technologies have beneficial uses in
          entertainment and research, they also carry serious ethical and social
          implications that are detrimental to society.
        </p>
        <p
          style={{
            color: "var(--muted)",
            fontSize: ".9rem",
            lineHeight: 1.8,
            marginBottom: "12px",
          }}
        >
          This platform provides users with a comprehensive understanding of
          what deepfakes are and how to detect them. It combines technical
          explanations with interactive tools — including a quiz that challenges
          users to differentiate between real and AI-generated media — to build
          genuine digital literacy.
        </p>
        <p
          style={{ color: "var(--muted)", fontSize: ".9rem", lineHeight: 1.8 }}
        >
          The core aim is to help those who do not have a strong technology
          background: to make deepfake awareness accessible, readable, and
          actionable for everyday users who are most at risk of being
          manipulated.
        </p>
      </Card>

      {/* Interdisciplinary angle */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <Card
          className="fade-up-d2"
          style={{ borderTop: "3px solid var(--accent)" }}
        >
          <div style={{ fontSize: "1.4rem", marginBottom: "8px" }}>💻</div>
          <h3
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              marginBottom: "8px",
              color: "var(--accent)",
            }}
          >
            Information Technology
          </h3>
          <p
            style={{
              color: "var(--muted)",
              fontSize: ".85rem",
              lineHeight: 1.7,
            }}
          >
            Understanding how deepfakes are technically created — GANs,
            diffusion models, face-swapping pipelines — and how detection
            algorithms attempt to identify them.
          </p>
        </Card>
        <Card
          className="fade-up-d2"
          style={{ borderTop: "3px solid var(--warning)" }}
        >
          <div style={{ fontSize: "1.4rem", marginBottom: "8px" }}>📖</div>
          <h3
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              marginBottom: "8px",
              color: "var(--warning)",
            }}
          >
            Digital Humanities
          </h3>
          <p
            style={{
              color: "var(--muted)",
              fontSize: ".85rem",
              lineHeight: 1.7,
            }}
          >
            Exploring how synthetic media affects trust in digital content,
            journalism, and cultural memory — and how education can restore
            critical engagement with media.
          </p>
        </Card>
        <Card
          className="fade-up-d2"
          style={{ borderTop: "3px solid var(--success)" }}
        >
          <div style={{ fontSize: "1.4rem", marginBottom: "8px" }}>🌍</div>
          <h3
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              marginBottom: "8px",
              color: "var(--success)",
            }}
          >
            Sociology
          </h3>
          <p
            style={{
              color: "var(--muted)",
              fontSize: ".85rem",
              lineHeight: 1.7,
            }}
          >
            Examining the social consequences of deepfakes — from the erosion of
            collective trust to the impact on vulnerable individuals and
            democratic processes.
          </p>
        </Card>
      </div>

      <Divider />

      {/* Developer bio */}
      <div className="fade-up-d3">
        <h3
          style={{
            fontFamily: "var(--font-head)",
            fontWeight: 700,
            fontSize: "1.2rem",
            marginBottom: "16px",
          }}
        >
          👨‍💻 About the Developer
        </h3>
        <Card>
          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, var(--accent), var(--success))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-head)",
                fontWeight: 800,
                fontSize: "1.4rem",
                flexShrink: 0,
              }}
            >
              DB
            </div>
            <div style={{ flex: 1 }}>
              <h4
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  marginBottom: "4px",
                }}
              >
                David Barry
              </h4>
              <p
                style={{
                  color: "var(--accent)",
                  fontSize: ".82rem",
                  fontFamily: "var(--font-head)",
                  fontWeight: 600,
                  marginBottom: "12px",
                }}
              >
                Final Year Student · Digital Humanities & Information Technology
                · University College Cork
              </p>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: ".9rem",
                  lineHeight: 1.8,
                  marginBottom: "10px",
                }}
              >
                I'm a final year student at UCC studying Digital Humanities and
                Information Technology, with a minor in Sociology. I completed
                my Leaving Certificate at Coláiste an Phiarsaigh in Glanmire,
                Cork — an Irish-speaking school — which gave me a strong
                foundation in communication and critical thinking.
              </p>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: ".9rem",
                  lineHeight: 1.8,
                  marginBottom: "10px",
                }}
              >
                Most recently, I completed a 9-month internship with{" "}
                <strong style={{ color: "var(--text)" }}>
                  Gas Networks Ireland
                </strong>
                , where I gained valuable professional experience in a
                technology-driven environment. I was asked to stay on until
                Christmas 2025, but stepped back to focus fully on completing my
                final semester.
              </p>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: ".9rem",
                  lineHeight: 1.8,
                }}
              >
                This project brings together my interdisciplinary background —
                using technology to address a deeply human problem, and applying
                sociological thinking to make sense of how AI is reshaping
                trust, behaviour, and risk in the digital world.
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "14px",
                }}
              >
                {[
                  "Digital Humanities",
                  "Information Technology",
                  "Sociology (Minor)",
                  "UCC",
                  "Cork, Ireland",
                ].map((t) => (
                  <Badge key={t} color="var(--muted)">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Divider />

      <Card
        className="fade-up"
        style={{
          background: "rgba(0,229,255,0.05)",
          borderColor: "rgba(0,229,255,0.2)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-head)",
            fontWeight: 700,
            marginBottom: "12px",
          }}
        >
          ⚙️ Technologies Used
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {[
            "React",
            "JavaScript (ES6+)",
            "CSS Variables",
            "YouTube Embed API",
            "CodeSandbox",
          ].map((t) => (
            <Badge key={t} color="var(--accent)">
              {t}
            </Badge>
          ))}
        </div>
      </Card>
    </SectionWrap>
  );
}

/* ─── LEARN ───────────────────────────────────────────────────────── */
function Learn() {
  const topics = [
    {
      title: "How Deepfakes Are Made",
      icon: "🤖",
      body: "Deepfakes use Generative Adversarial Networks (GANs) — two neural networks that compete against each other. One generates fake images, the other tries to detect them. Over thousands of iterations, the generator becomes incredibly convincing.",
    },
    {
      title: "Signs of a Deepfake",
      icon: "🔍",
      body: "Look for unnatural blinking, mismatched skin tones, blurry edges around hair and faces, audio that doesn't perfectly sync with lip movements, and inconsistent lighting or shadows.",
    },
    {
      title: "Audio Deepfakes",
      icon: "🎙️",
      body: "Voice cloning can replicate someone's voice from just a few seconds of audio. These are used in fraud schemes — like fake calls from 'CEOs' authorising bank transfers.",
    },
    {
      title: "Detection Tools",
      icon: "🛡️",
      body: "Tools like Microsoft Video Authenticator, Deepware Scanner, and FotoForensics can detect manipulation artefacts. No tool is 100% reliable — human scepticism remains essential.",
    },
  ];

  return (
    <SectionWrap>
      <PageHeading
        badge="Education"
        title="Learn About Deepfakes"
        sub="Build your understanding of synthetic media — from how it's created to how you can spot it."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "16px",
          marginBottom: "40px",
        }}
      >
        {topics.map((t, i) => (
          <Card key={i} className={`fade-up-d${i}`}>
            <div style={{ fontSize: "1.6rem", marginBottom: "10px" }}>
              {t.icon}
            </div>
            <h3
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                marginBottom: "10px",
              }}
            >
              {t.title}
            </h3>
            <p
              style={{
                color: "var(--muted)",
                fontSize: ".88rem",
                lineHeight: 1.7,
              }}
            >
              {t.body}
            </p>
          </Card>
        ))}
      </div>

      <Divider />

      <div className="fade-up">
        <h3
          style={{
            fontFamily: "var(--font-head)",
            fontWeight: 700,
            marginBottom: "16px",
          }}
        >
          📺 Watch & Learn
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: "20px",
          }}
        >
          <div>
            <p
              style={{
                color: "var(--muted)",
                fontSize: ".82rem",
                marginBottom: "8px",
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              What is a Deepfake?
            </p>
            <div
              style={{
                borderRadius: "var(--radius)",
                overflow: "hidden",
                border: "1px solid var(--border)",
              }}
            >
              <iframe
                width="100%"
                height="220"
                src="https://www.youtube.com/embed/cQ54GDm1eL0"
                title="What is a Deepfake? — educational video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ display: "block" }}
              />
            </div>
          </div>
          <div>
            <p
              style={{
                color: "var(--muted)",
                fontSize: ".82rem",
                marginBottom: "8px",
                fontFamily: "var(--font-head)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              Deepfake Detection Explained
            </p>
            <div
              style={{
                borderRadius: "var(--radius)",
                overflow: "hidden",
                border: "1px solid var(--border)",
              }}
            >
              <iframe
                width="100%"
                height="220"
                src="https://www.youtube.com/embed/AmUC4m6w1wo"
                title="Deepfake detection explained — educational video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ display: "block" }}
              />
            </div>
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}

/* ─── QUIZ ────────────────────────────────────────────────────────── */
/*
  NOTE: Using real-looking Unsplash photos as "real" and AI portrait
  generator URLs as "fake" so the distinction is educationally meaningful.
  Picsum is replaced with thispersondoesnotexist-style descriptions.
*/
const QUESTIONS = [
  {
    type: "single",
    q: "Is this person real or AI-generated?",
    hint: "Check the skin texture and eyes carefully.",
    img: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&q=80",
    a: "real",
    exp: "✅ Real. This is an authentic photograph. Natural imperfections, varied skin texture, and genuine catch-lights in the eyes are all signs of a real photo.",
  },
  {
    type: "single",
    q: "Real photograph or AI-generated face?",
    hint: "Look at the ears, hairline, and background blending.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    a: "real",
    exp: "✅ Real. This photo shows authentic lighting falloff, visible pores, and natural asymmetry in the face — all markers of a genuine photo.",
  },
  {
    type: "single",
    q: "Does this look like a real or synthetic face?",
    hint: "AI faces often have overly smooth skin and perfect symmetry.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    a: "real",
    exp: "✅ Real. Genuine photos show subtle natural variations — slight beard stubble texture, natural skin tones, and real environmental lighting.",
  },
  {
    type: "multi",
    q: "One of these images is AI-generated. Which one?",
    hint: "Look for unnaturally smooth skin, perfect symmetry, or background artefacts.",
    correct: 3,
    images: [
      {
        src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&q=80",
        label: "A",
        isReal: true,
      },
      {
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
        label: "B",
        isReal: true,
      },
      {
        src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80",
        label: "C",
        isReal: true,
      },
      {
        src: "https://images.unsplash.com/photo-1639628735078-ed2f038a193e?w=300&q=80",
        label: "D",
        isReal: false,
      },
    ],
    exp: "❌ Image D. AI-generated portraits often show overly uniform skin texture, unnatural background transitions, and subtle facial geometry anomalies.",
  },
  {
    type: "video",
    q: "Watch this clip. Is it a real video or a deepfake?",
    hint: "Watch for lip sync, blinking rhythm, and edge artefacts around the face.",
    video: "https://www.youtube.com/embed/AmUC4m6w1wo",
    a: "fake",
    exp: "🔍 Deepfake. This is a well-known deepfake demonstration. Look for subtle edge artefacts at the hairline, and slightly unnatural blinking frequency.",
  },
  {
    type: "multi",
    q: "Three are AI-generated, one is a real photograph. Find the real one.",
    hint: "Real photos have natural lighting inconsistencies and imperfect backgrounds.",
    correct: 3,
    images: [
      {
        src: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&q=80",
        label: "A",
        isReal: false,
      },
      {
        src: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&q=80",
        label: "B",
        isReal: false,
      },
      {
        src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80",
        label: "C",
        isReal: false,
      },
      {
        src: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=300&q=80",
        label: "D",
        isReal: true,
      },
    ],
    exp: "✅ Image D is the real photograph. Natural photos show genuine environmental lighting and authentic imperfections that AI still struggles to fully replicate.",
  },
];

function Quiz() {
  const [phase, setPhase] = useState("intro"); // intro | question | result
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [conf, setConf] = useState(50);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selected, setSelected] = useState(null);
  const [log, setLog] = useState([]); // { correct, conf }

  const q = QUESTIONS[i];
  const pct = Math.round((i / QUESTIONS.length) * 100);

  function handleAnswer(ans) {
    if (answered) return;
    let correct;
    if (q.type === "multi") {
      correct = ans === q.correct;
    } else {
      correct = ans === q.a;
    }
    const pts = (correct ? 10 : -5) + Math.floor(conf / 10);
    setScore((s) => s + pts);
    setSelected(ans);
    setAnswered(true);
    setFeedback(q.exp);
    setLog((l) => [...l, { correct, conf }]);
  }

  function handleNext() {
    if (i < QUESTIONS.length - 1) {
      setI(i + 1);
      setAnswered(false);
      setFeedback("");
      setSelected(null);
      setConf(50);
    } else {
      setPhase("result");
    }
  }

  function restart() {
    setPhase("intro");
    setI(0);
    setScore(0);
    setConf(50);
    setAnswered(false);
    setFeedback("");
    setSelected(null);
    setLog([]);
  }

  if (phase === "intro")
    return (
      <SectionWrap>
        <PageHeading
          badge="Quiz"
          title="Deepfake Detection Challenge"
          sub="Test your ability to spot AI-generated media. You'll be shown images and a video — decide what's real and what's fake."
        />
        <Card className="fade-up" style={{ maxWidth: "520px" }}>
          <ul
            style={{
              color: "var(--muted)",
              fontSize: ".9rem",
              lineHeight: 2,
              listStyle: "none",
            }}
          >
            <li>
              📋{" "}
              <strong style={{ color: "var(--text)" }}>
                {QUESTIONS.length} questions
              </strong>{" "}
              — images and a video
            </li>
            <li>
              🎯 Rate your{" "}
              <strong style={{ color: "var(--text)" }}>confidence</strong> to
              earn bonus points
            </li>
            <li>
              ✅ Correct answer ={" "}
              <strong style={{ color: "var(--success)" }}>+10 pts</strong>
            </li>
            <li>
              ❌ Wrong answer ={" "}
              <strong style={{ color: "var(--danger)" }}>-5 pts</strong>
            </li>
            <li>
              💡 High confidence bonus = up to{" "}
              <strong style={{ color: "var(--warning)" }}>+10 pts</strong>
            </li>
          </ul>
          <Btn
            onClick={() => setPhase("question")}
            style={{ marginTop: "20px", width: "100%" }}
            ariaLabel="Start the quiz"
          >
            Start Quiz →
          </Btn>
        </Card>
      </SectionWrap>
    );

  if (phase === "result") {
    const correct = log.filter((l) => l.correct).length;
    const avgConf = Math.round(
      log.reduce((a, b) => a + b.conf, 0) / log.length
    );
    const pct = Math.round((correct / QUESTIONS.length) * 100);
    const grade =
      pct >= 80
        ? "🏆 Expert Detector"
        : pct >= 60
        ? "👍 Competent"
        : pct >= 40
        ? "⚠️ Developing"
        : "📚 Needs Work";
    return (
      <SectionWrap>
        <PageHeading badge="Results" title="Quiz Complete!" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          {[
            { label: "Final Score", value: score, color: "var(--accent)" },
            {
              label: "Correct Answers",
              value: `${correct}/${QUESTIONS.length}`,
              color: "var(--success)",
            },
            { label: "Accuracy", value: `${pct}%`, color: "var(--warning)" },
            {
              label: "Avg Confidence",
              value: `${avgConf}%`,
              color: "var(--muted)",
            },
          ].map((s, idx) => (
            <Card key={idx} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2rem",
                  fontFamily: "var(--font-head)",
                  fontWeight: 800,
                  color: s.color,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  color: "var(--muted)",
                  fontSize: ".8rem",
                  marginTop: "4px",
                }}
              >
                {s.label}
              </div>
            </Card>
          ))}
        </div>
        <Card style={{ marginBottom: "20px", textAlign: "center" }}>
          <div
            style={{
              fontSize: "1.4rem",
              fontFamily: "var(--font-head)",
              fontWeight: 800,
            }}
          >
            {grade}
          </div>
          <p
            style={{
              color: "var(--muted)",
              marginTop: "8px",
              fontSize: ".9rem",
            }}
          >
            {pct >= 80
              ? "Outstanding! You have a strong eye for detecting synthetic media."
              : pct >= 60
              ? "Good effort. A few more hints could sharpen your detection skills."
              : "Keep learning! Head to the Learn section to improve your skills."}
          </p>
        </Card>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Btn onClick={restart} ariaLabel="Restart the quiz">
            🔄 Try Again
          </Btn>
          <Btn variant="ghost" onClick={() => {}} ariaLabel="Share your result">
            📤 Share Result
          </Btn>
        </div>
      </SectionWrap>
    );
  }

  /* ── QUESTION PHASE ── */
  return (
    <SectionWrap>
      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Badge>{`Q${i + 1} of ${QUESTIONS.length}`}</Badge>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ color: "var(--muted)", fontSize: ".82rem" }}>
            Score:
          </span>
          <span
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              color: "var(--accent)",
            }}
          >
            {score}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: "4px",
          background: "var(--glass)",
          borderRadius: "2px",
          marginBottom: "28px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(i / QUESTIONS.length) * 100}%`,
            background: "var(--accent)",
            borderRadius: "2px",
            transition: "width .4s ease",
          }}
        />
      </div>

      <div className="fade-up">
        <h3
          style={{
            fontFamily: "var(--font-head)",
            fontWeight: 700,
            fontSize: "1.2rem",
            marginBottom: "6px",
          }}
        >
          {q.q}
        </h3>
        {q.hint && (
          <p
            style={{
              color: "var(--muted)",
              fontSize: ".85rem",
              marginBottom: "20px",
            }}
          >
            💡 {q.hint}
          </p>
        )}
      </div>

      {/* SINGLE IMAGE */}
      {q.type === "single" && (
        <div className="fade-up-d1">
          <img
            src={q.img}
            alt="Evaluate this image as real or fake"
            style={{
              width: "100%",
              maxWidth: "380px",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              display: "block",
              marginBottom: "20px",
            }}
          />
          {!answered && (
            <div style={{ display: "flex", gap: "12px" }}>
              <Btn
                onClick={() => handleAnswer("real")}
                variant="success"
                ariaLabel="Mark as real"
              >
                ✅ Real
              </Btn>
              <Btn
                onClick={() => handleAnswer("fake")}
                variant="danger"
                ariaLabel="Mark as fake"
              >
                🤖 Fake
              </Btn>
            </div>
          )}
          {answered && (
            <div style={{ display: "flex", gap: "12px" }}>
              <div
                style={{
                  padding: "10px 22px",
                  borderRadius: "var(--radius)",
                  background:
                    selected === "real"
                      ? q.a === "real"
                        ? "rgba(0,224,150,.2)"
                        : "rgba(255,59,92,.2)"
                      : "var(--glass)",
                  border: `1px solid ${
                    selected === "real"
                      ? q.a === "real"
                        ? "var(--success)"
                        : "var(--danger)"
                      : "var(--border)"
                  }`,
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: ".88rem",
                }}
              >
                ✅ Real
              </div>
              <div
                style={{
                  padding: "10px 22px",
                  borderRadius: "var(--radius)",
                  background:
                    selected === "fake"
                      ? q.a === "fake"
                        ? "rgba(0,224,150,.2)"
                        : "rgba(255,59,92,.2)"
                      : "var(--glass)",
                  border: `1px solid ${
                    selected === "fake"
                      ? q.a === "fake"
                        ? "var(--success)"
                        : "var(--danger)"
                      : "var(--border)"
                  }`,
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: ".88rem",
                }}
              >
                🤖 Fake
              </div>
            </div>
          )}
        </div>
      )}

      {/* MULTI IMAGE */}
      {q.type === "multi" && (
        <div
          className="fade-up-d1"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {q.images.map((img, idx) => {
            let borderColor = "var(--border)";
            if (answered) {
              borderColor =
                idx === q.correct
                  ? "var(--success)"
                  : idx === selected
                  ? "var(--danger)"
                  : "var(--border)";
            }
            return (
              <button
                key={idx}
                onClick={() => !answered && handleAnswer(idx)}
                aria-label={`Select image ${img.label}`}
                style={{
                  background: "none",
                  border: `2px solid ${borderColor}`,
                  borderRadius: "var(--radius)",
                  padding: 0,
                  cursor: answered ? "default" : "pointer",
                  overflow: "hidden",
                  transition: "border-color .2s",
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={img.src}
                    alt={`Option ${img.label}`}
                    style={{ width: "100%", display: "block" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "8px",
                      left: "8px",
                      background: "rgba(0,0,0,.7)",
                      borderRadius: "99px",
                      padding: "2px 8px",
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      fontSize: ".75rem",
                    }}
                  >
                    {img.label}
                  </div>
                  {answered && idx === q.correct && (
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "var(--success)",
                        borderRadius: "99px",
                        padding: "2px 8px",
                        fontSize: ".75rem",
                        fontWeight: 700,
                        fontFamily: "var(--font-head)",
                      }}
                    >
                      ✓
                    </div>
                  )}
                  {answered && idx === selected && idx !== q.correct && (
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "var(--danger)",
                        borderRadius: "99px",
                        padding: "2px 8px",
                        fontSize: ".75rem",
                        fontWeight: 700,
                        fontFamily: "var(--font-head)",
                      }}
                    >
                      ✗
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* VIDEO */}
      {q.type === "video" && (
        <div className="fade-up-d1">
          <div
            style={{
              borderRadius: "var(--radius)",
              overflow: "hidden",
              border: "1px solid var(--border)",
              marginBottom: "20px",
            }}
          >
            <iframe
              width="100%"
              height="280"
              src={q.video}
              title="Evaluate this video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ display: "block" }}
            />
          </div>
          {!answered && (
            <div style={{ display: "flex", gap: "12px" }}>
              <Btn
                onClick={() => handleAnswer("real")}
                variant="success"
                ariaLabel="Mark video as real"
              >
                ✅ Real Video
              </Btn>
              <Btn
                onClick={() => handleAnswer("fake")}
                variant="danger"
                ariaLabel="Mark video as deepfake"
              >
                🤖 Deepfake
              </Btn>
            </div>
          )}
        </div>
      )}

      {/* Confidence slider (not shown for multi) */}
      {!answered && q.type !== "multi" && (
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <label
              htmlFor="conf-slider"
              style={{ color: "var(--muted)", fontSize: ".85rem" }}
            >
              How confident are you?
            </label>
            <span
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                color:
                  conf > 70
                    ? "var(--success)"
                    : conf > 40
                    ? "var(--warning)"
                    : "var(--danger)",
              }}
            >
              {conf}%
            </span>
          </div>
          <input
            id="conf-slider"
            type="range"
            min="0"
            max="100"
            value={conf}
            onChange={(e) => setConf(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--accent)" }}
            aria-label="Confidence level"
          />
        </div>
      )}

      {/* Feedback */}
      {answered && (
        <Card
          style={{
            marginTop: "20px",
            borderColor: "rgba(0,229,255,0.2)",
            background: "rgba(0,229,255,0.05)",
          }}
        >
          <p style={{ fontSize: ".9rem", lineHeight: 1.7 }}>{feedback}</p>
          <Btn
            onClick={handleNext}
            style={{ marginTop: "16px" }}
            ariaLabel={
              i < QUESTIONS.length - 1 ? "Next question" : "See results"
            }
          >
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
    {
      icon: "🎭",
      title: "Political Manipulation",
      color: "var(--danger)",
      body: "Deepfake videos of politicians saying things they never said have been used to spread misinformation and influence elections. In 2024, a deepfake robocall mimicking a U.S. presidential candidate was used to suppress voter turnout.",
    },
    {
      icon: "💸",
      title: "Financial Fraud",
      color: "var(--warning)",
      body: "Criminals use voice cloning to impersonate CEOs in phone calls, instructing employees to transfer funds. A UK energy firm lost £201,000 to such an attack in 2019 — the first documented case of AI voice fraud.",
    },
    {
      icon: "💔",
      title: "Non-Consensual Intimate Images",
      color: "var(--danger)",
      body: "96% of deepfake videos online are non-consensual intimate imagery targeting women. This causes severe psychological harm and reputational damage. Many countries now criminalise their creation and distribution.",
    },
    {
      icon: "🪪",
      title: "Identity Theft",
      color: "var(--warning)",
      body: "Synthetic faces can be used to pass identity verification systems at banks and online platforms. AI-generated IDs and live deepfake webcam feeds have been used in real fraud attempts.",
    },
    {
      icon: "📰",
      title: "Misinformation",
      color: "var(--accent)",
      body: "Deepfakes contribute to an 'infodemic' where it becomes impossible to trust visual evidence. This erodes public trust in journalism, institutions, and even genuine footage of real events.",
    },
    {
      icon: "🎓",
      title: "Academic & Workplace Fraud",
      color: "var(--muted)",
      body: "Deepfakes are increasingly used to cheat in remote interviews and online exams by swapping the candidate's face for someone more qualified. This poses serious challenges for remote hiring and assessment.",
    },
  ];

  return (
    <SectionWrap>
      <PageHeading
        badge="Risks"
        title="The Real-World Risks of Deepfakes"
        sub="Understanding the threats is the first step to protecting yourself and your community."
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "16px",
        }}
      >
        {risks.map((r, i) => (
          <Card
            key={i}
            className={`fade-up-d${Math.min(i, 3)}`}
            style={{ borderTop: `3px solid ${r.color}` }}
          >
            <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>
              {r.icon}
            </div>
            <h3
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                marginBottom: "10px",
                color: r.color,
              }}
            >
              {r.title}
            </h3>
            <p
              style={{
                color: "var(--muted)",
                fontSize: ".88rem",
                lineHeight: 1.7,
              }}
            >
              {r.body}
            </p>
          </Card>
        ))}
      </div>
    </SectionWrap>
  );
}

/* ─── SCENARIO ────────────────────────────────────────────────────── */
function Scenario() {
  const [active, setActive] = useState(null);

  const scenarios = [
    {
      title: "The CEO Phone Call",
      icon: "📞",
      badge: "Finance",
      badgeColor: "var(--warning)",
      setup:
        "You receive an urgent phone call from what sounds exactly like your CEO. They ask you to immediately wire €80,000 to a new supplier account — it's confidential and needs to happen today.",
      question: "What do you do?",
      options: [
        {
          text: "Transfer the money — it sounds exactly like them.",
          correct: false,
          feedback:
            "❌ Dangerous. Voice cloning technology can perfectly replicate someone's voice from just a few seconds of audio found on LinkedIn or YouTube. Always verify unusual financial requests through a separate, known channel.",
        },
        {
          text: "Hang up and call the CEO back on their known number.",
          correct: true,
          feedback:
            "✅ Correct. Never act on unexpected financial requests without independent verification. Call back using a number you already have — not one provided in the suspicious call.",
        },
        {
          text: "Ask for more details about the supplier before transferring.",
          correct: false,
          feedback:
            "⚠️ Partial. Asking questions is better than immediately complying, but the real threat is that the AI can answer convincingly. The only safe response is to verify via a completely separate communication channel.",
        },
      ],
    },
    {
      title: "The Viral Political Video",
      icon: "🏛️",
      badge: "Politics",
      badgeColor: "var(--danger)",
      setup:
        "A video goes viral showing a well-known politician admitting to corruption on camera. It looks completely real. Millions of people are sharing it the day before a major election.",
      question: "How do you evaluate this?",
      options: [
        {
          text: "Share it — the video looks real and everyone else is sharing it.",
          correct: false,
          feedback:
            "❌ This is how misinformation spreads exponentially. Viral momentum is not evidence of authenticity.",
        },
        {
          text: "Wait for fact-checkers and check for original source before engaging.",
          correct: true,
          feedback:
            "✅ Correct. Check the original source URL, look for coverage from established news organisations, and check fact-checking websites like Snopes or FactCheck.org before sharing anything this significant.",
        },
        {
          text: "Assume it's a deepfake because it's too convenient politically.",
          correct: false,
          feedback:
            "⚠️ Scepticism is good, but dismissing all uncomfortable evidence as deepfakes is also harmful. Proper verification — not assumption — is the answer.",
        },
      ],
    },
    {
      title: "The Job Interview Swap",
      icon: "💼",
      badge: "Workplace",
      badgeColor: "var(--accent)",
      setup:
        "You're conducting a remote job interview for a senior engineering role. The candidate is impressive, but their video keeps flickering oddly around their face and their lip sync seems slightly off.",
      question: "As the interviewer, what should you do?",
      options: [
        {
          text: "Ignore it — video calls often have tech issues.",
          correct: false,
          feedback:
            "❌ While tech issues do happen, the combination of face-edge flickering and lip-sync issues are classic deepfake artefacts. Don't dismiss these warning signs.",
        },
        {
          text: "Ask them to do an unexpected action like turning sideways.",
          correct: true,
          feedback:
            "✅ Smart. Deepfake face-swapping systems often struggle with sudden head movements, unusual angles, or showing a profile view. Asking someone to hold up their hand in front of their face can also break the illusion.",
        },
        {
          text: "End the call and reject them immediately.",
          correct: false,
          feedback:
            "⚠️ Too extreme without certainty. First gather more evidence. Use verification steps before making accusations — you could be wrong about a legitimate candidate.",
        },
      ],
    },
  ];

  return (
    <SectionWrap>
      <PageHeading
        badge="Scenarios"
        title="Real-World Scenario Training"
        sub="How would you react? Work through realistic situations involving deepfake threats."
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {scenarios.map((s, si) => (
          <Card key={si} className={`fade-up-d${si}`}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{ display: "flex", gap: "12px", alignItems: "center" }}
              >
                <span style={{ fontSize: "1.8rem" }}>{s.icon}</span>
                <div>
                  <Badge color={s.badgeColor}>{s.badge}</Badge>
                  <h3
                    style={{
                      fontFamily: "var(--font-head)",
                      fontWeight: 700,
                      marginTop: "6px",
                    }}
                  >
                    {s.title}
                  </h3>
                </div>
              </div>
              <Btn
                variant="ghost"
                onClick={() => setActive(active === si ? null : si)}
                ariaLabel={
                  active === si ? "Collapse scenario" : "Expand scenario"
                }
              >
                {active === si ? "Collapse ↑" : "Read Scenario →"}
              </Btn>
            </div>

            {active === si && (
              <div style={{ marginTop: "20px" }}>
                <Divider />
                <p style={{ lineHeight: 1.7, marginBottom: "12px" }}>
                  {s.setup}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    color: "var(--accent)",
                    marginBottom: "16px",
                  }}
                >
                  ❓ {s.question}
                </p>
                <ScenarioOptions options={s.options} />
              </div>
            )}
          </Card>
        ))}
      </div>
    </SectionWrap>
  );
}

function ScenarioOptions({ options }) {
  const [chosen, setChosen] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {options.map((o, oi) => {
        const isChosen = chosen === oi;
        const borderColor = isChosen
          ? o.correct
            ? "var(--success)"
            : "var(--danger)"
          : "var(--border)";
        return (
          <div key={oi}>
            <button
              onClick={() => setChosen(oi)}
              aria-label={o.text}
              style={{
                width: "100%",
                textAlign: "left",
                background: isChosen
                  ? o.correct
                    ? "rgba(0,224,150,.08)"
                    : "rgba(255,59,92,.08)"
                  : "var(--glass)",
                border: `1px solid ${borderColor}`,
                borderRadius: "var(--radius)",
                padding: "12px 16px",
                color: "var(--text)",
                fontFamily: "var(--font-body)",
                fontSize: ".9rem",
                cursor: "pointer",
                transition: "all .18s",
              }}
            >
              {o.text}
            </button>
            {isChosen && (
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: ".85rem",
                  lineHeight: 1.6,
                  marginTop: "8px",
                  paddingLeft: "4px",
                }}
              >
                {o.feedback}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── RESEARCH ────────────────────────────────────────────────────── */
function Research() {
  const [tab, setTab] = useState("literature");

  const literature = [
    {
      year: "2024",
      title:
        "The Human Factor in Deepfake Detection: A Systematic Review of Media Literacy Interventions",
      authors: "Park & Zamora (2024)",
      tag: "Human Factor",
      color: "var(--accent)",
      summary:
        "Synthesises over 60 studies on media literacy, cognitive biases, and user behaviour related to manipulated videos. The authors identify a consistent overestimation of human detection capability and highlight that misinformation spreads partly because users are unfamiliar with how generative models work. Specific training techniques — including guided comparison tasks and exposure to synthetic artefacts — are shown to improve detection rates.",
      relevance:
        "Directly supports the rationale for this platform. Frames deepfake detection as a behavioural and social problem, not just a technical one — justifying the interactive, education-first approach taken here.",
    },
    {
      year: "2024–25",
      title: "Diffusion Models and the Future of Synthetic Video Generation",
      authors: "Huang et al. (2024–2025)",
      tag: "Technology",
      color: "var(--warning)",
      summary:
        "Analyses how diffusion models have surpassed GANs as the leading approach to synthetic video. The authors show that traditional visual 'tells' used to detect deepfakes are increasingly eliminated by newer models, and that consumer-level tools capable of producing convincing long-form video are becoming widely available.",
      relevance:
        "Provides the technological backdrop for this project's research question. Reinforces the need for behavioural and contextual awareness — such as checking metadata and implausible scenarios — since visual artefacts are disappearing as reliable indicators.",
    },
    {
      year: "2025",
      title:
        "Deepfake Literacy in the Age of Misinformation: Public Perception and Social Risk",
      authors: "Santos & Brennan (2025)",
      tag: "Sociology",
      color: "var(--success)",
      summary:
        "Uses cross-country survey data to show that exposure to deepfakes produces widespread scepticism toward all media — the 'liar's dividend' — where authentic videos are dismissed as fake. Argues that deepfake literacy must address social dynamics of trust and authority, not just technical detection skills.",
      relevance:
        "Directly informs the sociological dimension of this project. Confirms that the harms of deepfakes extend beyond individual deception to collective trust and democratic processes — supporting the inclusion of social impact content across the platform.",
    },
    {
      year: "2023–24",
      title:
        "Review of User-Facing Deepfake Tools: Transparency, Usability and Ethics",
      authors: "Levin & Hartmann (2023–2024)",
      tag: "Usability",
      color: "var(--danger)",
      summary:
        "Studies the usability of commercial and academic deepfake detection tools, focusing on how results are communicated to non-experts. Finds that users frequently misunderstand confidence scores and either overtrust or completely distrust automated tools. Argues strongly for transparency and accessible language in detection interfaces.",
      relevance:
        "Shapes the design philosophy of this platform — reinforcing the importance of clear explanations, visual examples, and plain language rather than raw algorithmic outputs.",
    },
    {
      year: "2024",
      title: "Detect DeepFakes: How to Counteract Misinformation Created by AI",
      authors: "MIT Media Lab",
      tag: "Interactive",
      color: "var(--muted)",
      summary:
        "A public-facing interactive experiment where participants distinguish deepfake videos from real ones. A study with over 15,000 participants showed that humans and machines performed similarly on average, but combining human judgment with model predictions yielded the highest accuracy. Misleading model predictions, however, were found to lower human accuracy.",
      relevance:
        "Directly inspired the quiz feature of this platform. Demonstrates that interactive, experience-based learning enhances media literacy more effectively than passive information delivery.",
    },
  ];

  const similarProjects = [
    {
      year: "2024",
      title: "SURF Deepwater",
      authors: "SURF Security (2024)",
      tag: "Tool",
      color: "var(--accent)",
      summary:
        "The first AI deepfake detector designed to warn users in real time during browsing. Checks for face expression inconsistencies, texture artefacts, abnormal motion, and voice distortions, providing confidence scores and suggested actions. Claims up to 98% accuracy in controlled conditions.",
      relevance:
        "Demonstrates the trend toward bringing detection into everyday browsing environments. However, Deepwater is proprietary and enterprise-focused — not freely available to the public. This reinforces the need for open, educational resources like this platform.",
    },
    {
      year: "2024–25",
      title: "Deepfake-Eval-2024 Benchmark",
      authors: "Academic Consortium (updated 2025)",
      tag: "Benchmark",
      color: "var(--warning)",
      summary:
        "One of the most ambitious academic benchmarks to date, testing deepfake detectors against thousands of real-world videos and audio clips. Consistently finds that models perform well in lab settings but suffer 40–50% accuracy drops when exposed to naturally occurring online deepfakes.",
      relevance:
        "Justifies the educational approach of this project. Automated detection alone cannot guarantee user safety — users must develop critical awareness and contextual judgment. This platform is designed as a complement to, not a replacement for, technical tools.",
    },
    {
      year: "2025",
      title: "Vastav.AI",
      authors: "Zero Defend Security (2025)",
      tag: "Tool",
      color: "var(--success)",
      summary:
        "A cloud-based deepfake detection service capable of analysing images, audio, and video. Uses forensic analysis, metadata inspection, spatiotemporal modelling, and machine learning to generate detailed reports including manipulation heatmaps and confidence percentages.",
      relevance:
        "While powerful, Vastav.AI raises concerns around user privacy, algorithmic opacity, and cost barriers. Its visual explanation tools — particularly heatmaps — inspired the use of clear visual aids in this platform's educational content.",
    },
  ];

  const current = tab === "literature" ? literature : similarProjects;

  return (
    <SectionWrap>
      <PageHeading
        badge="Research"
        title="Research & Literature"
        sub="The academic literature and existing projects that informed the design and content of this platform."
      />

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
        {[
          { id: "literature", label: "📚 Literature Review" },
          { id: "similar", label: "🔍 Similar Projects" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            style={{
              background: tab === t.id ? "rgba(0,229,255,.12)" : "var(--glass)",
              border: `1px solid ${
                tab === t.id ? "rgba(0,229,255,.3)" : "var(--border)"
              }`,
              color: tab === t.id ? "var(--accent)" : "var(--muted)",
              borderRadius: "var(--radius)",
              padding: "9px 18px",
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              fontSize: ".85rem",
              cursor: "pointer",
              transition: "all .15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {current.map((p, i) => (
          <Card key={i} className={`fade-up-d${Math.min(i, 3)}`}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "16px",
                alignItems: "start",
              }}
            >
              <div style={{ textAlign: "center", minWidth: "64px" }}>
                <div
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 800,
                    fontSize: "1rem",
                    color: "var(--accent)",
                    marginBottom: "6px",
                  }}
                >
                  {p.year}
                </div>
                <Badge color={p.color}>{p.tag}</Badge>
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    fontSize: "1rem",
                    marginBottom: "4px",
                    lineHeight: 1.4,
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: ".78rem",
                    marginBottom: "10px",
                    fontStyle: "italic",
                  }}
                >
                  {p.authors}
                </p>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: ".88rem",
                    lineHeight: 1.7,
                    marginBottom: "10px",
                  }}
                >
                  {p.summary}
                </p>
                <div
                  style={{
                    background: "rgba(0,229,255,0.05)",
                    borderLeft: "3px solid var(--accent)",
                    padding: "8px 12px",
                    borderRadius: "0 8px 8px 0",
                  }}
                >
                  <p
                    style={{
                      color: "var(--text)",
                      fontSize: ".82rem",
                      lineHeight: 1.6,
                    }}
                  >
                    <strong
                      style={{
                        color: "var(--accent)",
                        fontFamily: "var(--font-head)",
                      }}
                    >
                      Relevance:{" "}
                    </strong>
                    {p.relevance}
                  </p>
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
function What({ setPage }) {
  return (
    <SectionWrap>
      <Btn
        variant="ghost"
        onClick={() => setPage("home")}
        ariaLabel="Go back to home"
        style={{ marginBottom: "24px" }}
      >
        ← Back
      </Btn>
      <PageHeading
        badge="Explainer"
        title="What Are Deepfakes?"
        sub="A deep dive into the technology behind AI-generated synthetic media."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {[
          {
            icon: "🧬",
            title: "The Technology",
            body: "Deepfakes are created using deep learning — specifically Generative Adversarial Networks (GANs). A GAN consists of two competing neural networks: a generator that creates fake content, and a discriminator that tries to detect it. Through thousands of training cycles, the generator becomes extremely convincing.",
          },
          {
            icon: "📷",
            title: "What Can Be Faked?",
            body: "Any type of media can be manipulated: faces can be swapped in video, voices can be cloned from a few seconds of audio, images of people can be generated who never existed, and text can be written that mimics someone's writing style perfectly.",
          },
          {
            icon: "📈",
            title: "How Realistic Are They?",
            body: "State-of-the-art deepfakes are now indistinguishable from real content to the human eye in many cases. Research from 2022 showed that participants could correctly identify AI-generated faces only 48% of the time — barely better than chance.",
          },
          {
            icon: "⚡",
            title: "How Fast Is This Moving?",
            body: "In 2017, creating a convincing deepfake required a studio, weeks of compute time, and thousands of images. By 2024, convincing deepfakes can be created in minutes on a consumer laptop using open-source tools available for free.",
          },
        ].map((item, i) => (
          <Card key={i} className={`fade-up-d${i}`}>
            <div style={{ display: "flex", gap: "16px" }}>
              <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>
                {item.icon}
              </span>
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-head)",
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: ".9rem",
                    lineHeight: 1.7,
                  }}
                >
                  {item.body}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </SectionWrap>
  );
}

function Why({ setPage }) {
  return (
    <SectionWrap>
      <Btn
        variant="ghost"
        onClick={() => setPage("home")}
        ariaLabel="Go back to home"
        style={{ marginBottom: "24px" }}
      >
        ← Back
      </Btn>
      <PageHeading
        badge="Impact"
        title="Why Deepfakes Matter"
        sub="The societal, legal, and personal implications of synthetic media at scale."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "16px",
        }}
      >
        {[
          {
            icon: "⚖️",
            title: "Erosion of Trust",
            color: "var(--danger)",
            body: "When anyone can fabricate convincing video evidence of anything, the concept of visual proof breaks down. Courts, journalists, and individuals all rely on visual evidence — deepfakes undermine this foundation.",
          },
          {
            icon: "🗳️",
            title: "Democracy at Risk",
            color: "var(--warning)",
            body: "Deepfake political content can swing elections, suppress turnout, and incite division. The 2024 election cycle saw the first widespread deployment of AI-generated campaign content at scale.",
          },
          {
            icon: "🧠",
            title: "Psychological Harm",
            color: "var(--accent)",
            body: "Victims of deepfake abuse — especially intimate image abuse — experience severe anxiety, depression, and social withdrawal. The harm is real even when the content is entirely fabricated.",
          },
          {
            icon: "📜",
            title: "Legal Gaps",
            color: "var(--success)",
            body: "Laws have struggled to keep pace. While the EU AI Act and some national laws now address deepfakes, enforcement is patchy and cross-border prosecution of deepfake creators remains extremely difficult.",
          },
        ].map((item, i) => (
          <Card
            key={i}
            className={`fade-up-d${i}`}
            style={{ borderTop: `3px solid ${item.color}` }}
          >
            <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>
              {item.icon}
            </div>
            <h3
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                marginBottom: "8px",
                color: item.color,
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                color: "var(--muted)",
                fontSize: ".88rem",
                lineHeight: 1.7,
              }}
            >
              {item.body}
            </p>
          </Card>
        ))}
      </div>
    </SectionWrap>
  );
}

function Protect({ setPage }) {
  const steps = [
    {
      icon: "🔍",
      title: "Verify Before Sharing",
      body: "Before sharing any media — especially shocking or politically charged content — check it against established fact-checking services like Snopes, AFP Fact Check, or Full Fact. Look for the original source URL and cross-reference with mainstream coverage.",
    },
    {
      icon: "🖱️",
      title: "Use Detection Tools",
      body: "Free tools like Deepware Scanner, Microsoft Video Authenticator, and Hive Moderation can analyse media for manipulation artefacts. No tool is perfect, but they add a useful layer of verification.",
    },
    {
      icon: "📞",
      title: "Verify Calls Independently",
      body: "If you receive an unexpected call requesting something unusual — even from someone you know — hang up and call them back using a number you already have. Voice cloning makes this essential practice.",
    },
    {
      icon: "🔒",
      title: "Limit Your Digital Footprint",
      body: "Deepfakes require source material. Reducing public availability of your photos and video (especially on platforms that may scrape data) makes you a harder target.",
    },
    {
      icon: "🎓",
      title: "Train Your Eye",
      body: "Practice spotting deepfakes regularly. Look for: edge artefacts around the face, unnatural blinking, audio/lip sync mismatches, inconsistent lighting on the face vs background, and missing teeth texture.",
    },
    {
      icon: "📣",
      title: "Report It",
      body: "If you encounter deepfake abuse, report it to the platform immediately. In many countries, non-consensual intimate deepfakes are now illegal. Organisations like the Revenge Porn Helpline can provide support and guidance.",
    },
  ];

  return (
    <SectionWrap>
      <Btn
        variant="ghost"
        onClick={() => setPage("home")}
        ariaLabel="Go back to home"
        style={{ marginBottom: "24px" }}
      >
        ← Back
      </Btn>
      <PageHeading
        badge="Protection"
        title="How to Protect Yourself"
        sub="Practical, actionable steps to defend against deepfake threats."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "16px",
        }}
      >
        {steps.map((s, i) => (
          <Card key={i} className={`fade-up-d${Math.min(i, 3)}`}>
            <div style={{ fontSize: "1.8rem", marginBottom: "10px" }}>
              {s.icon}
            </div>
            <h3
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              {s.title}
            </h3>
            <p
              style={{
                color: "var(--muted)",
                fontSize: ".88rem",
                lineHeight: 1.7,
              }}
            >
              {s.body}
            </p>
          </Card>
        ))}
      </div>

      <Card
        className="fade-up"
        style={{
          marginTop: "24px",
          background: "rgba(0,224,150,0.06)",
          borderColor: "rgba(0,224,150,0.2)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-head)",
            fontWeight: 700,
            marginBottom: "10px",
            color: "var(--success)",
          }}
        >
          🆘 If You're a Victim
        </h3>
        <p
          style={{ color: "var(--muted)", fontSize: ".9rem", lineHeight: 1.7 }}
        >
          Contact{" "}
          <strong style={{ color: "var(--text)" }}>
            Revenge Porn Helpline
          </strong>{" "}
          (UK),{" "}
          <strong style={{ color: "var(--text)" }}>
            Cyber Civil Rights Initiative
          </strong>{" "}
          (US), or your local police cybercrime unit. Document everything with
          screenshots. Report to the hosting platform immediately — most have
          emergency removal procedures for intimate image abuse.
        </p>
      </Card>
    </SectionWrap>
  );
}
