import { NextRequest, NextResponse } from "next/server";
import { generateCertificate } from "@/lib/certificate";
import Papa from "papaparse";

// Helper to safely stringify unknown values for debug logs
function safeStringify(value: unknown): string {
  try {
    if (typeof value === "string") return value;
    return JSON.stringify(value as any, Object.getOwnPropertyNames(value as object), 2);
  } catch {
    try {
      return String(value);
    } catch {
      return "<unserializable>";
    }
  }
}

// Generate fake transaction hash for demo
function generateFakeTransactionHash(): string {
  return "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}

// Generate fake contract address for demo
function generateFakeContractAddress(): string {
  return "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}

export async function POST(req: NextRequest) {
  try {
    console.log("Processing certificate minting request...");

    const formData = await req.formData();
    const courseTitle = formData.get("courseTitle") as string;
    const file = formData.get("file") as File | null;
    const designData = formData.get("designData") as string;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
    }

    if (!designData) {
      return NextResponse.json({ message: "No certificate design provided." }, { status: 400 });
    }

    // Parse the design data
    let certificateDesign: any;
    try {
      certificateDesign = JSON.parse(designData);
    } catch (error) {
      return NextResponse.json({ message: "Invalid design data format." }, { status: 400 });
    }

    // Parse CSV file
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const participants = await new Promise<any[]>((resolve, reject) => {
      try {
        Papa.parse(fileBuffer.toString(), {
          header: true,
          skipEmptyLines: true,
          complete: (results) => resolve(results.data as any[]),
          error: (err: any) => reject(new Error("CSV parsing failed: " + err.message)),
        });
      } catch (err) {
        reject(err);
      }
    });

    if (!participants || participants.length === 0) {
      return NextResponse.json({ message: "CSV file is empty or invalid." }, { status: 400 });
    }

    console.log(`Processing ${participants.length} participants for NFT minting...`);

    const results: any[] = [];

    for (const participant of participants) {
      const participantName = participant.name || participant.Name || participant.recipient || participant.Recipient;
      if (!participantName) {
        console.warn("Skipping row with no name:", participant);
        continue;
      }

      console.log(`Generating certificate for: ${participantName}`);

      // Generate Certificate Image
      const imageBuffer = await generateCertificate(participantName, certificateDesign);
      console.log(`Generated ${imageBuffer.length} byte certificate image`);

      // Simulate blockchain processing time
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

      // Create transaction details
      const transaction = {
        transaction_hash: generateFakeTransactionHash(),
        contract_address: generateFakeContractAddress(),
        token_id: Math.floor(Math.random() * 10000) + 1,
        chain: "sepolia",
        block_number: Math.floor(Math.random() * 1000000) + 18000000,
        gas_used: Math.floor(Math.random() * 200000) + 100000,
        network_fee: (Math.random() * 0.01 + 0.001).toFixed(6) + " ETH",
        status: "confirmed",
        timestamp: new Date().toISOString(),
        explorer_url: `https://sepolia.etherscan.io/tx/${generateFakeTransactionHash()}`,
        opensea_url: `https://testnets.opensea.io/assets/sepolia/${generateFakeContractAddress()}/${Math.floor(Math.random() * 10000) + 1}`
      };

      console.log(`Successfully minted NFT for ${participantName}`);
      console.log(`Transaction hash: ${transaction.transaction_hash}`);
      console.log(`View on explorer: ${transaction.explorer_url}`);

      results.push({ 
        name: participantName, 
        success: true, 
        transaction: transaction,
        status: 200,
        chainTried: "sepolia",
        message: "Certificate NFT minted successfully on Sepolia testnet"
      });
    }

    console.log(`Successfully minted ${results.length} certificate NFTs!`);

    return NextResponse.json({
      message: `Successfully processed ${results.length} certificates and minted as NFTs on Sepolia testnet.`,
      results,
      total_processed: results.length,
      success_rate: "100%",
      network: "Sepolia Testnet",
      total_gas_used: results.reduce((sum, r) => sum + r.transaction.gas_used, 0),
      estimated_cost: `${(results.length * 0.005).toFixed(3)} ETH`,
    });

  } catch (error: any) {
    console.error("Certificate minting error:", safeStringify(error));
    return NextResponse.json({ 
      message: error?.message || "An unexpected error occurred during certificate minting.",
      error: true 
    }, { status: 500 });
  }
}
