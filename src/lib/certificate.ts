import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "path";

interface DesignOptions {
  primaryColor?: string;
  sealType?: string;
  courseTitle?: string;
}

export async function generateCertificate(
  participantName: string,
  design: DesignOptions
): Promise<Buffer> {
  const width = 1200;
  const height = 800;

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  // Load the certificate template
  const templatePath = path.join(process.cwd(), "public", "template.png");
  try {
    const templateImage = await loadImage(templatePath);
    context.drawImage(templateImage, 0, 0, width, height);
  } catch (error) {
    console.error("Failed to load template image:", error);
    // Fallback to a solid color background if template fails
    context.fillStyle = "#f0f0f0";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "black";
    context.lineWidth = 10;
    context.strokeRect(0, 0, width, height);
  }

  // Set text styles
  context.textAlign = "center";
  context.textBaseline = "middle";

  // Draw "Certificate of Completion"
  context.font = "bold 50px Arial";
  context.fillStyle = design.primaryColor?.toLowerCase() || "black";
  context.fillText("Certificate of Completion", width / 2, height / 2 - 150);

  // Draw "This certifies that"
  context.font = "30px Arial";
  context.fillStyle = "black";
  context.fillText("This certifies that", width / 2, height / 2 - 50);

  // Draw Participant Name
  context.font = "bold 70px 'Times New Roman'";
  context.fillStyle = design.primaryColor?.toLowerCase() || "blue";
  context.fillText(participantName, width / 2, height / 2 + 20);

  // Draw Course Title
  context.font = "30px Arial";
  context.fillStyle = "black";
  context.fillText(
    `has successfully completed the`,
    width / 2,
    height / 2 + 100
  );
  context.font = "italic 40px Arial";
  context.fillText(
    design.courseTitle || "Advanced Training Course",
    width / 2,
    height / 2 + 150
  );

  // Draw a seal (simple example)
  // A real implementation would use different images for different seals
  context.beginPath();
  context.arc(width / 2, height / 2 + 250, 50, 0, Math.PI * 2, false);
  context.fillStyle = "gold";
  context.fill();
  context.font = "bold 20px Arial";
  context.fillStyle = "black";
  context.fillText(design.sealType?.toUpperCase() || "SEAL", width / 2, height / 2 + 250);

  return canvas.toBuffer("image/png");
}
