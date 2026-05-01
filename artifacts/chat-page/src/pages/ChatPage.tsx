export default function ChatPage() {
  const bgPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg opacity='0.07' fill='%23a0998d'%3E%3Cpath d='M30 5 C20 5 12 13 12 23 C12 28 14 33 18 36 L16 45 L25 40 C26.6 40.6 28.3 41 30 41 C40 41 48 33 48 23 C48 13 40 5 30 5 Z'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#ece5dd", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 430, minHeight: "100vh", background: "#ede8e1", backgroundImage: bgPattern, display: "flex", flexDirection: "column", position: "relative" }}>

        {/* ── Header ── */}
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

        </div>
      </div>
    </div>
  );
}
