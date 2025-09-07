import { createCanvas, loadImage } from "@napi-rs/canvas";
import { Component, CanvasSettings } from "./types";

interface CertificateDesign {
  components: Component[];
  canvasSettings: CanvasSettings;
}

export async function generateCertificate(
  participantName: string,
  design: CertificateDesign
): Promise<Buffer> {
  const { components, canvasSettings } = design;
  const canvas = createCanvas(canvasSettings.width, canvasSettings.height);
  const context = canvas.getContext("2d");

  // Set background
  if (canvasSettings.background.startsWith('linear-gradient')) {
    // Handle gradient backgrounds
    const gradient = context.createLinearGradient(0, 0, canvasSettings.width, canvasSettings.height);
    if (canvasSettings.background.includes('#667eea') && canvasSettings.background.includes('#764ba2')) {
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
    } else if (canvasSettings.background.includes('#f093fb') && canvasSettings.background.includes('#f5576c')) {
      gradient.addColorStop(0, '#f093fb');
      gradient.addColorStop(1, '#f5576c');
    } else if (canvasSettings.background.includes('#f5f7fa') && canvasSettings.background.includes('#c3cfe2')) {
      gradient.addColorStop(0, '#f5f7fa');
      gradient.addColorStop(1, '#c3cfe2');
    } else {
      gradient.addColorStop(0, '#f5f7fa');
      gradient.addColorStop(1, '#c3cfe2');
    }
    context.fillStyle = gradient;
  } else if (canvasSettings.background.startsWith('url(')) {
    // For pattern backgrounds, use a simple gradient fallback
    const gradient = context.createLinearGradient(0, 0, canvasSettings.width, canvasSettings.height);
    gradient.addColorStop(0, '#f5f7fa');
    gradient.addColorStop(1, '#c3cfe2');
    context.fillStyle = gradient;
  } else {
    // Solid color background
    context.fillStyle = canvasSettings.background;
  }
  
  context.fillRect(0, 0, canvasSettings.width, canvasSettings.height);

  // Render each component
  components.forEach((component) => {
    context.font = `${component.fontWeight} ${component.fontSize}px Arial`;
    context.fillStyle = '#1f2937'; // Dark text color
    context.textAlign = 'left';
    context.textBaseline = 'top';

    let text = component.text;
    
    // Replace placeholders with actual data
    if (component.type === 'recipient' || text.includes('[Recipient Name]')) {
      text = participantName;
    } else if (component.type === 'date' || text.includes('Date:')) {
      text = `Date: ${new Date().toLocaleDateString()}`;
    }

    // Draw the text
    context.fillText(text, component.left, component.top);
  });

  return canvas.toBuffer("image/png");
}
