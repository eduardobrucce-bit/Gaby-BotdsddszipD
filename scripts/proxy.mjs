import net from "net";

const PROXY_PORT = 24237;
const TARGET_PORT = 5000;

const server = net.createServer((client) => {
  const target = net.connect(TARGET_PORT, "127.0.0.1", () => {
    client.pipe(target);
    target.pipe(client);
  });
  target.on("error", () => client.destroy());
  client.on("error", () => target.destroy());
});

server.listen(PROXY_PORT, "0.0.0.0", () => {
  console.log(`Proxy: ${PROXY_PORT} → ${TARGET_PORT}`);
});
