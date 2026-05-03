"use client";

import React, { useEffect, useState } from "react";

/**
 * Component that only renders its children on the client side.
 * Useful for bypassing SSR for components that cause build errors or hydration mismatches.
 */
export default function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}
