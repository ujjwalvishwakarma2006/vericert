import { NextResponse } from "next/server";
import { generateCertificate } from "@/lib/certificate";
import Papa from "papaparse";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const courseTitle = data.get("courseTitle") as string;
    const primaryColor = data.get("primaryColor") as string;
    const sealType = data.get("sealType") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const csv = buffer.toString("utf-8");

    const results = Papa.parse(csv, { header: true });
    const participants = results.data as { name: string }[];

    const transactionHashes = [];

    for (const participant of participants) {
      if (participant.name) {
        const imageBuffer = await generateCertificate(participant.name, {
          courseTitle,
          primaryColor,
          sealType,
        });

        const mintData = new FormData();
        mintData.append("file", new Blob([imageBuffer]), `${participant.name.replace(/\s+/g, '_')}_cert.png`);
        mintData.append("name", `${courseTitle} Certificate`);
        mintData.append("description", `Certificate of completion for ${participant.name} in the ${courseTitle} course.`);
        mintData.append("chain", "mumbai");

        const response = await fetch("https://api.verbwire.com/v1/nft/mint/quick-mint-from-file", {
          method: "POST",
          headers: {
            "X-API-Key": process.env.VERBWIRE_API_KEY!,
          },
          body: mintData,
        });

        const result = await response.json();
        if (result.transaction_details) {
          transactionHashes.push(result.transaction_details.transaction_hash);
        }
      }
    }

    return NextResponse.json({ transactionHashes });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
