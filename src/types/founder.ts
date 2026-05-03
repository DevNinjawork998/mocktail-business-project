export interface FounderStoryData {
  paragraphs: string[];
  quote: string;
  author: string;
  imageUrl?: string | null;
}

export const DEFAULT_FOUNDER_STORY: FounderStoryData = {
  paragraphs: [
    "Growing up, stress was a constant companion in my life. For a long time, the only way I knew how to cope was by turning to alcohol. I wasn't addicted, but I loved experimenting with fun cocktails for family and friends, creating little moments of joy. Yet, over time, I realized that the satisfaction was fleeting. The hangovers, the calories, and the guilt that followed each drink began to weigh on me.",
    "One day, I asked myself a simple but powerful question: What if I could enjoy drinks without the guilt? That question sparked a journey. I tried everything, flavoured sodas, zero-calorie sparkling waters, kombuchas. They tasted good, but they didn't nourish me or make me feel better in the long run. Even the mocktails I found in stores felt like watered-down versions of real cocktails, missing the magic and craft behind them.",
    "That's when I knew I wanted to change the drinking scene in Malaysia. I envisioned something different, mocktails that weren't just alcohol-free, but functional, inclusive, and designed for everyone. Drinks that could be a true companion, refreshing, uplifting, and guilt-free. With that vision, Mocktails On The Go was born. We created bottled mocktails that are low in calories and sugar, but enriched with functional botanicals like ashwagandha, baobab, and maca.",
    "This brand is more than just drinks. It's about rewriting the story of social sipping, celebrating without compromise, connecting without guilt, and feeling good about what you put into your body. From our hearts to yours, I truly hope our mocktails bring you the same comfort, confidence, and happiness they've brought us. And if they make even a small difference in your life, then this journey has been worth every sleepless night and step of the way.",
  ],
  quote: "Sip without guilt with our mocktails",
  author: "- Krishanthini, founder",
  imageUrl: "/images/founder/founder.png",
};
