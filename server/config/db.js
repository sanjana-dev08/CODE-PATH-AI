const mongoose = require("mongoose");
const dns = require("dns");
const { execFileSync } = require("child_process");

const configureWindowsDns = () => {
  if (process.platform !== "win32" || !dns.getServers().every((server) => ["127.0.0.1", "::1"].includes(server))) return;
  try {
    const output = execFileSync("powershell.exe", [
      "-NoProfile",
      "-NonInteractive",
      "-Command",
      "(Get-DnsClientServerAddress -AddressFamily IPv4 | Where-Object { $_.ServerAddresses.Count -gt 0 } | Select-Object -ExpandProperty ServerAddresses -Unique) -join ','",
    ], { encoding: "utf8", timeout: 3000, stdio: ["ignore", "pipe", "ignore"] });
    const servers = output.trim().split(",").filter(Boolean);
    if (servers.length) dns.setServers(servers);
  } catch {
    return;
  }
};

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from server/.env");
  }

  try {
    configureWindowsDns();
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log("MongoDB connected successfully");
    return mongoose.connection;
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
};

module.exports = connectDB;