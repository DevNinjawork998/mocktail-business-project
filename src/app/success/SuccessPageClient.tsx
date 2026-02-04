"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import * as S from "./SuccessPageClient.styles";

const funConfetti = ["🍹", "🍸", "🍾", "🎉", "✨", "🍋", "🍊", "🍒"];

const SuccessPageClient: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [confettiArray, setConfettiArray] = useState<
    {
      emoji: string;
      left: number;
      delay: number;
    }[]
  >([]);

  useEffect(() => {
    const sessionIdParam = searchParams.get("session_id");
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
    }
    clearCart();
    const confetti = Array.from({ length: 18 }).map(() => ({
      emoji: funConfetti[Math.floor(Math.random() * funConfetti.length)],
      left: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setConfettiArray(confetti);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <S.SuccessContainerStyled>
      <S.Confetti>
        {confettiArray.map((c, i) => (
          <span
            key={i}
            style={{
              left: `${c.left}%`,
              animationDelay: `${c.delay}s`,
            }}
          >
            {c.emoji}
          </span>
        ))}
      </S.Confetti>
      <S.CocktailEmoji>🍹</S.CocktailEmoji>
      <S.SuccessIconStyled>✓</S.SuccessIconStyled>
      <S.SuccessTitleStyled>
        Cheers! Your Order is Shaking Things Up!
      </S.SuccessTitleStyled>
      <S.SuccessMessageStyled>
        Thank you for being the life of the party!{" "}
        <span role="img" aria-label="cheers">
          🍸
        </span>
        <br />
        We&apos;re mixing your cocktails and getting them ready for delivery.
        Get ready to sip, savor, and celebrate!
      </S.SuccessMessageStyled>
      {sessionId && (
        <S.OrderDetailsStyled>
          <S.OrderId>Your Cocktail Order Code:</S.OrderId>
          <S.OrderIdValue>{sessionId}</S.OrderIdValue>
          <p style={{ color: "#6b7280", fontSize: "0.9rem", marginTop: 8 }}>
            Please save this order code for your records. You&apos;ll also
            receive a confirmation email shortly.
          </p>
        </S.OrderDetailsStyled>
      )}
      <S.NextSteps>
        <S.NextStepsTitle>What happens next?</S.NextStepsTitle>
        <S.NextStepsList>
          <S.NextStepsItem>
            • You&apos;ll receive an order confirmation email within a few
            minutes
          </S.NextStepsItem>
          <S.NextStepsItem>
            • Our team will review your order and begin preparation
          </S.NextStepsItem>
          <S.NextStepsItem>
            • We&apos;ll contact you to arrange delivery or pickup
          </S.NextStepsItem>
          <S.NextStepsItem>
            • Your cocktails will be delivered within 3–7 business days
          </S.NextStepsItem>
        </S.NextStepsList>
      </S.NextSteps>
      <S.ActionButtons>
        <S.PrimaryButton onClick={() => router.push("/shop")}>
          Continue Shopping
        </S.PrimaryButton>
        <S.SecondaryButton onClick={() => router.push("/")}>
          Back to Home
        </S.SecondaryButton>
      </S.ActionButtons>
      <S.SocialShare>
        Share your cocktail excitement! Tag us <b>@mocktailsonthego_motg</b> on
        Instagram 🍹
      </S.SocialShare>
    </S.SuccessContainerStyled>
  );
};

export default SuccessPageClient;
