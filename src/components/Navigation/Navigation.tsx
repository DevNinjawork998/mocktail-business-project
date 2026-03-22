import type { JSX } from "react";
import { isCartIconEnabled } from "@/lib/featureFlags";
import NavigationClient from "./NavigationClient";

export default function Navigation(): JSX.Element {
  return <NavigationClient cartIconEnabled={isCartIconEnabled()} />;
}
