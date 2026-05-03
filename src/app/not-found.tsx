"use client";

import {
  NotFoundContainer,
  NotFoundContent,
  NotFoundTitle,
  NotFoundSubtitle,
  NotFoundDescription,
  ButtonGroup,
  BackButton,
  SecondaryButton,
  BackgroundDecoration,
  DecorativeCircle,
  Emoji,
} from "./not-found.styles";

export default function NotFound() {
  return (
    <NotFoundContainer>
      <BackgroundDecoration>
        <DecorativeCircle
          $size="20rem"
          $position="top: -10rem; left: -10rem;"
        />
        <DecorativeCircle
          $size="15rem"
          $position="bottom: -8rem; right: -8rem;"
        />
        <DecorativeCircle
          $size="12rem"
          $position="top: 50%; left: 50%; transform: translate(-50%, -50%);"
        />
      </BackgroundDecoration>

      <NotFoundContent>
        <Emoji>🍹</Emoji>
        <NotFoundTitle>404</NotFoundTitle>
        <NotFoundSubtitle>Oops! Page Not Found</NotFoundSubtitle>
        <NotFoundDescription>
          Looks like this page went missing faster than ice melting in a mojito!
          Don&apos;t worry though, there are plenty of other amazing places to
          explore.
        </NotFoundDescription>
        <ButtonGroup>
          <BackButton href="/">Go Home</BackButton>
          <SecondaryButton href="/shop">Browse Shop</SecondaryButton>
        </ButtonGroup>
      </NotFoundContent>
    </NotFoundContainer>
  );
}
