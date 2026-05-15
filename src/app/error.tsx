"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #451515 0%, #2a0d0d 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.1,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "20rem",
            height: "20rem",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FAC358 0%, #D4AAB3 100%)",
            top: "-10rem",
            left: "-10rem",
            filter: "blur(2rem)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "15rem",
            height: "15rem",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FAC358 0%, #D4AAB3 100%)",
            bottom: "-8rem",
            right: "-8rem",
            filter: "blur(2rem)",
          }}
        />
      </div>

      <div
        style={{
          textAlign: "center",
          maxWidth: "600px",
          zIndex: 2,
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>😵‍💫</div>
        <h1
          style={{
            fontSize: "4rem",
            fontWeight: "bold",
            color: "#FAC358",
            marginBottom: "1.5rem",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            margin: "0 0 1.5rem 0",
          }}
        >
          Oops!
        </h1>
        <h2
          style={{
            fontSize: "1.875rem",
            fontWeight: "bold",
            color: "#D4AAB3",
            margin: "0 0 1rem 0",
          }}
        >
          Something Went Wrong
        </h2>
        <p
          style={{
            fontSize: "1.125rem",
            color: "#D4AAB3",
            margin: "0 0 2rem 0",
            lineHeight: "1.6",
            opacity: 0.9,
          }}
        >
          Looks like our cocktail mixer had a little hiccup! Don&apos;t worry,
          these things happen. Try refreshing the page or head back home for a
          fresh start.
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={reset}
            style={{
              background: "linear-gradient(135deg, #DD541C, #C0392B)",
              color: "white",
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "9999px",
              fontWeight: "bold",
              fontSize: "1.125rem",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
          <a
            href="/"
            style={{
              background: "transparent",
              color: "#FAC358",
              padding: "0.75rem 1.5rem",
              border: "2px solid #FAC358",
              borderRadius: "9999px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "1.125rem",
              display: "inline-block",
            }}
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
