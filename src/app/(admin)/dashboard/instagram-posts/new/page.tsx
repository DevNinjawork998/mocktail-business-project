"use client";

import dynamic from "next/dynamic";

const InstagramPostForm = dynamic(
  () => import("@/components/InstagramPostForm/InstagramPostForm"),
  {
    ssr: false,
  },
);

export default function NewInstagramPostPage() {
  return <InstagramPostForm />;
}
