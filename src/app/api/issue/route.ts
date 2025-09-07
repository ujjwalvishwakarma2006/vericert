import { NextRequest, NextResponse } from "next/server";
import { generateCertificate } from "@/lib/certificate";
import Papa from "papaparse";
import { Readable } from "stream";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const courseTitle = formData.get("courseTitle") as string;
    const primaryColor = formData.get("primaryColor") as string;
    const sealType = formData.get("sealType") as string;
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded." }, { status: 400 });
    }

    // Parse CSV file
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    const participants = await new Promise<any[]>((resolve, reject) => {
        Papa.parse(fileBuffer.toString(), {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                resolve(results.data);
            },
            error: (error: any) => {
                reject(new Error("CSV parsing failed: " + error.message));
            }
        });
    });

    if (!participants || participants.length === 0) {
        return NextResponse.json({ message: "CSV file is empty or invalid." }, { status: 400 });
    }

    const apiKey = process.env.VERBWIRE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: "Verbwire API key is not configured." }, { status: 500 });
    }

    const results = [];

    for (const participant of participants) {
      const participantName = participant.name;
      if (!participantName) {
        console.warn("Skipping row with no name:", participant);
        continue;
      }

      // 1. Generate Certificate Image
      const imageBuffer = await generateCertificate(participantName, {
        courseTitle,
        primaryColor,
        sealType,
      });

      // 2. Mint NFT using Verbwire
      const mintFormData = new FormData();
      mintFormData.append("filePath", new Blob([imageBuffer]), `${participantName.replace(/\s+/g, '_')}_certificate.png`);
      mintFormData.append("name", `${courseTitle} - ${participantName}`);
      mintFormData.append("description", `Certificate of completion for ${courseTitle} awarded to ${participantName}.`);
      mintFormData.append("chain", "mumbai");

      const verbwireResponse = await fetch("https://api.verbwire.com/v1/nft/mint/quickMintFromFile", {
        method: "POST",
        headers: {
          "X-API-Key": apiKey,
        },
        body: mintFormData,
      });

      const verbwireResult = await verbwireResponse.json();

      if (!verbwireResponse.ok) {
        console.error(`Failed to mint for ${participantName}:`, verbwireResult);
        results.push({ name: participantName, success: false, error: verbwireResult.error?.message || "Minting failed" });
      } else {
        results.push({ name: participantName, success: true, transaction: verbwireResult.transaction_details });
      }
    }

    return NextResponse.json({
      message: "Certificates processed.",
      results,
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ message: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}
