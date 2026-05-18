import React from "react";
import { render, screen } from "../../../__tests__/test-utils";
import MediaEventsPageClient from "../MediaEventsPageClient";

jest.mock("../../../components/Navigation/Navigation", () =>
  function MockNavigation() {
    return <div data-testid="navigation" />;
  },
);
jest.mock("../../../components/Footer/Footer", () =>
  function MockFooter() {
    return <div data-testid="footer" />;
  },
);

describe("MediaEventsPageClient", () => {
  it("renders the media & events heading", () => {
    render(<MediaEventsPageClient />);
    expect(screen.getByText("Media & Events")).toBeInTheDocument();
  });

  it("renders navigation and footer", () => {
    render(<MediaEventsPageClient />);
    expect(screen.getByTestId("navigation")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders upcoming event titles", () => {
    render(<MediaEventsPageClient />);
    expect(screen.getByText("Pop-Up Market Experience")).toBeInTheDocument();
    expect(screen.getByText("Mocktail Masterclass")).toBeInTheDocument();
  });
});
