import dns from "dns/promises";
import { SMTPClient } from "smtp-client";

export async function verifyEmail(email) {
  const start = Date.now();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const domain = email.split("@")[1];
  let mxRecords = [];

  try {
    const records = await dns.resolveMx(domain);
    mxRecords = records.sort((a, b) => a.priority - b.priority).map(r => r.exchange);
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

  // Try SMTP connection
  try {
    const client = new SMTPClient({ host: mxRecords[0], port: 25 });
    await client.connect();
    await client.greet({ hostname: "example.com" });
    await client.mail({ from: "test@example.com" });
    const response = await client.rcpt({ to: email });

    await client.quit();

    let result = "unknown";
    let resultcode = 3;
    let subresult = "smtp_response";

    if (response.code === 250) {
      result = "valid";
      resultcode = 1;
      subresult = "mailbox_exists";
    } else if (response.code === 550) {
      result = "invalid";
      resultcode = 6;
      subresult = "mailbox_does_not_exist";
    } else if (response.code === 450) {
      result = "unknown";
      resultcode = 3;
      subresult = "greylisted";
    }

    return {
      email,
      result,
      resultcode,
      subresult,
      domain,
      mxRecords,
      executiontime: (Date.now() - start) / 1000,
      error: null,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    return {
      email,
      result: "unknown",
      resultcode: 3,
      subresult: "connection_error",
      domain,
      mxRecords,
      executiontime: (Date.now() - start) / 1000,
      error: err.message,
      timestamp: new Date().toISOString()
    };
  }
}
