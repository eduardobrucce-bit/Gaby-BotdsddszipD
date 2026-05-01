import { useState, useEffect, useRef } from "react";

const TIME = "21:19";
const bgPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg opacity='0.07' fill='%23a0998d'%3E%3Cpath d='M30 5 C20 5 12 13 12 23 C12 28 14 33 18 36 L16 45 L25 40 C26.6 40.6 28.3 41 30 41 C40 41 48 33 48 23 C48 13 40 5 30 5 Z'/%3E%3C/g%3E%3C/svg%3E")`;

type MsgKind = "audio1" | "image" | "audio2" | "audio3";
const SEQUENCE: MsgKind[] = ["audio1", "image", "audio2", "audio3"];
const DELAYS = [600, 1400, 2200, 3000];
const INPUT_DELAY = 3800;

function AudioBubble({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  function fmt(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play(); setPlaying(true); }
  }

  return (
    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 4, animation: "fadeSlide 0.3s ease" }}>
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onTimeUpdate={() => {
          const a = audioRef.current;
          if (!a) return;
          setCurrent(a.currentTime);
          setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
        }}
        onEnded={() => { setPlaying(false); setProgress(0); setCurrent(0); }}
      />
      <div style={{ background: "#fff", borderRadius: "2px 12px 12px 12px", padding: "10px 14px 6px", maxWidth: "80%", minWidth: 220, boxShadow: "0 1px 2px rgba(0,0,0,0.13)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* avatar */}
          <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
            <img src="/avatar.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          </div>
          {/* play/pause */}
          <button onClick={toggle} style={{ width: 34, height: 34, borderRadius: "50%", background: "#075e54", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {playing ? (
              <svg width="11" height="13" viewBox="0 0 11 13" fill="white">
                <rect x="0" y="0" width="3.5" height="13" rx="1"/>
                <rect x="7" y="0" width="3.5" height="13" rx="1"/>
              </svg>
            ) : (
              <svg width="12" height="13" viewBox="0 0 12 13" fill="white">
                <path d="M2 1.5L11 6.5L2 11.5V1.5Z"/>
              </svg>
            )}
          </button>
          {/* waveform + progress */}
          <div style={{ flex: 1, position: "relative", height: 28, display: "flex", alignItems: "center" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 2 }}>
              {[3,6,4,9,5,7,3,8,4,6,5,7,4,3,6,8,5,4,7,3,5,8,4,6].map((h, i) => {
                const pct = ((i + 1) / 24) * 100;
                return (
                  <div key={i} style={{ width: 2.5, height: h, background: progress >= pct ? "#075e54" : "#c8c8c8", borderRadius: 1.5, flexShrink: 0 }} />
                );
              })}
            </div>
          </div>
          {/* time */}
          <span style={{ fontSize: 11.5, color: "#8696a0", flexShrink: 0, minWidth: 30 }}>
            {playing || current > 0 ? fmt(current) : fmt(duration)}
          </span>
        </div>
        <div style={{ fontSize: 11, color: "#8696a0", textAlign: "right", marginTop: 3 }}>{TIME}</div>
      </div>
    </div>
  );
}

function ImageBubble() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-end", gap: 6, marginBottom: 4, animation: "fadeSlide 0.3s ease" }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
        <img src="/avatar.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
      </div>
      <div style={{ background: "#fff", borderRadius: "2px 12px 12px 12px", overflow: "hidden", maxWidth: "72%", boxShadow: "0 1px 2px rgba(0,0,0,0.13)" }}>
        <img src="/chat-img.png" alt="foto" style={{ width: "100%", display: "block" }} />
        <div style={{ fontSize: 11, color: "#8696a0", textAlign: "right", padding: "3px 10px 5px" }}>{TIME}</div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 4 }}>
      <div style={{ background: "#fff", borderRadius: "2px 12px 12px 12px", padding: "10px 16px", boxShadow: "0 1px 2px rgba(0,0,0,0.13)", display: "flex", alignItems: "center", gap: 4 }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#8696a0", display: "inline-block", animation: `bounce 1s ease-in-out ${i * 0.18}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [visible, setVisible] = useState<MsgKind[]>([]);
  const [typing, setTyping] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [inputText, setInputText] = useState("");
  const [userMessages, setUserMessages] = useState<string[]>([]);
  const [botReplies, setBotReplies] = useState<string[]>([]);
  const [replyTyping, setReplyTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [choiceSelected, setChoiceSelected] = useState<string | null>(null);
  const [choiceReplies, setChoiceReplies] = useState<string[]>([]);
  const [choiceTyping, setChoiceTyping] = useState(false);
  const [showInput2, setShowInput2] = useState(false);
  const [input2Text, setInput2Text] = useState("");
  const [finalUserMsg, setFinalUserMsg] = useState<string | null>(null);
  const [finalReplies, setFinalReplies] = useState<string[]>([]);
  const [finalTyping, setFinalTyping] = useState(false);
  const [showChoices2, setShowChoices2] = useState(false);
  const [ageChoice, setAgeChoice] = useState<string | null>(null);
  const [ageReplies, setAgeReplies] = useState<string[]>([]);
  const [ageTyping, setAgeTyping] = useState(false);
  const [showOkChoice, setShowOkChoice] = useState(false);
  const [okChoice, setOkChoice] = useState<string | null>(null);
  const [okReplies, setOkReplies] = useState<string[]>([]);
  const [okTyping, setOkTyping] = useState(false);
  const [showTypeChoices, setShowTypeChoices] = useState(false);
  const [typeChoice, setTypeChoice] = useState<string | null>(null);
  const [typeReplies, setTypeReplies] = useState<string[]>([]);
  const [typeTyping, setTypeTyping] = useState(false);
  const [showTimeChoices, setShowTimeChoices] = useState(false);
  const [timeChoice, setTimeChoice] = useState<string | null>(null);
  const replySentRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    SEQUENCE.forEach((kind, idx) => {
      timers.push(setTimeout(() => setTyping(true), DELAYS[idx] - 500 > 0 ? DELAYS[idx] - 500 : 0));
      timers.push(setTimeout(() => {
        setTyping(false);
        setVisible((v) => [...v, kind]);
      }, DELAYS[idx]));
    });
    timers.push(setTimeout(() => setShowInput(true), INPUT_DELAY));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visible, typing, userMessages, botReplies, replyTyping, showChoices, choiceSelected, choiceReplies, choiceTyping, showInput2, finalUserMsg, finalReplies, finalTyping, showChoices2, ageChoice, ageReplies, ageTyping, showOkChoice, okChoice, okReplies, okTyping, showTypeChoices, typeChoice, typeReplies, typeTyping, showTimeChoices, timeChoice]);

  function triggerBotReply() {
    if (replySentRef.current) return;
    replySentRef.current = true;

    // sequence: text1 → aud4 → text2 → aud5 → aud6
    const steps: Array<{ kind: string; delay: number }> = [
      { kind: "text:Hmmmm.. gostei do seu nome 😏",  delay: 1400 },
      { kind: "aud4",                                  delay: 2600 },
      { kind: "text:Você curte? 🔥",                  delay: 4000 },
      { kind: "aud5",                                  delay: 5200 },
      { kind: "aud6",                                  delay: 6400 },
    ];

    const timers: ReturnType<typeof setTimeout>[] = [];
    steps.forEach(({ kind, delay }) => {
      timers.push(setTimeout(() => setReplyTyping(true), delay - 700));
      timers.push(setTimeout(() => {
        setReplyTyping(false);
        setBotReplies((prev) => [...prev, kind]);
      }, delay));
    });
    timers.push(setTimeout(() => setShowChoices(true), 7200));
  }

  function triggerChoiceReply() {
    const steps: Array<{ kind: string; delay: number }> = [
      { kind: "resp1",                              delay: 1200 },
      { kind: "text:É um grupinho 100% Fechado! 🔒", delay: 2600 },
      { kind: "img:group-img.jpg",                  delay: 4000 },
      { kind: "resp2",                              delay: 5400 },
      { kind: "text:😅",                            delay: 6800 },
      { kind: "resp3",                              delay: 8200 },
      { kind: "resp4",                              delay: 9600 },
    ];
    steps.forEach(({ kind, delay }) => {
      setTimeout(() => setChoiceTyping(true), delay - 700);
      setTimeout(() => {
        setChoiceTyping(false);
        setChoiceReplies((prev) => [...prev, kind]);
      }, delay);
    });
    setTimeout(() => setShowInput2(true), 10400);
  }

  function triggerFinalReply() {
    const steps: Array<{ kind: string; delay: number }> = [
      { kind: "fin1",                                delay: 1200 },
      { kind: "text:Pra não da problema pra ngm...", delay: 2600 },
      { kind: "fin2",                                delay: 4000 },
    ];
    steps.forEach(({ kind, delay }) => {
      setTimeout(() => setFinalTyping(true), delay - 700);
      setTimeout(() => {
        setFinalTyping(false);
        setFinalReplies((prev) => [...prev, kind]);
      }, delay);
    });
    setTimeout(() => setShowChoices2(true), 4800);
  }

  function sendFinalMessage() {
    const text = input2Text.trim();
    if (!text) return;
    setFinalUserMsg(text);
    setInput2Text("");
    setShowInput2(false);
    triggerFinalReply();
  }

  function handleKey2(e: React.KeyboardEvent) {
    if (e.key === "Enter") sendFinalMessage();
  }

  function triggerAgeReply() {
    const steps: Array<{ kind: string; delay: number }> = [
      { kind: "age1",        delay: 1200 },
      { kind: "text:Ok? 😊", delay: 2600 },
    ];
    steps.forEach(({ kind, delay }) => {
      setTimeout(() => setAgeTyping(true), delay - 700);
      setTimeout(() => {
        setAgeTyping(false);
        setAgeReplies((prev) => [...prev, kind]);
      }, delay);
    });
    setTimeout(() => setShowOkChoice(true), 3300);
  }

  function triggerOkReply() {
    const msgs = [
      "Perfeito! ❤️",
      "Agora me conta... qual seu tipo de mulher no grupo?",
      "Temos 3 tipos principais de mulheres casadas no grupo:",
      "👇🏼👇🏼👇🏼",
      "🔥 AS SAFADAS (25 a 35 anos)\nSão as mais novas e taradas do grupo. Gostam de putaria o tempo todo, mandar nudes, vídeos, fazer chamada de vídeo safada e provocam bastante...",
      "💦 AS EXPERIENTES (35 a 45 anos)\nSão as que mais gostam de foder de verdade.\nPouca conversa, muito tesão.\nGostam de gravar, mandar áudio gemendo, e querem marcar encontro rápido",
      "🍒 AS COROAS (45 a 55 anos)\nAs mais safadas e famintas de todas. São experientes, sem frescura, gostam de quantidade e querem fuder quase todos os dias. Muitas preferem Sexo Anal.",
      "Qual delas você gosta mais 👇",
    ];
    msgs.forEach((msg, i) => {
      const delay = 1200 + i * 1600;
      setTimeout(() => setOkTyping(true), delay - 800);
      setTimeout(() => {
        setOkTyping(false);
        setOkReplies((prev) => [...prev, msg]);
      }, delay);
    });
    const lastDelay = 1200 + (msgs.length - 1) * 1600;
    setTimeout(() => setShowTypeChoices(true), lastDelay + 800);
  }

  function triggerTypeReply() {
    const steps: Array<{ kind: string; delay: number }> = [
      { kind: "text:Perfeito meu amor 🔥 Você é dos meus!", delay: 1400 },
      { kind: "aud7",                                       delay: 2800 },
    ];
    steps.forEach(({ kind, delay }) => {
      setTimeout(() => setTypeTyping(true), delay - 700);
      setTimeout(() => {
        setTypeTyping(false);
        setTypeReplies((prev) => [...prev, kind]);
      }, delay);
    });
    setTimeout(() => setShowTimeChoices(true), 3600);
  }

  function selectAgeChoice(option: string) {
    setAgeChoice(option);
    setShowChoices2(false);
    triggerAgeReply();
  }

  function sendMessage() {
    const text = inputText.trim();
    if (!text) return;
    setUserMessages((prev) => [...prev, text]);
    setInputText("");
    setShowInput(false);
    triggerBotReply();
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#ece5dd", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 430, minHeight: "100vh", background: "#ede8e1", backgroundImage: bgPattern, display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ background: "#075e54", color: "white", padding: "8px 10px 8px 12px", display: "flex", alignItems: "center", gap: 10, position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.25)" }}>
          <svg width="11" height="18" viewBox="0 0 11 18" fill="none" style={{ flexShrink: 0 }}>
            <path d="M10 1L2 9L10 17" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid #128c7e" }}>
            <img src="/avatar.png" alt="Patrícia" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", gap: 4 }}>
              Patrícia
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="7.5" r="7" fill="#25d366"/>
                <path d="M4 7.5L6.5 10L11 5.5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ fontSize: 12, opacity: 0.88 }}>online</div>
          </div>
          <svg width="4" height="18" viewBox="0 0 4 18" fill="white" style={{ flexShrink: 0 }}>
            <circle cx="2" cy="2" r="2"/><circle cx="2" cy="9" r="2"/><circle cx="2" cy="16" r="2"/>
          </svg>
        </div>

        {/* Chat body */}
        <div style={{ flex: 1, padding: "10px 10px 20px", display: "flex", flexDirection: "column", gap: 0, overflowY: "auto" }}>

          {/* Hoje */}
          <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
            <span style={{ background: "#e1d8cf", color: "#4a4a4a", fontSize: 12, padding: "3px 12px", borderRadius: 10, boxShadow: "0 1px 1px rgba(0,0,0,0.1)" }}>Hoje</span>
          </div>

          {/* Conta comercial */}
          <div style={{ display: "flex", justifyContent: "center", margin: "4px 0 10px" }}>
            <div style={{ background: "#fffde7", border: "1px solid #d4c47a", borderRadius: 10, padding: "6px 14px", fontSize: 12.5, color: "#5c5c00", display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6.5" stroke="#a09020" strokeWidth="1.2" fill="none"/>
                <text x="7" y="11" textAnchor="middle" fontSize="9" fill="#a09020" fontWeight="bold">i</text>
              </svg>
              Conta comercial
            </div>
          </div>

          {visible.includes("audio1") && <AudioBubble src="/aud1.mp3" />}
          {visible.includes("image")  && <ImageBubble />}
          {visible.includes("audio2") && <AudioBubble src="/aud2.mp3" />}
          {visible.includes("audio3") && <AudioBubble src="/aud3.mp3" />}
          {typing && <TypingIndicator />}

          {userMessages.map((msg, i) => (
            <div key={`u${i}`} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4, animation: "fadeSlide 0.2s ease" }}>
              <div style={{ background: "#dcf8c6", borderRadius: "12px 2px 12px 12px", padding: "8px 12px 4px", maxWidth: "75%", boxShadow: "0 1px 2px rgba(0,0,0,0.13)" }}>
                <p style={{ margin: 0, fontSize: 14.5, color: "#111b21", lineHeight: 1.45, wordBreak: "break-word" }}>{msg}</p>
                <div style={{ fontSize: 11, color: "#8696a0", textAlign: "right", marginTop: 2, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
                  {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                    <path d="M1 5.5L4.5 9L9 3" stroke="#53bdeb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 5.5L9.5 9L14 3" stroke="#53bdeb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          ))}

          {botReplies.map((reply, i) => {
            if (reply.startsWith("text:")) {
              const text = reply.slice(5);
              return (
                <div key={`r${i}`} style={{ display: "flex", justifyContent: "flex-start", marginBottom: 4, animation: "fadeSlide 0.25s ease" }}>
                  <div style={{ background: "#fff", borderRadius: "2px 12px 12px 12px", padding: "8px 12px 4px", maxWidth: "75%", boxShadow: "0 1px 2px rgba(0,0,0,0.13)" }}>
                    <p style={{ margin: 0, fontSize: 14.5, color: "#111b21", lineHeight: 1.45, wordBreak: "break-word" }}>{text}</p>
                    <div style={{ fontSize: 11, color: "#8696a0", textAlign: "right", marginTop: 2 }}>
                      {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              );
            }
            const src = `/${reply}.mp3`;
            return <AudioBubble key={`r${i}`} src={src} />;
          })}

          {replyTyping && <TypingIndicator />}

          {showChoices && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, marginTop: 8, animation: "fadeSlide 0.3s ease" }}>
              {["GOSTO! QUERO EXPERIMENTAR 😊", "COMO FUNCIONA?"].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setChoiceSelected(option);
                    setShowChoices(false);
                    triggerChoiceReply();
                  }}
                  style={{
                    background: "#075e54",
                    color: "white",
                    border: "none",
                    borderRadius: 20,
                    padding: "11px 20px",
                    fontSize: 13.5,
                    fontWeight: 700,
                    letterSpacing: 0.3,
                    cursor: "pointer",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
                    fontFamily: "inherit",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {choiceSelected && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4, animation: "fadeSlide 0.2s ease" }}>
              <div style={{ background: "#dcf8c6", borderRadius: "12px 2px 12px 12px", padding: "8px 12px 4px", maxWidth: "75%", boxShadow: "0 1px 2px rgba(0,0,0,0.13)" }}>
                <p style={{ margin: 0, fontSize: 14.5, color: "#111b21", lineHeight: 1.45, wordBreak: "break-word" }}>{choiceSelected}</p>
                <div style={{ fontSize: 11, color: "#8696a0", textAlign: "right", marginTop: 2, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
                  {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                    <path d="M1 5.5L4.5 9L9 3" stroke="#53bdeb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 5.5L9.5 9L14 3" stroke="#53bdeb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {choiceReplies.map((item, i) => {
            if (item.startsWith("text:")) {
              const text = item.slice(5);
              return (
                <div key={`cr${i}`} style={{ display: "flex", justifyContent: "flex-start", marginBottom: 4, animation: "fadeSlide 0.25s ease" }}>
                  <div style={{ background: "#fff", borderRadius: "2px 12px 12px 12px", padding: "8px 12px 4px", maxWidth: "75%", boxShadow: "0 1px 2px rgba(0,0,0,0.13)" }}>
                    <p style={{ margin: 0, fontSize: 14.5, color: "#111b21", lineHeight: 1.45, wordBreak: "break-word" }}>{text}</p>
                    <div style={{ fontSize: 11, color: "#8696a0", textAlign: "right", marginTop: 2 }}>
                      {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              );
            }
            if (item.startsWith("img:")) {
              const imgSrc = `/${item.slice(4)}`;
              return (
                <div key={`cr${i}`} style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-end", gap: 6, marginBottom: 4, animation: "fadeSlide 0.25s ease" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                    <img src="/avatar.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                  </div>
                  <div style={{ background: "#fff", borderRadius: "2px 12px 12px 12px", overflow: "hidden", maxWidth: "72%", boxShadow: "0 1px 2px rgba(0,0,0,0.13)" }}>
                    <img src={imgSrc} alt="grupo" style={{ width: "100%", display: "block" }} />
                    <div style={{ fontSize: 11, color: "#8696a0", textAlign: "right", padding: "3px 10px 5px" }}>
                      {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              );
            }
            return <AudioBubble key={`cr${i}`} src={`/${item}.mp3`} />;
          })}

          {choiceTyping && <TypingIndicator />}

          {finalUserMsg && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4, animation: "fadeSlide 0.2s ease" }}>
              <div style={{ background: "#dcf8c6", borderRadius: "12px 2px 12px 12px", padding: "8px 12px 4px", maxWidth: "75%", boxShadow: "0 1px 2px rgba(0,0,0,0.13)" }}>
                <p style={{ margin: 0, fontSize: 14.5, color: "#111b21", lineHeight: 1.45, wordBreak: "break-word" }}>{finalUserMsg}</p>
                <div style={{ fontSize: 11, color: "#8696a0", textAlign: "right", marginTop: 2, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
                  {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                    <path d="M1 5.5L4.5 9L9 3" stroke="#53bdeb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 5.5L9.5 9L14 3" stroke="#53bdeb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {finalReplies.map((item, i) => {
            if (item.startsWith("text:")) {
              const text = item.slice(5);
              return (
                <div key={`fr${i}`} style={{ display: "flex", justifyContent: "flex-start", marginBottom: 4, animation: "fadeSlide 0.25s ease" }}>
                  <div style={{ background: "#fff", borderRadius: "2px 12px 12px 12px", padding: "8px 12px 4px", maxWidth: "75%", boxShadow: "0 1px 2px rgba(0,0,0,0.13)" }}>
                    <p style={{ margin: 0, fontSize: 14.5, color: "#111b21", lineHeight: 1.45, wordBreak: "break-word" }}>{text}</p>
                    <div style={{ fontSize: 11, color: "#8696a0", textAlign: "right", marginTop: 2 }}>
                      {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              );
            }
            return <AudioBubble key={`fr${i}`} src={`/${item}.mp3`} />;
          })}

          {finalTyping && <TypingIndicator />}

          {ageChoice && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4, animation: "fadeSlide 0.2s ease" }}>
              <div style={{ background: "#dcf8c6", borderRadius: "12px 2px 12px 12px", padding: "8px 12px 4px", maxWidth: "75%", boxShadow: "0 1px 2px rgba(0,0,0,0.13)" }}>
                <p style={{ margin: 0, fontSize: 14.5, color: "#111b21", lineHeight: 1.45, wordBreak: "break-word" }}>{ageChoice}</p>
                <div style={{ fontSize: 11, color: "#8696a0", textAlign: "right", marginTop: 2, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
                  {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                    <path d="M1 5.5L4.5 9L9 3" stroke="#53bdeb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 5.5L9.5 9L14 3" stroke="#53bdeb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {ageReplies.map((item, i) => {
            if (item.startsWith("text:")) {
              const text = item.slice(5);
              return (
                <div key={`ar${i}`} style={{ display: "flex", justifyContent: "flex-start", marginBottom: 4, animation: "fadeSlide 0.25s ease" }}>
                  <div style={{ background: "#fff", borderRadius: "2px 12px 12px 12px", padding: "8px 12px 4px", maxWidth: "75%", boxShadow: "0 1px 2px rgba(0,0,0,0.13)" }}>
                    <p style={{ margin: 0, fontSize: 14.5, color: "#111b21", lineHeight: 1.45, wordBreak: "break-word" }}>{text}</p>
                    <div style={{ fontSize: 11, color: "#8696a0", textAlign: "right", marginTop: 2 }}>
                      {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              );
            }
            return <AudioBubble key={`ar${i}`} src={`/${item}.mp3`} />;
          })}

          {ageTyping && <TypingIndicator />}

          {okChoice && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4, animation: "fadeSlide 0.2s ease" }}>
              <div style={{ background: "#dcf8c6", borderRadius: "12px 2px 12px 12px", padding: "8px 12px 4px", maxWidth: "75%", boxShadow: "0 1px 2px rgba(0,0,0,0.13)" }}>
                <p style={{ margin: 0, fontSize: 14.5, color: "#111b21", lineHeight: 1.45, wordBreak: "break-word" }}>{okChoice}</p>
                <div style={{ fontSize: 11, color: "#8696a0", textAlign: "right", marginTop: 2, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
                  {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                    <path d="M1 5.5L4.5 9L9 3" stroke="#53bdeb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 5.5L9.5 9L14 3" stroke="#53bdeb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {okReplies.map((msg, i) => (
            <div key={`ok${i}`} style={{ display: "flex", justifyContent: "flex-start", marginBottom: 4, animation: "fadeSlide 0.25s ease" }}>
              <div style={{ background: "#fff", borderRadius: "2px 12px 12px 12px", padding: "8px 12px 4px", maxWidth: "80%", boxShadow: "0 1px 2px rgba(0,0,0,0.13)" }}>
                <p style={{ margin: 0, fontSize: 14.5, color: "#111b21", lineHeight: 1.55, wordBreak: "break-word", whiteSpace: "pre-line" }}>{msg}</p>
                <div style={{ fontSize: 11, color: "#8696a0", textAlign: "right", marginTop: 2 }}>
                  {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}

          {okTyping && <TypingIndicator />}

          {typeChoice && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4, animation: "fadeSlide 0.2s ease" }}>
              <div style={{ background: "#dcf8c6", borderRadius: "12px 2px 12px 12px", padding: "8px 12px 4px", maxWidth: "75%", boxShadow: "0 1px 2px rgba(0,0,0,0.13)" }}>
                <p style={{ margin: 0, fontSize: 14.5, color: "#111b21", lineHeight: 1.45, wordBreak: "break-word" }}>{typeChoice}</p>
                <div style={{ fontSize: 11, color: "#8696a0", textAlign: "right", marginTop: 2, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
                  {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                    <path d="M1 5.5L4.5 9L9 3" stroke="#53bdeb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 5.5L9.5 9L14 3" stroke="#53bdeb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {typeReplies.map((item, i) => {
            if (item.startsWith("text:")) {
              const text = item.slice(5);
              return (
                <div key={`tr${i}`} style={{ display: "flex", justifyContent: "flex-start", marginBottom: 4, animation: "fadeSlide 0.25s ease" }}>
                  <div style={{ background: "#fff", borderRadius: "2px 12px 12px 12px", padding: "8px 12px 4px", maxWidth: "75%", boxShadow: "0 1px 2px rgba(0,0,0,0.13)" }}>
                    <p style={{ margin: 0, fontSize: 14.5, color: "#111b21", lineHeight: 1.45, wordBreak: "break-word" }}>{text}</p>
                    <div style={{ fontSize: 11, color: "#8696a0", textAlign: "right", marginTop: 2 }}>
                      {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              );
            }
            return <AudioBubble key={`tr${i}`} src={`/${item}.mp3`} />;
          })}

          {typeTyping && <TypingIndicator />}

          {timeChoice && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4, animation: "fadeSlide 0.2s ease" }}>
              <div style={{ background: "#dcf8c6", borderRadius: "12px 2px 12px 12px", padding: "8px 12px 4px", maxWidth: "75%", boxShadow: "0 1px 2px rgba(0,0,0,0.13)" }}>
                <p style={{ margin: 0, fontSize: 14.5, color: "#111b21", lineHeight: 1.45, wordBreak: "break-word" }}>{timeChoice}</p>
                <div style={{ fontSize: 11, color: "#8696a0", textAlign: "right", marginTop: 2, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
                  {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                    <path d="M1 5.5L4.5 9L9 3" stroke="#53bdeb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 5.5L9.5 9L14 3" stroke="#53bdeb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        {showInput && (
          <div style={{ padding: "8px 12px 20px", background: "#ede8e1", animation: "slideUp 0.35s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 28, padding: "6px 6px 6px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }}>
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Digite aqui!"
                style={{ flex: 1, border: "none", outline: "none", fontSize: 15, background: "transparent", color: "#111", fontFamily: "inherit" }}
              />
              <button
                onClick={sendMessage}
                style={{ background: "#25d366", color: "white", border: "none", borderRadius: 22, padding: "10px 22px", fontWeight: 700, fontSize: 14.5, cursor: "pointer", flexShrink: 0, letterSpacing: 0.2 }}
              >
                Enviar
              </button>
            </div>
          </div>
        )}

        {/* Text input bar — appears after resp4 */}
        {showInput2 && (
          <div style={{ padding: "8px 12px 20px", background: "#ede8e1", animation: "slideUp 0.35s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 28, padding: "6px 6px 6px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }}>
              <input
                type="text"
                value={input2Text}
                onChange={(e) => setInput2Text(e.target.value)}
                onKeyDown={handleKey2}
                placeholder="Digite aqui!"
                autoFocus
                style={{ flex: 1, border: "none", outline: "none", fontSize: 15, background: "transparent", color: "#111", fontFamily: "inherit" }}
              />
              <button
                onClick={sendFinalMessage}
                style={{ background: "#25d366", color: "white", border: "none", borderRadius: 22, padding: "10px 22px", fontWeight: 700, fontSize: 14.5, cursor: "pointer", flexShrink: 0, letterSpacing: 0.2 }}
              >
                Enviar
              </button>
            </div>
          </div>
        )}

        {/* OK, PODE CONFIAR button — appears after "Ok? 😊" */}
        {showOkChoice && !okChoice && (
          <div style={{ padding: "10px 14px 22px", background: "#ede8e1", display: "flex", justifyContent: "center", animation: "slideUp 0.35s ease" }}>
            <button
              onClick={() => { setOkChoice("OK, PODE CONFIAR"); setShowOkChoice(false); triggerOkReply(); }}
              style={{
                background: "#25a898",
                color: "white",
                border: "none",
                borderRadius: 24,
                padding: "12px 28px",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 0.5,
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
              }}
            >
              OK, PODE CONFIAR
            </button>
          </div>
        )}

        {/* Time of day choice buttons */}
        {showTimeChoices && !timeChoice && (
          <div style={{ padding: "10px 14px 22px", background: "#ede8e1", display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", animation: "slideUp 0.35s ease" }}>
            {[
              { emoji: "🧑", label: "Manhã" },
              { emoji: "🌤️", label: "Tarde" },
              { emoji: "🌙", label: "Noite" },
              { emoji: "🎒", label: "Madrugada" },
            ].map(({ emoji, label }) => (
              <button
                key={label}
                onClick={() => { setTimeChoice(`${emoji} ${label}`); setShowTimeChoices(false); }}
                style={{
                  background: "#25a898",
                  color: "white",
                  border: "none",
                  borderRadius: 20,
                  padding: "11px 16px",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 0.3,
                  cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 15 }}>{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Type choice buttons — AS SAFADAS / AS EXPERIENTES / AS COROAS */}
        {showTypeChoices && !typeChoice && (
          <div style={{ padding: "10px 14px 22px", background: "#ede8e1", display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", animation: "slideUp 0.35s ease" }}>
            {[
              { emoji: "😈", label: "AS SAFADAS" },
              { emoji: "🌿", label: "AS EXPERIENTES" },
              { emoji: "🔥", label: "AS COROAS" },
            ].map(({ emoji, label }) => (
              <button
                key={label}
                onClick={() => { setTypeChoice(`${emoji} ${label}`); setShowTypeChoices(false); triggerTypeReply(); }}
                style={{
                  background: "#25a898",
                  color: "white",
                  border: "none",
                  borderRadius: 20,
                  padding: "11px 16px",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 0.3,
                  cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 15 }}>{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Age choice buttons — appears after fin2 */}
        {showChoices2 && (
          <div style={{ padding: "10px 14px 22px", background: "#ede8e1", display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", animation: "slideUp 0.35s ease" }}>
            {["ENTRE 20 E 30 ANOS", "ENTRE 30 E 40 ANOS", "40 ANOS PRA CIMA"].map((option) => (
              <button
                key={option}
                onClick={() => selectAgeChoice(option)}
                style={{
                  background: "#25a898",
                  color: "white",
                  border: "none",
                  borderRadius: 20,
                  padding: "10px 18px",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 0.3,
                  cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%            { transform: translateY(-6px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
