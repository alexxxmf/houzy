import { priceFormatter } from "./index";

describe("priceFormatter", () => {
  it("formats and rounds price as expected", () => {
    const formattedPrice = priceFormatter(12065);
    expect(formattedPrice).toBe("121€");
  });
  it("formats price and does not round up decimals when explictly stated", () => {
    const formattedPrice = priceFormatter(12065, false);
    expect(formattedPrice).toBe("120.65€");
  });
});
