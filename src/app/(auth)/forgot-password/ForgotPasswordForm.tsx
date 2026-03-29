"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { requestPasswordReset } from "@/app/actions/password-reset";
import * as S from "../login/LoginForm.styles";
import * as F from "./ForgotPasswordForm.styles";

const schema = z.object({
  email: z.email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const result = await requestPasswordReset(data.email);
      if (result.success) {
        setMessage(result.data.message);
        setSubmitted(true);
      } else {
        setError(result.error);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <S.PageContainer>
      <S.LoginCard>
        <S.LogoContainer>
          <S.Logo>Reset password</S.Logo>
          <S.Tagline>
            Enter your account email. If it exists, we will send reset
            instructions.
          </S.Tagline>
        </S.LogoContainer>

        {submitted && message ? (
          <>
            <F.SuccessPanel>{message}</F.SuccessPanel>
            <F.BackRow>
              <S.TextLink href="/login">Back to sign in</S.TextLink>
            </F.BackRow>
          </>
        ) : (
          <S.Form onSubmit={handleSubmit(onSubmit)}>
            {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

            <S.FormGroup>
              <S.Label htmlFor="forgot-email">Email</S.Label>
              <S.Input
                id="forgot-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register("email")}
                $hasError={!!errors.email}
                disabled={isLoading}
              />
              {errors.email && (
                <S.FieldError>{errors.email.message}</S.FieldError>
              )}
            </S.FormGroup>

            <S.SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? "Sending…" : "Send reset link"}
            </S.SubmitButton>

            <F.BackRow>
              <S.TextLink href="/login">Back to sign in</S.TextLink>
            </F.BackRow>
          </S.Form>
        )}

        <S.Footer>
          <S.FooterText>
            Protected area. Authorized personnel only.
          </S.FooterText>
        </S.Footer>
      </S.LoginCard>
    </S.PageContainer>
  );
}
