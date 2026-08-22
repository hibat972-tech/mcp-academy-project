import { useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  Terminal, ListChecks, CheckCircle2, Trash2, PencilLine, Plus,
  Download, GitBranch, GraduationCap, Package, FileJson, ChevronRight,
  Search, BookOpen,
} from "lucide-react";

/* ---------------------------------------------------------------
   mcp-academy-project — site
   Theme: chalkboard meets terminal. This is a learning exercise
   (NextFlows Academy) that happens to be a real MCP server, so the
   design borrows the schoolroom (chalk, hand-drawn rules, tabs like
   index cards) and the protocol (monospace, JSON request/response).
--------------------------------------------------------------- */

const TOOLS = [
  {
    id: "add_task",
    icon: Plus,
    title: "add_task",
    desc: "Create a new task with a title, priority, and deadline. Saved straight to data/todos.json.",
    request: { title: "Write MCP client", priority: "high", deadline: "2026-08-30" },
  },
  {
    id: "list_tasks",
    icon: ListChecks,
    title: "list_tasks",
    desc: "List open tasks, sorted by deadline and priority. Takes an optional deadline filter.",
    request: { before: "2026-09-01" },
  },
  {
    id: "search_tasks",
    icon: Search,
    title: "search_tasks",
    desc: "Search tasks using flexible keyword matching against their titles.",
    request: { query: "schema" },
  },
  {
    id: "complete_task",
    icon: CheckCircle2,
    title: "complete_task",
    desc: "Mark an existing task as done, by its ID.",
    request: { id: "" },
  },
  {
    id: "update_task",
    icon: PencilLine,
    title: "update_task",
    desc: "Update one or more fields — title, priority, deadline — on an existing task, by its ID.",
    request: { id: "", priority: "medium" },
  },
  {
    id: "delete_task",
    icon: Trash2,
    title: "delete_task",
    desc: "Delete an existing task, by its ID.",
    request: { id: "" },
  },
  {
    id: "generate_study_plan",
    icon: BookOpen,
    title: "generate_study_plan",
    desc: "Builds a personalized, realistic study plan from the student's existing open tasks.",
    request: { hours_per_day: 2 },
  },
];

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

  .mcp-root {
    --board: #17271F;
    --board-2: #1E332A;
    --chalk: #F1EDE2;
    --chalk-dim: #B9C4BB;
    --sage: #7FA98F;
    --yellow: #E4C368;
    --red: #D9857A;
    --line: rgba(241,237,226,0.16);
    font-family: 'IBM Plex Sans', sans-serif;
    background: var(--board);
    color: var(--chalk);
    min-height: 100%;
    position: relative;
    isolation: isolate;
  }
  .mcp-root::before{
    content:"";
    position:absolute; inset:0;
    background-image:
      radial-gradient(rgba(241,237,226,0.035) 1px, transparent 1px);
    background-size: 3px 3px;
    pointer-events:none;
    z-index:0;
  }
  .mcp-mono { font-family: 'IBM Plex Mono', monospace; }
  .mcp-container { max-width: 920px; margin: 0 auto; padding: 0 28px; position:relative; z-index:1; }

  .mcp-nav {
    border-bottom: 1px solid var(--line);
    position: sticky; top:0; z-index: 20;
    background: var(--board);
  }
  .mcp-nav-row { display:flex; align-items:center; justify-content:space-between; padding: 18px 0; }
  .mcp-brand { display:flex; align-items:center; gap:10px; }
  .mcp-brand-mark {
    width: 30px; height:30px; border-radius:4px;
    border: 1.5px dashed var(--sage);
    display:flex; align-items:center; justify-content:center;
    color: var(--yellow);
  }
  .mcp-brand-text { font-size: 14px; letter-spacing: 0.02em; }
  .mcp-brand-text b { color: var(--yellow); }

  .mcp-tabs { display:flex; gap:4px; }
  .mcp-tab {
    font-family:'IBM Plex Mono', monospace;
    font-size: 13px;
    padding: 7px 14px;
    border: 1px solid transparent;
    border-bottom: none;
    color: var(--chalk-dim);
    background: transparent;
    cursor: pointer;
    border-radius: 5px 5px 0 0;
    transition: color .15s ease, background .15s ease;
  }
  .mcp-tab:hover { color: var(--chalk); }
  .mcp-tab.active {
    color: var(--yellow);
    border-color: var(--line);
    background: var(--board-2);
  }

  .mcp-section { padding: 64px 0; border-bottom: 1px solid var(--line); }
  .mcp-section:last-child { border-bottom: none; }
  .mcp-eyebrow {
    font-family:'IBM Plex Mono', monospace;
    font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em;
    color: var(--sage);
    margin: 0 0 14px 0;
  }
  .mcp-h1 { font-size: 42px; line-height: 1.15; margin: 0 0 18px 0; font-weight: 600; }
  .mcp-h1 .accent { color: var(--yellow); }
  .mcp-h2 { font-size: 24px; margin: 0 0 8px 0; font-weight: 600; }
  .mcp-lede { font-size: 17px; line-height: 1.65; color: var(--chalk-dim); max-width: 60ch; margin: 0 0 28px 0; }
  .mcp-p { font-size: 15px; line-height: 1.7; color: var(--chalk-dim); max-width: 62ch; }

  .mcp-btn {
    font-family:'IBM Plex Mono', monospace;
    font-size: 13px;
    display:inline-flex; align-items:center; gap:8px;
    padding: 10px 18px;
    border-radius: 5px;
    border: 1px solid var(--yellow);
    color: var(--board);
    background: var(--yellow);
    cursor: pointer;
    text-decoration:none;
    transition: transform .12s ease, opacity .12s ease;
  }
  .mcp-btn:hover { opacity: 0.88; }
  .mcp-btn:active { transform: translateY(1px); }
  .mcp-btn.ghost {
    background: transparent; color: var(--chalk);
    border-color: var(--line);
  }
  .mcp-btn.ghost:hover { border-color: var(--sage); color: var(--sage); }

  .mcp-frame {
    border: 1.5px dashed var(--line);
    border-radius: 8px;
    background: var(--board-2);
    overflow: hidden;
  }
  .mcp-frame-head {
    display:flex; align-items:center; gap:8px;
    padding: 10px 14px;
    border-bottom: 1px solid var(--line);
    font-family:'IBM Plex Mono', monospace;
    font-size: 12px;
    color: var(--chalk-dim);
  }
  .mcp-dot { width:8px; height:8px; border-radius:50%; background: var(--line); }
  .mcp-frame-body { padding: 18px 16px; font-family:'IBM Plex Mono', monospace; font-size: 13px; line-height:1.7; }
  .mcp-tag-req { color: var(--sage); }
  .mcp-tag-res { color: var(--yellow); }
  .mcp-json { white-space: pre-wrap; word-break: break-word; color: var(--chalk-dim); margin: 4px 0 14px 0; }
  .mcp-json .k { color: var(--sage); }
  .mcp-json .s { color: var(--chalk); }

  .mcp-grid { display:grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items:start; }
  @media (max-width: 720px) { .mcp-grid { grid-template-columns: 1fr; } }

  .mcp-facts { display:flex; flex-wrap:wrap; gap: 10px; margin-top: 26px; }
  .mcp-fact {
    font-family:'IBM Plex Mono', monospace;
    font-size: 12px;
    border: 1px solid var(--line);
    border-radius: 4px;
    padding: 6px 10px;
    color: var(--chalk-dim);
  }

  .mcp-author {
    display:flex; align-items:center; gap:14px;
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 16px 18px;
    margin-top: 30px;
    max-width: 480px;
  }
  .mcp-author-badge {
    width:38px; height:38px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    border: 1.5px dashed var(--yellow); color: var(--yellow); flex-shrink:0;
  }
  .mcp-author small { color: var(--chalk-dim); display:block; margin-top:2px; }

  .mcp-tool-row {
    display:flex; gap: 16px;
    padding: 18px 4px;
    border-bottom: 1px solid var(--line);
    cursor: pointer;
    background: transparent;
    text-align:left;
    width:100%;
    border-left: 3px solid transparent;
    transition: background .12s ease, border-color .12s ease;
  }
  .mcp-tool-row:hover { background: rgba(241,237,226,0.03); }
  .mcp-tool-row.active { border-left-color: var(--yellow); background: rgba(228,195,104,0.05); }
  .mcp-tool-icon {
    width:34px; height:34px; border-radius:6px;
    display:flex; align-items:center; justify-content:center;
    border: 1px solid var(--line); color: var(--sage); flex-shrink:0;
  }
  .mcp-tool-row.active .mcp-tool-icon { color: var(--yellow); border-color: var(--yellow); }
  .mcp-tool-title { font-family:'IBM Plex Mono', monospace; font-size: 14px; color: var(--chalk); margin: 0 0 4px 0; }
  .mcp-tool-desc { font-size: 13px; color: var(--chalk-dim); line-height: 1.55; margin:0; }

  .mcp-steps { counter-reset: step; list-style: none; padding:0; margin: 22px 0 0 0; }
  .mcp-steps li {
    counter-increment: step;
    position: relative;
    padding: 0 0 26px 40px;
    border-left: 1px dashed var(--line);
    margin-left: 14px;
  }
  .mcp-steps li:last-child { border-color: transparent; padding-bottom:0; }
  .mcp-steps li::before {
    content: counter(step);
    font-family:'IBM Plex Mono', monospace;
    position: absolute; left: -14px; top: -2px;
    width: 27px; height: 27px; border-radius: 50%;
    background: var(--board); border: 1.5px solid var(--sage); color: var(--sage);
    display:flex; align-items:center; justify-content:center;
    font-size: 12px;
  }
  .mcp-code {
    font-family:'IBM Plex Mono', monospace; font-size: 13px;
    background: var(--board); border: 1px solid var(--line); border-radius: 5px;
    padding: 10px 12px; color: var(--yellow); display:block; margin-top:8px;
    overflow-x:auto;
  }

  .mcp-footer { padding: 30px 0 50px 0; font-family:'IBM Plex Mono', monospace; font-size: 12px; color: var(--chalk-dim); }
