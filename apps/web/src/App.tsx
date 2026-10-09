import { useMemo, useState } from "react";

type Mood = "idle" | "listening" | "speaking";
type Look = "official" | "casual" | "lab" | "outing" | "gaming";
type Scene = "deep-space" | "nebula" | "orbit" | "deck";
type Message = { from: "you" | "gideon"; text: string };

const looks: { id: Look; label: string; detail: string; mark: string }[] = [
  { id: "official", label: "Official", detail: "Presentation mode", mark: "◆" },
  { id: "casual", label: "Casual", detail: "Everyday mode", mark: "◈" },
  { id: "lab", label: "Lab", detail: "Research mode", mark: "⌬" },
  { id: "outing", label: "Outing", detail: "Social mode", mark: "✦" },
  { id: "gaming", label: "Gaming", detail: "Entertainment mode", mark: "▦" }
];
const scenes: { id: Scene; label: string; subtitle: string }[] = [
  { id: "deep-space", label: "Deep Space", subtitle: "Original void" },
  { id: "nebula", label: "Nebula Drift", subtitle: "Blue nebula field" },
  { id: "orbit", label: "Night Orbit", subtitle: "Planetary horizon" },
  { id: "deck", label: "Observation Deck", subtitle: "Starship interior" }
];

export default function App() {
  const [mood, setMood] = useState<Mood>("idle");
  const [look, setLook] = useState<Look>("official");
  const [scene, setScene] = useState<Scene>("deep-space");
  const [chatOpen, setChatOpen] = useState(false);
  const [command, setCommand] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { from: "gideon", text: "Systems online. Interface controls are ready. Voice and model services are not connected yet." }
  ]);
  const currentLook = useMemo(() => looks.find((item) => item.id === look) ?? looks[0], [look]);
  const currentScene = useMemo(() => scenes.find((item) => item.id === scene) ?? scenes[0], [scene]);

  function sendCommand(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = command.trim();
    if (!text) return;
    setMessages((items) => [...items, { from: "you", text }]);
    const normalized = text.toLowerCase();
    const chosenLook = looks.find((item) => normalized.includes(item.id) || normalized.includes(item.label.toLowerCase()));
    const chosenScene = scenes.find((item) => normalized.includes(item.id.replace("-", " ")) || normalized.includes(item.label.toLowerCase()));
    if (chosenLook && /(look|outfit|wear|dress|switch|change|take)/.test(normalized)) {
      setLook(chosenLook.id);
      setMessages((items) => [...items, { from: "gideon", text: `Appearance set to ${chosenLook.label}. This is a local interface change.` }]);
    } else if (chosenScene && /(scene|background|switch|change|show|move|go|put)/.test(normalized)) {
      setScene(chosenScene.id);
      setMessages((items) => [...items, { from: "gideon", text: `Scene set to ${chosenScene.label}. This is a local interface change.` }]);
    } else if (normalized.includes("listen")) {
      setMood("listening");
      setMessages((items) => [...items, { from: "gideon", text: "Listening state enabled in the interface. Microphone capture is not connected." }]);
    } else if (normalized.includes("idle")) {
      setMood("idle");
      setMessages((items) => [...items, { from: "gideon", text: "Returning to standby." }]);
    } else {
      setMessages((items) => [...items, { from: "gideon", text: "I can switch the local look, scene, or visual status. Conversational AI and voice are planned for a later server-side integration." }]);
    }
    setCommand("");
  }

  return <main className={`gideon-shell scene-${scene}`}>
    <div className="ambient-grid" aria-hidden="true" />
    <header className="topbar">
      <a className="brand" href="#home" aria-label="GIDEON SI home"><span className="brand-mark">G</span><span><strong>GIDEON <i>SI</i></strong><small>PERSONAL INTELLIGENCE SYSTEM</small></span></a>
      <div className="system-status"><span className="status-dot" /> CORE STANDBY <b>·</b> UI BUILD 0.1</div>
      <button className="icon-button" onClick={() => setChatOpen((value) => !value)} aria-label="Toggle text console" title="Text console">⌘</button>
    </header>

    <aside className="left-rail" aria-label="System telemetry">
      <div className="rail-title">LIVE TELEMETRY</div>
      <div className="telemetry"><span>VISUAL CORE</span><strong>READY</strong><div className="meter"><i style={{ width: "86%" }} /></div></div>
      <div className="telemetry"><span>INTERACTION</span><strong>{mood.toUpperCase()}</strong><div className="meter"><i style={{ width: mood === "listening" ? "74%" : "36%" }} /></div></div>
      <div className="telemetry"><span>VOICE API</span><strong className="muted">NOT LINKED</strong><div className="meter"><i style={{ width: "0%" }} /></div></div>
      <div className="rail-bottom"><span className="tiny-ring" />SECURE BY DESIGN<br />TOOLS NOT CONNECTED</div>
    </aside>

    <section className="hero" id="home">
      <div className="hero-copy"><span className="eyebrow"><span /> HOLOGRAPHIC INTERFACE</span><h1>At your<br /><em>command.</em></h1><p>GIDEON SI interface shell. Choose a look, change the environment, and explore the interaction surface.</p>
        <div className="hero-actions"><button className="primary-button" onClick={() => setMood(mood === "listening" ? "idle" : "listening")}><span className="pulse-icon">◉</span>{mood === "listening" ? "END LISTENING STATE" : "ACTIVATE LISTENING STATE"}</button><button className="secondary-button" onClick={() => setChatOpen(true)}>OPEN TEXT CONSOLE ↗</button></div>
      </div>
      <div className="holo-column">
        <div className="holo-caption"><span>FIG. 01 / GIDEON</span><span>PROJECTION FIELD</span></div>
        <div className="holo-stage" data-mood={mood} aria-label={`GIDEON hologram visualization, ${mood}`}>
          <div className="holo-orbit orbit-one" /><div className="holo-orbit orbit-two" /><div className="holo-aura" />
          <div className="holo-silhouette"><div className="holo-head"><span className="eye eye-left" /><span className="eye eye-right" /></div><div className="holo-neck" /><div className="holo-shoulders" /><div className="holo-chest"><span className="chest-core" /></div><div className="holo-lines" /></div>
          <div className="holo-ring ring-one" /><div className="holo-ring ring-two" /><div className="holo-floor" /><div className="scanlines" />
          <div className="holo-label label-left">NEURAL<br />MATRIX <b>98.4%</b></div><div className="holo-label label-right">SYNC<br /><b>{mood === "listening" ? "INBOUND" : mood === "speaking" ? "OUTBOUND" : "STANDBY"}</b></div>
          <div className="holo-state"><span className="status-dot" /> {mood.toUpperCase()} <span className="state-bars"><i /><i /><i /><i /><i /></span></div>
        </div>
        <div className="holo-foot"><span>AVATAR PROFILE / {currentLook.label.toUpperCase()}</span><span>ENVIRONMENT / {currentScene.label.toUpperCase()}</span></div>
      </div>
    </section>

    <section className="control-dock" aria-label="GIDEON controls">
      <div className="dock-heading"><span>01 / APPEARANCE MATRIX</span><small>SELECT PROFILE</small></div>
      <div className="look-list">{looks.map((item) => <button key={item.id} className={`look-option ${look === item.id ? "selected" : ""}`} onClick={() => setLook(item.id)}><span className="look-icon">{item.mark}</span><span><strong>{item.label}</strong><small>{item.detail}</small></span>{look === item.id && <b className="selected-mark">✓</b>}</button>)}</div>
      <div className="dock-heading scene-heading"><span>02 / ENVIRONMENT</span><small>CHANGE SCENE</small></div>
      <div className="scene-list">{scenes.map((item, index) => <button key={item.id} className={`scene-option ${scene === item.id ? "selected" : ""}`} onClick={() => setScene(item.id)}><span className={`scene-thumb thumb-${item.id}`}><i /></span><span><strong>{item.label}</strong><small>{item.subtitle}</small></span>{scene === item.id && <b>●</b>}{index === 0 && <span className="scene-current">DEFAULT</span>}</button>)}</div>
      <div className="dock-footer"><span><i className="status-dot" /> INTERFACE CONTROLS ONLINE</span><span>VOICE PROVIDER <b>PLANNED</b></span><span>POLICY GATE <b>UNTOUCHED</b></span></div>
    </section>

    <footer className="footer"><span>GIDEON SI <b>·</b> PRUDEN AI TECH INDUSTRIES</span><span>VISUAL PROTOTYPE <b>—</b> VOICE INTEGRATION DEFERRED</span></footer>

    {chatOpen && <section className="chat-panel" aria-label="Text command console"><header><div><span className="status-dot" /><span><strong>GIDEON TEXT CONSOLE</strong><small>LOCAL UI COMMANDS ONLY</small></span></div><button onClick={() => setChatOpen(false)} aria-label="Close console">×</button></header><div className="chat-stream">{messages.map((message, index) => <div className={`chat-message ${message.from}`} key={index}><small>{message.from === "you" ? "YOU" : "GIDEON SI"}</small><p>{message.text}</p></div>)}</div><form className="chat-form" onSubmit={sendCommand}><input value={command} onChange={(event) => setCommand(event.target.value)} placeholder="Try: switch to lab look…" aria-label="Enter a local UI command" /><button type="submit" aria-label="Send command">↗</button></form></section>}
  </main>;
}
