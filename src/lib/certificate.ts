import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "path";

export async function generateCertificate(
  name: string,
  design: { courseTitle: string; primaryColor: string; sealType: string }
): Promise<Buffer> {
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  // Load the template image
  const templatePath = path.join(process.cwd(), "public", "template.png");
  const template = await loadImage(templatePath);
  context.drawImage(template, 0, 0, width, height);

  // Set text styles
  context.textAlign = "center";
  context.textBaseline = "middle";

  // Draw Course Title
  context.font = "bold 60px Arial";
  context.fillStyle = design.primaryColor.toLowerCase();
  context.fillText(design.courseTitle, width / 2, height / 2 - 100);

  // Draw "Certificate of Completion"
  context.font = "40px Arial";
  context.fillStyle = "#333";
  context.fillText("Certificate of Completion", width / 2, height / 2 - 20);

  // Draw Participant Name
  context.font = "italic 70px 'Pinyon Script'";
  context.fillStyle = "#111";
  context.fillText(name, width / 2, height / 2 + 80);

  // Draw "is awarded this certificate for successfully completing the course"
  context.font = "20px Arial";
  context.fillStyle = "#555";
  context.fillText(
    "is awarded this certificate for successfully completing the course",
    width / 2,
    height / 2 + 150
  );

  // Placeholder for seal
  // In a real scenario, you would load a seal image based on `design.sealType`
  context.beginPath();
  context.arc(width / 2, height - 100, 40, 0, 2 * Math.PI);
  context.fillStyle = "gold";
  context.fill();

  return canvas.toBuffer("image/png");
}
