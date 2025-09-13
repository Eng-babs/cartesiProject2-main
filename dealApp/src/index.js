// Import necessary modules
import { hexToString } from "viem";

// Fake addresses (demo only)
let storage_contract_address = "";
let nft_contract_address = "";

// Fake app object to simulate Cartesi Rollups
const app = {
  addAdvanceHandler: (handler) => {
    console.log("⚡ Advance handler registered (demo mode).");
    // We won't actually call the handler unless you want test inputs
  },
  createVoucher: ({ destination, payload }) => {
    console.log("📦 Voucher created:", { destination, payload });
  },
  start: async () => {
    console.log("🚀 Demo DApp started at http://0.0.0.0:5004");
    // Keep process alive
    setInterval(() => {}, 1000);
  },
};

// Register demo handler
app.addAdvanceHandler(async ({ metadata, payload }) => {
  const payloadString = hexToString(payload);
  console.log("Received payload:", payloadString);

  try {
    const jsonPayload = JSON.parse(payloadString);
    const sender = metadata?.msg_sender || "0xDEMO";
    console.log("Sender:", sender);

    if (jsonPayload.method === "set_address") {
      storage_contract_address = jsonPayload.address;
      console.log("✅ Storage contract address set:", storage_contract_address);
    } else if (jsonPayload.method === "generate_number") {
      const generated = jsonPayload.number * 2;
      console.log("✅ Generated number:", generated);
      app.createVoucher({
        destination: storage_contract_address,
        payload: `store(${generated})`,
      });
    } else if (jsonPayload.method === "mint_nft") {
      console.log("✅ Minting NFT for", sender);
      app.createVoucher({
        destination: nft_contract_address,
        payload: "mintTo(" + sender + ")",
      });
    }
  } catch (e) {
    console.error("❌ Failed to parse payload:", e.message);
  }

  return "accept";
});

// Start the demo app
app.start().catch((e) => {
  console.error("App failed:", e);
  process.exit(1);
});

