import dns from "dns/promises";

export async function verifyEmail(email) {
  const start = Date.now();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  try {
    // Step 1: Syntax check
    if (!regex.test(email)) {
      return {
        email,
        result: "invalid",
        resultcode: 6,
        subresult: "invalid_syntax",
        domain: null,
        mxRecords: [],
        executiontime: (Date.now() - start) / 1000,
        error: "Invalid email format",
        timestamp: new Date().toISOString()
      };
    }

    // Step 2: MX record lookup
    const domain = email.split("@")[1];
    let mxRecords = [];

    try {
      const records = await dns.resolveMx(domain);
      mxRecords = records
        .sort((a, b) => a.priority - b.priority)
        .map(r => r.exchange);

      return {
        email,
        result: "valid",
        resultcode: 1,
        subresult: "mx_found",
        domain,
        mxRecords,
        executiontime: (Date.now() - start) / 1000,
        error: null,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      return {
        email,
        result: "invalid",
        resultcode: 6,
        subresult: "mx_lookup_failed",
        domain,
        mxRecords: [],
        executiontime: (Date.now() - start) / 1000,
        error: err.message,
        timestamp: new Date().toISOString()
      };
    }
  } catch (err) {
    return {
      email,
      result: "invalid",
      resultcode: 500,
      subresult: "unexpected_error",
      domain: null,
      mxRecords: [],
      executiontime: (Date.now() - start) / 1000,
      error: err.message,
      timestamp: new Date().toISOString()
    };
  }
}
