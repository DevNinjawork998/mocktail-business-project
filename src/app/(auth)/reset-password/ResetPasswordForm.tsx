"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPasswordWithToken } from "@/app/actions/password-reset";
import * as S from "../login/LoginForm.styles";
import * as R from "./ResetPasswordForm.styles";

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

interface ResetPasswordFormProps {
  initialToken: string;
}

export default function ResetPasswordForm({
  initialToken,
}: ResetPasswordFormProps) {
  const router = useRouter();
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

    try {
      const result = await resetPasswordWithToken(initialToken, data.password);
      if (result.success) {
        router.push("/login?reset=success");
        router.refresh();
        return;
      }
      setError(result.error);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!initialToken.trim()) {
    return (
      <S.PageContainer>
        <S.LoginCard>
          <S.LogoContainer>
            <S.Logo>Reset password</S.Logo>
            <S.Tagline>This link is missing a token or has expired.</S.Tagline>
          </S.LogoContainer>
          <R.TokenMissingPanel>
            Request a new reset link from the forgot password page.
          </R.TokenMissingPanel>
          <R.ActionsRow>
            <S.TextLink href="/forgot-password">Request reset link</S.TextLink>
            <S.TextLink href="/login">Back to sign in</S.TextLink>
          </R.ActionsRow>
          <S.Footer>
            <S.FooterText>
              Protected area. Authorized personnel only.
            </S.FooterText>
          </S.Footer>
        </S.LoginCard>
      </S.PageContainer>
    );
  }

  return (
    <S.PageContainer>
      <S.LoginCard>
        <S.LogoContainer>
          <S.Logo>Choose a new password</S.Logo>
          <S.Tagline>Use at least 6 characters.</S.Tagline>
        </S.LogoContainer>

        <S.Form onSubmit={handleSubmit(onSubmit)}>
          {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

          <S.FormGroup>
            <S.Label htmlFor="reset-password">New password</S.Label>
            <S.Input
              id="reset-password"
              type="password"
              autoComplete="new-password"
              placeholder="New password"
              {...register("password")}
              $hasError={!!errors.password}
              disabled={isLoading}
            />
            {errors.password && (
              <S.FieldError>{errors.password.message}</S.FieldError>
            )}
          </S.FormGroup>

          <S.FormGroup>
            <S.Label htmlFor="reset-password-confirm">Confirm password</S.Label>
            <S.Input
              id="reset-password-confirm"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm password"
              {...register("confirmPassword")}
              $hasError={!!errors.confirmPassword}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <S.FieldError>{errors.confirmPassword.message}</S.FieldError>
            )}
          </S.FormGroup>

          <S.SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "Updating…" : "Update password"}
          </S.SubmitButton>

          <R.ActionsRow>
            <S.TextLink href="/login">Back to sign in</S.TextLink>
          </R.ActionsRow>
        </S.Form>

        <S.Footer>
          <S.FooterText>
            Protected area. Authorized personnel only.
          </S.FooterText>
        </S.Footer>
      </S.LoginCard>
    </S.PageContainer>
  );
}
