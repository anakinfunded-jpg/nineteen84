"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="sl" className="dark">
      <body
        style={{
          margin: 0,
          backgroundColor: "#171717",
          color: "#E1E1E1",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "400px", padding: "2rem" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "rgba(239, 68, 68, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              fontSize: "1.5rem",
            }}
          >
            !
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#fff", margin: 0 }}>
            Prišlo je do napake
          </h2>
          <p style={{ fontSize: "0.875rem", color: "rgba(225,225,225,0.5)", marginTop: "0.5rem" }}>
            Nekaj je šlo narobe. Prosimo, poskusite znova.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 2rem",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(90deg, #FFB288, #FEB089, #EE94B0)",
              color: "#171717",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            Poskusi znova
          </button>
        </div>
      </body>
    </html>
  );
}
