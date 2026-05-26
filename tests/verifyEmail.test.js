import { verifyEmail } from "../src/verifyEmail.js";

test("valid email format passes", async () => {
  const result = await verifyEmail("user@gmail.com");
  expect(result.result).toBeDefined();
});

test("invalid format rejected", async () => {
  const result = await verifyEmail("invalid@@gmail..com");
  expect(result.result).toBe("invalid");
});

test("empty string handled", async () => {
  const result = await verifyEmail("");
  expect(result.result).toBe("invalid");
});
