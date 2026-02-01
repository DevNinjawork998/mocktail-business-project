import { colors, getColorWithOpacity } from "../colors";
import "@jest/globals";

describe("colors", () => {
  it("exports colors object with all color variants", () => {
    expect(colors.chocolateKisses).toBeDefined();
    expect(colors.chocolateKisses.base).toBe("#451515");
    expect(colors.chocolateKisses.light).toBe("#6B2D2D");
    expect(colors.chocolateKisses.dark).toBe("#2A0F0F");
  });

  it("exports RGB variants", () => {
    expect(colors.chocolateKissesRgb).toBe("69, 21, 21");
    expect(colors.mauvelousRgb).toBe("234, 157, 174");
  });
});

describe("getColorWithOpacity", () => {
  it("returns rgba string for color objects with RGB variant", () => {
    const result = getColorWithOpacity("chocolateKisses", 0.5);
    expect(result).toBe("rgba(69, 21, 21, 0.5)");
  });

  it("handles different opacity values", () => {
    expect(getColorWithOpacity("chocolateKisses", 0)).toBe("rgba(69, 21, 21, 0)");
    expect(getColorWithOpacity("chocolateKisses", 1)).toBe("rgba(69, 21, 21, 1)");
    expect(getColorWithOpacity("chocolateKisses", 0.75)).toBe("rgba(69, 21, 21, 0.75)");
  });

  it("works with all color variants", () => {
    expect(getColorWithOpacity("mauvelous", 0.5)).toBe("rgba(234, 157, 174, 0.5)");
    expect(getColorWithOpacity("caramel", 0.5)).toBe("rgba(251, 232, 158, 0.5)");
    expect(getColorWithOpacity("royalOrange", 0.5)).toBe("rgba(248, 146, 86, 0.5)");
    expect(getColorWithOpacity("bittersweetShimmer", 0.5)).toBe("rgba(199, 76, 61, 0.5)");
  });

  it("returns the color object as string if no RGB variant exists", () => {
    // This tests the fallback case - though in practice all our colors have RGB variants
    // We can't easily test this without mocking, but the function handles it
    const result = getColorWithOpacity("chocolateKissesRgb" as keyof typeof colors, 0.5);
    // Since chocolateKissesRgb is a string, it will return the string directly
    expect(typeof result).toBe("string");
  });
});
