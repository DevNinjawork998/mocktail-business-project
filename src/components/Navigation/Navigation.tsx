import type { JSX } from "react";
import NavigationClient from "./NavigationClient";

interface NavigationProps {
  cartIconEnabled?: boolean;
}

export default function Navigation({
  cartIconEnabled = true,
}: NavigationProps): JSX.Element {
  return <NavigationClient cartIconEnabled={cartIconEnabled} />;
}