`;

function Frame({ label, children }) {
  return (
    <div className="mcp-frame">
      <div className="mcp-frame-head">
        <span className="mcp-dot" />
        <span className="mcp-dot" />
        <span className="mcp-dot" />
        <span style={{ marginLeft: 6 }}>{label}</span>
      </div>
      <div className="mcp-frame-body">{children}</div>
    </div>
  );
}

function Json({ obj }) {
  const entries = Object.entries(obj);
  if (entries.length === 0) return <span>{"{}"}</span>;
  return (
    <span>
      {"{\n"}
      {entries.map(([k, v], i) => (
        <span key={k}>
          {"  "}
          <span className="k">"{k}"</span>: <span className="s">{Array.isArray(v) ? JSON.stringify(v) : typeof v === "string" ? `"${v}"` : String(v)}</span>
          {i < entries.length - 1 ? "," : ""}
          {"\n"}
        </span>
      ))}
      {"}"}
    </span>
  );
}

function HomePage() {
  return (
    <>
      <section className="mcp-section" style={{ paddingTop: 56 }}>
        <p className="mcp-eyebrow">NextFlows Academy — hands-on exercise</p>
        <h1 className="mcp-h1">
          mcp-academy-project<br />
          <span className="accent">a small MCP server, built to learn the real workflow.</span>
        </h1>
        <p className="mcp-lede">
          This project is a task-tracking server built on the Model Context Protocol.
          It exists to practice Git, GitHub, and MCP fundamentals by shipping something
          that actually runs — seven tools, a JSON task list, and a client that can talk to it.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a className="mcp-btn" href="https://github.com/hibat972-tech/mcp-academy-project" target="_blank" rel="noreferrer">
            <GitBranch size={15} /> View repository
          </a>
          <a className="mcp-btn ghost" href="#" onClick={(e) => e.preventDefault()}>
            <Terminal size={15} /> See it run
          </a>
        </div>

        <div className="mcp-facts">
          <span className="mcp-fact">TypeScript</span>
          <span className="mcp-fact">@modelcontextprotocol/sdk ^1.0.0</span>
          <span className="mcp-fact">zod ^4.4.3</span>
          <span className="mcp-fact">stdio transport</span>
          <span className="mcp-fact">data/todos.json</span>
        </div>

        <div className="mcp-author">
          <div className="mcp-author-badge"><GraduationCap size={18} /></div>
          <div>
            <strong className="mcp-mono" style={{ fontSize: 14 }}>Hiba Abu Taha & Zainab Abu Awwad & Malak Al-Rimawi</strong>
            <small>Authores — built as part of the NextFlows Academy program (info@nextflows.ai)</small>
          </div>
        </div>
      </section>

      <section className="mcp-section">
        <div className="mcp-grid">
          <div>
            <p className="mcp-eyebrow">Why it exists</p>
            <h2 className="mcp-h2">A protocol, not just a to-do list</h2>
            <p className="mcp-p">
              The task list is the surface. The point of the exercise is underneath it: standing up
              a real MCP server, exposing tools with typed schemas, validating input with Zod, and
              persisting state to disk — then wiring the whole thing through Git and GitHub like any
              other shipped project.
            </p>
          </div>
          <Frame label="request → response">
            <span className="mcp-tag-req">→ tools/call</span>
            <div className="mcp-json">
              <Json obj={{ name: "add_task", title: "Prep demo", priority: "high" }} />
            </div>
            <span className="mcp-tag-res">← result</span>
            <div className="mcp-json" style={{ marginBottom: 0 }}>
              <Json obj={{ id: "t_004", status: "created" }} />
            </div>
          </Frame>
        </div>
      </section>
    </>
  );
}

function ToolsPage() {
  const [activeId, setActiveId] = useState(TOOLS[0].id);
  const [tasks, setTasks] = useState([
    { id: "t_001", title: "Read MCP spec", priority: "medium", deadline: "2026-08-25", done: false },
    { id: "t_002", title: "Wire up zod schemas", priority: "high", deadline: "2026-08-23", done: false },
  ]);
  const [log, setLog] = useState(null);
  const active = TOOLS.find((t) => t.id === activeId);

  function run(tool) {
    let response;
    let request = tool.request;
    if (tool.id === "add_task") {
      const id = "t_" + String(tasks.length + 1).padStart(3, "0");
      const newTask = { id, ...tool.request, done: false };
      setTasks((t) => [...t, newTask]);
      response = { id, status: "created" };
    } else if (tool.id === "list_tasks") {
      response = { open: tasks.filter((t) => !t.done).length, tasks: tasks.filter((t) => !t.done).map((t) => t.id) };
    } else if (tool.id === "search_tasks") {
      const q = tool.request.query.toLowerCase();
      const matches = tasks.filter((t) => t.title.toLowerCase().includes(q)).map((t) => t.id);
      response = { query: tool.request.query, matches };
    } else if (tool.id === "complete_task") {
      const target = tasks.find((t) => !t.done);
      if (target) {
        setTasks((ts) => ts.map((t) => (t.id === target.id ? { ...t, done: true } : t)));
        request = { id: target.id };
        response = { id: target.id, status: "done" };
      } else {
        request = { id: "—" };
        response = { error: "no open tasks" };
      }
    } else if (tool.id === "update_task") {
      const target = tasks.find((t) => !t.done);
      if (target) {
        setTasks((ts) => ts.map((t) => (t.id === target.id ? { ...t, priority: "medium" } : t)));
        request = { id: target.id, priority: "medium" };
        response = { id: target.id, status: "updated" };
      } else {
        request = { id: "—" };
        response = { error: "no open tasks" };
      }
    } else if (tool.id === "delete_task") {
      const target = tasks[tasks.length - 1];
      if (target) {
        setTasks((ts) => ts.filter((t) => t.id !== target.id));
        request = { id: target.id };
        response = { id: target.id, status: "deleted" };
      } else {
        request = { id: "—" };
        response = { error: "no tasks" };
      }
    } else if (tool.id === "generate_study_plan") {
      const open = tasks.filter((t) => !t.done);
      const blocks = open.map((t, i) => `day${i + 1}: ${t.title}`);
      response = { hours_per_day: tool.request.hours_per_day, blocks };
    }
    setLog({ tool: tool.id, request, response });
  }

  return (
    <section className="mcp-section" style={{ paddingTop: 56 }}>
      <p className="mcp-eyebrow">Seven tools</p>
      <h1 className="mcp-h1" style={{ fontSize: 32 }}>What the server exposes</h1>
      <p className="mcp-lede" style={{ marginBottom: 36 }}>
        Every tool reads and writes the same task list, stored at <span className="mcp-mono">data/todos.json</span>.
        Pick one to try it against a live demo list — nothing here touches the real repo.
      </p>

      <div className="mcp-grid" style={{ alignItems: "start" }}>
        <div>
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                className={`mcp-tool-row ${activeId === tool.id ? "active" : ""}`}
                onClick={() => setActiveId(tool.id)}
              >
                <span className="mcp-tool-icon"><Icon size={16} /></span>
                <span>
                  <p className="mcp-tool-title">{tool.title}</p>
                  <p className="mcp-tool-desc">{tool.desc}</p>
                </span>
              </button>
            );
          })}
        </div>

        <div>
          <Frame label={`mcp • ${active.title}`}>
            <p style={{ color: "var(--chalk-dim)", margin: "0 0 14px 0" }}>{active.desc}</p>
            <button className="mcp-btn" style={{ marginBottom: 16 }} onClick={() => run(active)}>
              <ChevronRight size={14} /> call {active.title}
            </button>
            {log && log.tool === active.id && (
              <>
                <span className="mcp-tag-req">→ tools/call</span>
                <div className="mcp-json"><Json obj={{ name: log.tool, ...log.request }} /></div>
                <span className="mcp-tag-res">← result</span>
                <div className="mcp-json" style={{ marginBottom: 0 }}><Json obj={log.response} /></div>
              </>
            )}
            {(!log || log.tool !== active.id) && (
              <p style={{ color: "var(--chalk-dim)", fontSize: 12 }}>— call the tool to see a request and response —</p>
            )}
          </Frame>

          <div style={{ marginTop: 18 }}>
            <p className="mcp-eyebrow" style={{ marginBottom: 10 }}>Demo list ({tasks.filter((t) => !t.done).length} open)</p>
            <Frame label="data/todos.json (demo)">
              {tasks.length === 0 && <p style={{ color: "var(--chalk-dim)" }}>empty</p>}
              {tasks.map((t) => (
                <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", opacity: t.done ? 0.45 : 1 }}>
                  <span style={{ color: "var(--chalk)" }}>{t.done ? "✓ " : "· "}{t.title}</span>
                  <span style={{ color: "var(--sage)", fontSize: 12 }}>{t.priority} · {t.deadline}</span>
                </div>
              ))}
            </Frame>
          </div>
        </div>
      </div>
    </section>
  );
}

function DownloadPage() {
  return (
    <section className="mcp-section" style={{ paddingTop: 56 }}>
      <p className="mcp-eyebrow">Get it running</p>
      <h1 className="mcp-h1" style={{ fontSize: 32 }}>Clone it, install it, run it</h1>
      <p className="mcp-lede" style={{ marginBottom: 8 }}>
        The server speaks MCP over stdio, so any MCP-compatible client — Claude Desktop, an
        MCP inspector, or your own script — can connect to it once it's running.
      </p>

      <div className="mcp-grid" style={{ marginTop: 30 }}>
        <div>
          <ol className="mcp-steps">
            <li>
              <p className="mcp-tool-title">Clone the repository</p>
              <p className="mcp-tool-desc">Get a local copy of the project.</p>
              <code className="mcp-code">git clone https://github.com/hibat972-tech/mcp-academy-project.git</code>
            </li>
            <li>
              <p className="mcp-tool-title">Install dependencies</p>
              <p className="mcp-tool-desc">Pulls in the MCP SDK, Zod, and the TypeScript tooling.</p>
              <code className="mcp-code">cd mcp-academy-project && npm install</code>
            </li>
            <li>
              <p className="mcp-tool-title">Start the server</p>
              <p className="mcp-tool-desc">Runs the server directly from TypeScript with tsx — no build step needed.</p>
              <code className="mcp-code">npm run dev</code>
            </li>
            <li>
              <p className="mcp-tool-title">Point a client at it</p>
              <p className="mcp-tool-desc">Connect an MCP client over stdio and call add_task, list_tasks, search_tasks, complete_task, update_task, delete_task, or generate_study_plan.</p>
            </li>
          </ol>
        </div>

        <div>
          <Frame label="requirements">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Package size={14} color="var(--sage)" /> Node.js (for npm and tsx)
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FileJson size={14} color="var(--sage)" /> @modelcontextprotocol/sdk ^1.0.0
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FileJson size={14} color="var(--sage)" /> zod ^4.4.3
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Terminal size={14} color="var(--sage)" /> tsx, typescript (dev)
              </div>
            </div>
          </Frame>

          <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a className="mcp-btn" href="https://github.com/hibat972-tech/mcp-academy-project" target="_blank" rel="noreferrer">
              <Download size={15} /> Download / clone
            </a>
            <a className="mcp-btn ghost" href="https://github.com/hibat972-tech/mcp-academy-project/blob/main/README.md" target="_blank" rel="noreferrer">
              <GitBranch size={15} /> Read the README
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const pages = { home: "Home", tools: "Tools", download: "Download" };

  return (
    <div className="mcp-root">
      <style>{STYLE}</style>
      <nav className="mcp-nav">
        <div className="mcp-container mcp-nav-row">
          <div className="mcp-brand">
            <div className="mcp-brand-mark"><Terminal size={15} /></div>
            <span className="mcp-brand-text mcp-mono">mcp-<b>academy</b>-project</span>
          </div>
          <div className="mcp-tabs">
            {Object.entries(pages).map(([key, label]) => (
              <button
                key={key}
                className={`mcp-tab ${page === key ? "active" : ""}`}
                onClick={() => setPage(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="mcp-container">
        {page === "home" && <HomePage />}
        {page === "tools" && <ToolsPage />}
        {page === "download" && <DownloadPage />}

        <div className="mcp-footer">
          NextFlows Academy · built by Hiba Abu Taha & Zainab Abu Awwad & Malak Al-Rimawi · <a href="https://github.com/hibat972-tech/mcp-academy-project" target="_blank" rel="noreferrer" style={{ color: "var(--sage)" }}>github.com/hibat972-tech/mcp-academy-project</a>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);