import React from "react";
import { render, screen, fireEvent } from "../../../__tests__/test-utils";
import SuccessPageClient from "../SuccessPageClient";
import { useRouter, useSearchParams } from "next/navigation";

// Mock Next.js navigation
const mockPush = jest.fn();
const mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock CartContext
const mockClearCart = jest.fn();
jest.mock("../../../contexts/CartContext", () => ({
  useCart: jest.fn(() => ({
    clearCart: mockClearCart,
  })),
  CartProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("SuccessPageClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockClearCart.mockClear();
    mockSearchParams.delete("session_id");
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  it("renders success title", () => {
    render(<SuccessPageClient />);

    expect(
      screen.getByText("Cheers! Your Order is Shaking Things Up!"),
    ).toBeInTheDocument();
  });

  it("renders success message", () => {
    render(<SuccessPageClient />);

    expect(
      screen.getByText(/Thank you for being the life of the party!/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /We're mixing your cocktails and getting them ready for delivery/,
      ),
    ).toBeInTheDocument();
  });

  it("renders cocktail emoji", () => {
    render(<SuccessPageClient />);

    // The emoji appears multiple times (in confetti and main display), so use getAllByText
    const emojis = screen.getAllByText("🍹");
    expect(emojis.length).toBeGreaterThan(0);
  });

  it("renders success icon", () => {
    render(<SuccessPageClient />);

    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  it("displays order details when session_id is present", () => {
    mockSearchParams.set("session_id", "test-session-123");

    render(<SuccessPageClient />);

    expect(screen.getByText("Your Cocktail Order Code:")).toBeInTheDocument();
    expect(screen.getByText("test-session-123")).toBeInTheDocument();
    expect(
      screen.getByText(/Please save this order code for your records/),
    ).toBeInTheDocument();
  });

  it("does not display order details when session_id is not present", () => {
    mockSearchParams.delete("session_id");

    render(<SuccessPageClient />);

    expect(
      screen.queryByText("Your Cocktail Order Code:"),
    ).not.toBeInTheDocument();
  });

  it("renders next steps section", () => {
    render(<SuccessPageClient />);

    expect(screen.getByText("What happens next?")).toBeInTheDocument();
    expect(
      screen.getByText(
        /You'll receive an order confirmation email within a few minutes/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Our team will review your order and begin preparation/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/We'll contact you to arrange delivery or pickup/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Your cocktails will be delivered within 3–7 business days/,
      ),
    ).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    render(<SuccessPageClient />);

    expect(screen.getByText("Continue Shopping")).toBeInTheDocument();
    expect(screen.getByText("Back to Home")).toBeInTheDocument();
  });

  it("navigates to shop when Continue Shopping button is clicked", () => {
    render(<SuccessPageClient />);

    const continueShoppingButton = screen.getByText("Continue Shopping");
    fireEvent.click(continueShoppingButton);

    expect(mockPush).toHaveBeenCalledWith("/shop");
  });

  it("navigates to home when Back to Home button is clicked", () => {
    render(<SuccessPageClient />);

    const backToHomeButton = screen.getByText("Back to Home");
    fireEvent.click(backToHomeButton);

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("clears cart on mount", () => {
    render(<SuccessPageClient />);

    expect(mockClearCart).toHaveBeenCalled();
  });

  it("renders social share text", () => {
    render(<SuccessPageClient />);

    expect(
      screen.getByText(/Share your cocktail excitement! Tag us/),
    ).toBeInTheDocument();
    expect(screen.getByText("@mocktailsonthego_motg")).toBeInTheDocument();
  });

  it("generates confetti on mount", () => {
    render(<SuccessPageClient />);

    // Confetti emojis should be rendered
    const confettiEmojis = ["🍹", "🍸", "🍾", "🎉", "✨", "🍋", "🍊", "🍒"];
    const foundEmojis = confettiEmojis.filter(
      (emoji) => screen.queryAllByText(emoji).length > 0,
    );
    // At least some confetti emojis should be present
    expect(foundEmojis.length).toBeGreaterThan(0);
  });
});
