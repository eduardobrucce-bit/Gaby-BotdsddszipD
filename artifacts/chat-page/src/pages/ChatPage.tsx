import { useState, useEffect, useRef } from "react";

const LINK = "SEU_LINK_AQUI";
const TIME = "21:19";

type Step = "audio" | "image" | "button";

export default function ChatPage() {
  const [step, setStep] = useState<Step[]>([]);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(["audio"]), 500);
    const t2 = setTimeout(() => setStep(["audio", "image"]), 1400);
    const t3 = setTimeout(() => setStep(["audio", "image", "button"]), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  function togglePlay() {
    if (playing) {
      clearInterval(intervalRef.current!);
      setPlaying(false);
    } else {
      setPlaying(true);
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(intervalRef.current!);
            setPlaying(false);
            return 0;
          }
          return p + 2;
        });
      }, 60);
    }
  }

  const bgPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg opacity='0.07' fill='%23a0998d'%3E%3Cpath d='M30 5 C20 5 12 13 12 23 C12 28 14 33 18 36 L16 45 L25 40 C26.6 40.6 28.3 41 30 41 C40 41 48 33 48 23 C48 13 40 5 30 5 Z'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#ece5dd", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 430, minHeight: "100vh", background: "#ede8e1", backgroundImage: bgPattern, display: "flex", flexDirection: "column", position: "relative" }}>

        {/* ── Header ── */}
        <div style={{ background: "#075e54", color: "white", padding: "8px 10px 8px 12px", display: "flex", alignItems: "center", gap: 10, position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.25)" }}>
          {/* back arrow */}
          <svg width="11" height="18" viewBox="0 0 11 18" fill="none" style={{ flexShrink: 0 }}>
            <path d="M10 1L2 9L10 17" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {/* avatar */}
          <div style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid #128c7e" }}>
            <img src="/patricia.png" alt="Patrícia" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", gap: 4 }}>
              Patrícia
              {/* verified checkmark */}
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="7.5" r="7" fill="#25d366"/>
                <path d="M4 7.5L6.5 10L11 5.5" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ fontSize: 12, opacity: 0.88 }}>online</div>
          </div>
          {/* three dots */}
          <svg width="4" height="18" viewBox="0 0 4 18" fill="white" style={{ flexShrink: 0 }}>
            <circle cx="2" cy="2" r="2"/><circle cx="2" cy="9" r="2"/><circle cx="2" cy="16" r="2"/>
          </svg>
        </div>

        {/* ── Chat body ── */}
        <div style={{ flex: 1, padding: "10px 10px 8px", display: "flex", flexDirection: "column", gap: 2 }}>

          {/* "Hoje" separator */}
          <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
            <span style={{ background: "#e1d8cf", color: "#4a4a4a", fontSize: 12, padding: "3px 12px", borderRadius: 10, boxShadow: "0 1px 1px rgba(0,0,0,0.1)" }}>
              Hoje
            </span>
          </div>

          {/* "Conta comercial" notice */}
          <div style={{ display: "flex", justifyContent: "center", margin: "4px 0 10px" }}>
            <div style={{ background: "#fffde7", border: "1px solid #d4c47a", borderRadius: 10, padding: "6px 14px", fontSize: 12.5, color: "#5c5c00", display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6.5" stroke="#a09020" strokeWidth="1.2" fill="none"/>
                <text x="7" y="11" textAnchor="middle" fontSize="9" fill="#a09020" fontWeight="bold">i</text>
              </svg>
              Conta comercial
            </div>
          </div>

          {/* Audio message */}
          {step.includes("audio") && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 6, animation: "fadeSlide 0.3s ease" }}>
              <div style={{ background: "#ffffff", borderRadius: "2px 12px 12px 12px", padding: "10px 14px 8px", maxWidth: "78%", boxShadow: "0 1px 2px rgba(0,0,0,0.13)", minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {/* play button */}
                  <button onClick={togglePlay} style={{ width: 34, height: 34, borderRadius: "50%", background: "#075e54", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {playing ? (
                      <svg width="12" height="13" viewBox="0 0 12 13" fill="white">
                        <rect x="1" y="1" width="3.5" height="11" rx="1"/><rect x="7.5" y="1" width="3.5" height="11" rx="1"/>
                      </svg>
                    ) : (
                      <svg width="12" height="13" viewBox="0 0 12 13" fill="white">
                        <path d="M2 1.5L11 6.5L2 11.5V1.5Z"/>
                      </svg>
                    )}
                  </button>
                  {/* waveform */}
                  <div style={{ flex: 1, position: "relative", height: 28, display: "flex", alignItems: "center" }}>
                    <div style={{ width: "100%", height: 3, background: "#d0d0d0", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ width: `${progress}%`, height: "100%", background: "#075e54", borderRadius: 2, transition: "width 0.06s linear" }} />
                    </div>
                    {/* waveform bars decoration */}
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", gap: 2, pointerEvents: "none" }}>
                      {[4,7,5,10,6,8,4,9,5,7,6,8,5,4,7,9,6,5,8,4].map((h, i) => (
                        <div key={i} style={{ width: 2, height: h, background: progress > (i / 20) * 100 ? "#075e54" : "#c8c8c8", borderRadius: 1, flexShrink: 0 }} />
                      ))}
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: "#8696a0", flexShrink: 0 }}>0:07</span>
                </div>
                <div style={{ fontSize: 11, color: "#8696a0", textAlign: "right", marginTop: 4 }}>{TIME}</div>
              </div>
            </div>
          )}

          {/* Image message */}
          {step.includes("image") && (
            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-end", gap: 6, animation: "fadeSlide 0.3s ease" }}>
              {/* small avatar */}
              <div style={{ width: 28, height: 28, borderRadius: "50%", overflow: "hidden", flexShrink: 0, marginBottom: 2 }}>
                <img src="/patricia.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
              </div>
              <div style={{ background: "#ffffff", borderRadius: "2px 12px 12px 12px", overflow: "hidden", maxWidth: "72%", boxShadow: "0 1px 2px rgba(0,0,0,0.13)", position: "relative" }}>
                <img src="/patricia.png" alt="foto" style={{ width: "100%", display: "block", borderRadius: "2px 12px 0 0" }} />
                <div style={{ fontSize: 11, color: "#8696a0", textAlign: "right", padding: "4px 10px 6px" }}>{TIME}</div>
              </div>
            </div>
          )}

        </div>

        {/* ── CTA Button ── */}
        {step.includes("button") && (
          <div style={{ padding: "4px 14px 30px", animation: "popIn 0.35s cubic-bezier(.34,1.56,.64,1)" }}>
            <a href={LINK} style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg,#25d366 0%,#128c7e 100%)", color: "white", borderRadius: 14, padding: "15px 24px", fontWeight: 800, fontSize: 16, letterSpacing: 0.4, textDecoration: "none", boxShadow: "0 4px 18px rgba(37,211,102,0.4)", cursor: "pointer" }}>
              ENTRAR NO GRUPO
            </a>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
