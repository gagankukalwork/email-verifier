import { getDidYouMean } from "../src/getDidYouMean.js";

test("gmial.com corrected to gmail.com", () => {
  expect(getDidYouMean("user@gmial.com")).toBe("user@gmail.com");
});

test("yahooo.com corrected to yahoo.com", () => {
  expect(getDidYouMean("test@yahooo.com")).toBe("test@yahoo.com");
});

test("valid domain returns null", () => {
  expect(getDidYouMean("user@gmail.com")).toBe(null);
});
