import Image from "next/image";
import * as S from "./HeroSlideshow.styles";

const HeroSlideshow = () => {
  return (
    <S.ProductImageContainer>
      <S.ImageWrapper>
        <Image
          src="/images/products/LandingPhoto.jpg"
          alt="Mocktails On the Go - Fresh Mocktail"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </S.ImageWrapper>
      <S.Badge>🌿 Adaptogen Powered</S.Badge>
      <S.BadgeBottom>🍊 Wholesome Ingredients Only</S.BadgeBottom>
    </S.ProductImageContainer>
  );
};

export default HeroSlideshow;
