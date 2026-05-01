import { useState, useEffect } from "react";

const LINK = "SEU_LINK_AQUI";

const messages = [
  { from: "bot", text: "Olá! Me chamo Gabriela e vou te ajudar a entrar no grupo 🔥", delay: 0 },
  { from: "user", text: "QUERO ENTRAR", delay: 1200 },
  { from: "bot", text: "Certo amor, vou te ajudar...", delay: 2200 },
];

export default function ChatPage() {
  const [visible, setVisible] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let i = 0;

    function step() {
      if (i >= messages.length) {
        setTimeout(() => setShowButton(true), 600);
        return;
      }
      const msg = messages[i];
      if (msg.from === "bot" && i > 0) {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          setVisible((v) => v + 1);
          i++;
          step();
        }, 900);
      } else {
        setVisible((v) => v + 1);
        i++;
        setTimeout(step, 900);
      }
    }

    const timer = setTimeout(step, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Arial, sans-serif",
        background: "#ece5dd",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          minHeight: "100vh",
          background: "#e5ddd5",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c8bdb0' fill-opacity='0.18'%3E%3Cpath d='M40 0L0 40l40 40 40-40z'/%3E%3C/g%3E%3C/svg%3E\")",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 0 40px rgba(0,0,0,0.18)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#075e54",
            color: "white",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            position: "sticky",
            top: 0,
            zIndex: 10,
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "#25d366",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              flexShrink: 0,
              border: "2px solid #128c7e",
            }}
          >
            👩
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Gaby</div>
            <div style={{ fontSize: 12, opacity: 0.85, display: "flex", alignItems: "center", gap: 4 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#25d366",
                  display: "inline-block",
                }}
              />
              online
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div
          style={{
            flex: 1,
            padding: "16px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            minHeight: 380,
          }}
        >
          {messages.slice(0, visible).map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                animation: "fadeSlide 0.25s ease",
              }}
            >
              <div
                style={{
                  background: msg.from === "user" ? "#dcf8c6" : "#ffffff",
                  color: "#111b21",
                  borderRadius:
                    msg.from === "user"
                      ? "12px 2px 12px 12px"
                      : "2px 12px 12px 12px",
                  padding: "8px 12px",
                  maxWidth: "72%",
                  fontSize: 14.5,
                  lineHeight: 1.45,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.13)",
                  position: "relative",
                }}
              >
                {msg.text}
                <span
                  style={{
                    display: "block",
                    fontSize: 11,
                    color: "#8696a0",
                    textAlign: "right",
                    marginTop: 2,
                  }}
                >
                  {new Date().toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {msg.from === "user" && (
                    <span style={{ marginLeft: 4, color: "#53bdeb" }}>✓✓</span>
                  )}
                </span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "2px 12px 12px 12px",
                  padding: "10px 16px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.13)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#8696a0",
                      display: "inline-block",
                      animation: `bounce 1s ease-in-out ${i * 0.18}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA Button */}
        {showButton && (
          <div
            style={{
              padding: "12px 16px 28px",
              background: "transparent",
            }}
          >
            <a
              href={LINK}
              style={{
                display: "block",
                textAlign: "center",
                background: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
                color: "white",
                borderRadius: 14,
                padding: "16px 24px",
                fontWeight: 800,
                fontSize: 16,
                letterSpacing: 0.5,
                textDecoration: "none",
                boxShadow: "0 4px 18px rgba(37,211,102,0.45)",
                animation: "popIn 0.35s cubic-bezier(.34,1.56,.64,1)",
                cursor: "pointer",
              }}
            >
              ENTRAR NO GRUPO
            </a>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%            { transform: translateY(-6px); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
