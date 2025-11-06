import http from "http";

const PORT = process.env.VERIFY_PORT || 9090;
const EXPECTED = process.env.MCP_SSE_ACCESS_KEY;

http
  .createServer((req, res) => {
    if (!req.url?.startsWith("/verify")) {
      res.writeHead(404);
      return res.end();
    }

    const url = new URL(req.url, "http://localhost");
    const key = url.searchParams.get("apiKey");
    const ok = EXPECTED && key === EXPECTED;

    res.writeHead(ok ? 200 : 401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ valid: !!ok }));
  })
  .listen(PORT, () => {
    console.log(
      `Auth verify server running on http://127.0.0.1:${PORT}/verify`
    );
  });
