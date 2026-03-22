import React from "react";
import Image from "next/image";

/** Decorative tap hint (brand asset; paired with aria-label on the interactive card). */
export function FlipHintIcon(): React.ReactElement {
  return (
    <Image
      src="/images/ingredient-card-tap-hint.png"
      alt=""
      width={86}
      height={102}
      sizes="24px"
      aria-hidden
      style={{
        width: "1.35rem",
        height: "auto",
        objectFit: "contain",
      }}
    />
  );
}
