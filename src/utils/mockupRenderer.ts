import { ProductConfig, LogoTransform } from '../types/mockup';

interface RenderOptions {
  product: ProductConfig;
  productColor: string;
  logoImage: HTMLImageElement | null;
  transform: LogoTransform;
  backdrop: 'studio-light' | 'studio-dark' | 'wood-table' | 'minimal' | 'transparent';
  showPrintZoneGuide?: boolean;
}

// Convert hex to rgb
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Blend color with black or white
function adjustColor(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const clamp = (val: number) => Math.min(255, Math.max(0, Math.round(val)));
  const nr = clamp(r + amount);
  const ng = clamp(g + amount);
  const nb = clamp(b + amount);
  return `#${((1 << 24) + (nr << 16) + (ng << 8) + nb).toString(16).slice(1)}`;
}

export function renderMockupToCanvas(canvas: HTMLCanvasElement, options: RenderOptions): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const { product, productColor, logoImage, transform, backdrop, showPrintZoneGuide } = options;

  ctx.clearRect(0, 0, width, height);

  // 1. Draw Backdrop
  drawBackdrop(ctx, width, height, backdrop);

  // 2. Draw Product Cast Shadow
  drawProductShadow(ctx, width, height, product.id);

  // 3. Draw Product Base
  drawProductBase(ctx, width, height, product.id, productColor);

  // 4. Draw Logo onto Print Area (with cylindrical warp or fabric displacement if applicable)
  if (logoImage && logoImage.complete && logoImage.naturalWidth > 0) {
    drawLogoOnProduct(ctx, width, height, product, logoImage, transform, productColor);
  }

  // 5. Draw Product Highlights & Overlays (folds, specular gleam, seams)
  drawProductOverlays(ctx, width, height, product.id, productColor);

  // 6. Draw Print Area Guide if enabled
  if (showPrintZoneGuide) {
    drawPrintZoneGuide(ctx, width, height, product);
  }
}

function drawBackdrop(ctx: CanvasRenderingContext2D, w: number, h: number, backdrop: string) {
  if (backdrop === 'transparent') {
    return;
  }

  if (backdrop === 'minimal') {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);
    return;
  }

  if (backdrop === 'studio-dark') {
    const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, w * 0.1, w * 0.5, h * 0.5, w * 0.8);
    bgGrad.addColorStop(0, '#262a33');
    bgGrad.addColorStop(0.6, '#181a20');
    bgGrad.addColorStop(1, '#0f1014');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);
    return;
  }

  if (backdrop === 'wood-table') {
    // Warm cafe table backdrop
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#8c5a3c');
    grad.addColorStop(1, '#53341e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle wood planks lines
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 2;
    for (let y = 80; y < h; y += 120) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    return;
  }

  // Default 'studio-light'
  const grad = ctx.createRadialGradient(w * 0.5, h * 0.4, w * 0.1, w * 0.5, h * 0.5, w * 0.85);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.5, '#f3f4f8');
  grad.addColorStop(1, '#e2e5eb');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Studio horizon soft gradient at bottom
  const floorGrad = ctx.createLinearGradient(0, h * 0.75, 0, h);
  floorGrad.addColorStop(0, 'rgba(0,0,0,0.0)');
  floorGrad.addColorStop(1, 'rgba(0,0,0,0.03)');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(0, h * 0.75, w, h * 0.25);
}

function drawProductShadow(ctx: CanvasRenderingContext2D, w: number, h: number, productId: string) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.16)';
  ctx.filter = 'blur(16px)';

  if (productId === 'mug' || productId === 'enamel-mug' || productId === 'tumbler') {
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.78, w * 0.24, h * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
    // Sharper contact shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
    ctx.filter = 'blur(6px)';
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.77, w * 0.18, h * 0.02, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (productId === 'tshirt' || productId === 'hoodie') {
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.88, w * 0.38, h * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (productId === 'tote') {
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.88, w * 0.3, h * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (productId === 'notebook' || productId === 'phone-case') {
    ctx.beginPath();
    ctx.ellipse(w * 0.52, h * 0.82, w * 0.22, h * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (productId === 'cap') {
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.75, w * 0.32, h * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (productId === 'sticker') {
    ctx.beginPath();
    ctx.ellipse(w * 0.52, h * 0.68, w * 0.28, h * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawProductBase(ctx: CanvasRenderingContext2D, w: number, h: number, productId: string, color: string) {
  ctx.save();

  if (productId === 'mug') {
    drawMugBase(ctx, w, h, color);
  } else if (productId === 'tshirt') {
    drawTshirtBase(ctx, w, h, color);
  } else if (productId === 'hoodie') {
    drawHoodieBase(ctx, w, h, color);
  } else if (productId === 'tote') {
    drawToteBase(ctx, w, h, color);
  } else if (productId === 'enamel-mug') {
    drawEnamelMugBase(ctx, w, h, color);
  } else if (productId === 'tumbler') {
    drawTumblerBase(ctx, w, h, color);
  } else if (productId === 'cap') {
    drawCapBase(ctx, w, h, color);
  } else if (productId === 'notebook') {
    drawNotebookBase(ctx, w, h, color);
  } else if (productId === 'sticker') {
    drawStickerBase(ctx, w, h, color);
  } else if (productId === 'phone-case') {
    drawPhoneCaseBase(ctx, w, h, color);
  }

  ctx.restore();
}

// ----------------- PRODUCT BASE RENDERERS -----------------

function drawMugBase(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  const cx = w * 0.5;
  const cy = h * 0.5;
  const mugW = w * 0.44;
  const mugH = h * 0.5;
  const left = cx - mugW / 2;
  const right = cx + mugW / 2;
  const top = cy - mugH / 2 + 20;
  const bottom = top + mugH;

  // Handle (Behind / side)
  ctx.save();
  ctx.beginPath();
  const handleX = right - 10;
  const handleY = top + mugH * 0.2;
  ctx.arc(handleX + 50, handleY + 60, 60, Math.PI * 1.3, Math.PI * 0.7, false);
  ctx.lineWidth = 32;
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Handle shading
  ctx.lineWidth = 26;
  ctx.strokeStyle = adjustColor(color, -30);
  ctx.stroke();
  ctx.restore();

  // Mug Body
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(left, top);
  // Bottom rounded base
  ctx.lineTo(left, bottom - 15);
  ctx.quadraticCurveTo(left, bottom, left + 20, bottom);
  ctx.lineTo(right - 20, bottom);
  ctx.quadraticCurveTo(right, bottom, right, bottom - 15);
  ctx.lineTo(right, top);

  // Top rim ellipse
  ctx.ellipse(cx, top, mugW / 2, 22, 0, 0, Math.PI, false);
  ctx.closePath();

  // Cylinder 3D gradient fill
  const bodyGrad = ctx.createLinearGradient(left, top, right, top);
  bodyGrad.addColorStop(0, adjustColor(color, -25));
  bodyGrad.addColorStop(0.12, adjustColor(color, -10));
  bodyGrad.addColorStop(0.28, adjustColor(color, 25)); // Specular highlight strip
  bodyGrad.addColorStop(0.45, color);
  bodyGrad.addColorStop(0.75, adjustColor(color, -5));
  bodyGrad.addColorStop(0.95, adjustColor(color, -35));
  bodyGrad.addColorStop(1, adjustColor(color, -45));
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // Top Interior Opening
  ctx.beginPath();
  ctx.ellipse(cx, top, mugW / 2 - 6, 18, 0, 0, Math.PI * 2);
  const interiorGrad = ctx.createLinearGradient(cx, top - 18, cx, top + 18);
  interiorGrad.addColorStop(0, adjustColor(color, -60));
  interiorGrad.addColorStop(0.6, adjustColor(color, -40));
  interiorGrad.addColorStop(1, adjustColor(color, -20));
  ctx.fillStyle = interiorGrad;
  ctx.fill();

  // Coffee liquid surface inside
  ctx.beginPath();
  ctx.ellipse(cx, top + 4, mugW / 2 - 14, 12, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#2b1810';
  ctx.fill();

  // Coffee foam/reflection
  ctx.beginPath();
  ctx.ellipse(cx - 10, top + 3, mugW / 2 - 30, 7, -0.1, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(215, 175, 140, 0.4)';
  ctx.fill();

  ctx.restore();
}

function drawTshirtBase(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  const cx = w * 0.5;
  const topY = h * 0.16;

  ctx.save();
  ctx.beginPath();

  // Collar notch
  ctx.moveTo(cx - 50, topY);
  ctx.quadraticCurveTo(cx, topY + 35, cx + 50, topY);

  // Right Shoulder
  ctx.lineTo(cx + 170, topY + 45);
  // Right Sleeve
  ctx.lineTo(cx + 260, topY + 160);
  ctx.lineTo(cx + 205, topY + 205);
  // Underarm Right
  ctx.lineTo(cx + 155, topY + 150);
  // Right Torso
  ctx.quadraticCurveTo(cx + 160, topY + 320, cx + 165, topY + 520);
  // Bottom Hem
  ctx.quadraticCurveTo(cx, topY + 535, cx - 165, topY + 520);
  // Left Torso
  ctx.quadraticCurveTo(cx - 160, topY + 320, cx - 155, topY + 150);
  // Left Sleeve
  ctx.lineTo(cx - 205, topY + 205);
  ctx.lineTo(cx - 260, topY + 160);
  // Left Shoulder
  ctx.lineTo(cx - 170, topY + 45);
  ctx.closePath();

  // Shaded 3D Body Gradient
  const grad = ctx.createRadialGradient(cx, topY + 220, 40, cx, topY + 260, 420);
  grad.addColorStop(0, adjustColor(color, 15));
  grad.addColorStop(0.5, color);
  grad.addColorStop(1, adjustColor(color, -28));
  ctx.fillStyle = grad;
  ctx.fill();

  // Collar Band
  ctx.beginPath();
  ctx.moveTo(cx - 52, topY - 2);
  ctx.quadraticCurveTo(cx, topY + 38, cx + 52, topY - 2);
  ctx.quadraticCurveTo(cx, topY + 22, cx - 52, topY - 2);
  ctx.fillStyle = adjustColor(color, -18);
  ctx.fill();
  ctx.strokeStyle = adjustColor(color, -35);
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Collar inside back
  ctx.beginPath();
  ctx.moveTo(cx - 50, topY);
  ctx.quadraticCurveTo(cx, topY - 18, cx + 50, topY);
  ctx.quadraticCurveTo(cx, topY + 10, cx - 50, topY);
  ctx.fillStyle = adjustColor(color, -45);
  ctx.fill();

  ctx.restore();
}

function drawHoodieBase(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  const cx = w * 0.5;
  const topY = h * 0.14;

  ctx.save();

  // Hood (Behind shoulders)
  ctx.beginPath();
  ctx.moveTo(cx - 110, topY + 70);
  ctx.quadraticCurveTo(cx - 115, topY - 40, cx, topY - 30);
  ctx.quadraticCurveTo(cx + 115, topY - 40, cx + 110, topY + 70);
  ctx.fillStyle = adjustColor(color, -35);
  ctx.fill();

  // Inner hood shadow
  ctx.beginPath();
  ctx.moveTo(cx - 70, topY + 50);
  ctx.quadraticCurveTo(cx, topY, cx + 70, topY + 50);
  ctx.fillStyle = adjustColor(color, -60);
  ctx.fill();

  // Hoodie Torso & Sleeves
  ctx.beginPath();
  ctx.moveTo(cx - 65, topY + 60);
  ctx.lineTo(cx + 65, topY + 60);
  // Right shoulder
  ctx.lineTo(cx + 190, topY + 100);
  // Right sleeve
  ctx.lineTo(cx + 275, topY + 290);
  ctx.lineTo(cx + 215, topY + 315);
  ctx.lineTo(cx + 170, topY + 200);
  // Right side body
  ctx.lineTo(cx + 175, topY + 520);
  // Bottom ribbing
  ctx.lineTo(cx - 175, topY + 520);
  // Left side body
  ctx.lineTo(cx - 170, topY + 200);
  // Left sleeve
  ctx.lineTo(cx - 215, topY + 315);
  ctx.lineTo(cx - 275, topY + 290);
  // Left shoulder
  ctx.lineTo(cx - 190, topY + 100);
  ctx.closePath();

  const bodyGrad = ctx.createRadialGradient(cx, topY + 240, 50, cx, topY + 260, 400);
  bodyGrad.addColorStop(0, adjustColor(color, 12));
  bodyGrad.addColorStop(0.6, color);
  bodyGrad.addColorStop(1, adjustColor(color, -30));
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // Kangaroo Pouch Pocket
  ctx.beginPath();
  const pocketY = topY + 350;
  ctx.moveTo(cx - 120, pocketY + 120);
  ctx.lineTo(cx + 120, pocketY + 120);
  ctx.lineTo(cx + 120, pocketY + 50);
  ctx.lineTo(cx + 85, pocketY);
  ctx.lineTo(cx - 85, pocketY);
  ctx.lineTo(cx - 120, pocketY + 50);
  ctx.closePath();
  ctx.fillStyle = adjustColor(color, -10);
  ctx.fill();
  ctx.strokeStyle = adjustColor(color, -35);
  ctx.lineWidth = 2;
  ctx.stroke();

  // Drawstrings
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  // Left string
  ctx.beginPath();
  ctx.moveTo(cx - 28, topY + 70);
  ctx.quadraticCurveTo(cx - 38, topY + 150, cx - 25, topY + 210);
  ctx.stroke();
  // Metal aglet
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(cx - 27, topY + 205, 5, 12);

  // Right string
  ctx.beginPath();
  ctx.moveTo(cx + 28, topY + 70);
  ctx.quadraticCurveTo(cx + 22, topY + 150, cx + 32, topY + 215);
  ctx.stroke();
  ctx.fillRect(cx + 30, topY + 210, 5, 12);

  ctx.restore();
}

function drawToteBase(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  const cx = w * 0.5;
  const bagW = w * 0.52;
  const bagH = h * 0.5;
  const left = cx - bagW / 2;
  const right = cx + bagW / 2;
  const top = h * 0.38;
  const bottom = top + bagH;

  ctx.save();

  // Handles
  ctx.beginPath();
  ctx.moveTo(cx - 75, top);
  ctx.bezierCurveTo(cx - 85, top - 200, cx + 85, top - 200, cx + 75, top);
  ctx.lineWidth = 26;
  ctx.strokeStyle = adjustColor(color, -20);
  ctx.lineCap = 'square';
  ctx.stroke();

  ctx.lineWidth = 22;
  ctx.strokeStyle = color;
  ctx.stroke();

  // Bag Body
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(right, top);
  ctx.quadraticCurveTo(right + 10, bottom - 20, right - 15, bottom);
  ctx.lineTo(left + 15, bottom);
  ctx.quadraticCurveTo(left - 10, bottom - 20, left, top);
  ctx.closePath();

  const bagGrad = ctx.createLinearGradient(left, top, right, bottom);
  bagGrad.addColorStop(0, adjustColor(color, 10));
  bagGrad.addColorStop(0.5, color);
  bagGrad.addColorStop(1, adjustColor(color, -22));
  ctx.fillStyle = bagGrad;
  ctx.fill();

  // Top stitch fold
  ctx.beginPath();
  ctx.moveTo(left, top + 14);
  ctx.lineTo(right, top + 14);
  ctx.strokeStyle = adjustColor(color, -30);
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.restore();
}

function drawEnamelMugBase(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  const cx = w * 0.5;
  const cy = h * 0.52;
  const mugW = w * 0.44;
  const mugH = h * 0.44;
  const left = cx - mugW / 2;
  const right = cx + mugW / 2;
  const top = cy - mugH / 2;
  const bottom = top + mugH;

  ctx.save();

  // Vintage handle
  ctx.beginPath();
  ctx.arc(right + 30, top + mugH * 0.48, 48, Math.PI * 1.35, Math.PI * 0.65, false);
  ctx.lineWidth = 24;
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Mug Body
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left + 5, bottom - 15);
  ctx.quadraticCurveTo(left + 10, bottom, left + 30, bottom);
  ctx.lineTo(right - 30, bottom);
  ctx.quadraticCurveTo(right - 10, bottom, right - 5, bottom - 15);
  ctx.lineTo(right, top);
  ctx.ellipse(cx, top, mugW / 2, 22, 0, 0, Math.PI, false);
  ctx.closePath();

  const bodyGrad = ctx.createLinearGradient(left, top, right, top);
  bodyGrad.addColorStop(0, adjustColor(color, -20));
  bodyGrad.addColorStop(0.2, adjustColor(color, 20));
  bodyGrad.addColorStop(0.5, color);
  bodyGrad.addColorStop(0.9, adjustColor(color, -30));
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // Enamel Rim (Black or metallic rolled steel)
  ctx.beginPath();
  ctx.ellipse(cx, top, mugW / 2 + 2, 22, 0, 0, Math.PI * 2);
  ctx.lineWidth = 7;
  ctx.strokeStyle = '#22272e';
  ctx.stroke();

  // Interior Opening
  ctx.beginPath();
  ctx.ellipse(cx, top, mugW / 2 - 4, 18, 0, 0, Math.PI * 2);
  ctx.fillStyle = adjustColor(color, -40);
  ctx.fill();

  ctx.restore();
}

function drawTumblerBase(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  const cx = w * 0.5;
  const top = h * 0.2;
  const bottom = h * 0.78;
  const topW = w * 0.36;
  const bottomW = w * 0.28;

  ctx.save();

  // Tumbler Body (Tapered cylinder)
  ctx.beginPath();
  ctx.moveTo(cx - topW / 2, top + 25);
  ctx.lineTo(cx - bottomW / 2, bottom - 10);
  ctx.quadraticCurveTo(cx - bottomW / 2, bottom, cx - bottomW / 2 + 15, bottom);
  ctx.lineTo(cx + bottomW / 2 - 15, bottom);
  ctx.quadraticCurveTo(cx + bottomW / 2, bottom, cx + bottomW / 2, bottom - 10);
  ctx.lineTo(cx + topW / 2, top + 25);
  ctx.ellipse(cx, top + 25, topW / 2, 18, 0, 0, Math.PI, false);
  ctx.closePath();

  // Metallic Brushed Sheen Gradient
  const grad = ctx.createLinearGradient(cx - topW / 2, top, cx + topW / 2, top);
  grad.addColorStop(0, adjustColor(color, -30));
  grad.addColorStop(0.15, adjustColor(color, 35)); // Highlight
  grad.addColorStop(0.35, adjustColor(color, -5));
  grad.addColorStop(0.55, adjustColor(color, 25));
  grad.addColorStop(0.85, adjustColor(color, -25));
  grad.addColorStop(1, adjustColor(color, -45));
  ctx.fillStyle = grad;
  ctx.fill();

  // Clear Acrylic Lid
  ctx.beginPath();
  ctx.ellipse(cx, top + 15, topW / 2 + 2, 20, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(230, 240, 250, 0.65)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.stroke();

  // Lid Slider
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.ellipse(cx, top + 10, 22, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawCapBase(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  const cx = w * 0.5;
  const crownY = h * 0.38;

  ctx.save();

  // Cap Crown (Dome)
  ctx.beginPath();
  ctx.moveTo(cx - 150, crownY + 80);
  ctx.bezierCurveTo(cx - 170, crownY - 90, cx + 170, crownY - 90, cx + 150, crownY + 80);
  ctx.quadraticCurveTo(cx, crownY + 110, cx - 150, crownY + 80);
  ctx.closePath();

  const crownGrad = ctx.createRadialGradient(cx, crownY, 30, cx, crownY + 40, 180);
  crownGrad.addColorStop(0, adjustColor(color, 20));
  crownGrad.addColorStop(0.6, color);
  crownGrad.addColorStop(1, adjustColor(color, -35));
  ctx.fillStyle = crownGrad;
  ctx.fill();

  // Crown Seams (6 panels)
  ctx.strokeStyle = adjustColor(color, -40);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx, crownY - 80); // top button
  ctx.quadraticCurveTo(cx - 60, crownY, cx - 130, crownY + 75);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, crownY - 80);
  ctx.lineTo(cx, crownY + 85);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, crownY - 80);
  ctx.quadraticCurveTo(cx + 60, crownY, cx + 130, crownY + 75);
  ctx.stroke();

  // Curved Visor / Bill
  ctx.beginPath();
  ctx.moveTo(cx - 160, crownY + 80);
  ctx.quadraticCurveTo(cx, crownY + 155, cx + 160, crownY + 80);
  ctx.quadraticCurveTo(cx, crownY + 115, cx - 160, crownY + 80);
  ctx.closePath();

  const visorGrad = ctx.createLinearGradient(cx - 160, crownY + 80, cx, crownY + 155);
  visorGrad.addColorStop(0, adjustColor(color, -10));
  visorGrad.addColorStop(0.5, adjustColor(color, 15));
  visorGrad.addColorStop(1, adjustColor(color, -30));
  ctx.fillStyle = visorGrad;
  ctx.fill();

  // Visor stitch lines
  ctx.strokeStyle = adjustColor(color, -35);
  ctx.lineWidth = 1.2;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.quadraticCurveTo(cx, crownY + 140, cx + 140, crownY + 85);
  ctx.stroke();
  ctx.setLineDash([]);

  // Top squatchee button
  ctx.beginPath();
  ctx.arc(cx, crownY - 80, 10, 0, Math.PI * 2);
  ctx.fillStyle = adjustColor(color, 20);
  ctx.fill();
  ctx.strokeStyle = adjustColor(color, -30);
  ctx.stroke();

  ctx.restore();
}

function drawNotebookBase(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  const cx = w * 0.5;
  const cy = h * 0.5;
  const bookW = w * 0.46;
  const bookH = h * 0.62;
  const left = cx - bookW / 2;
  const top = cy - bookH / 2;

  ctx.save();

  // Book pages depth on right
  ctx.fillStyle = '#f3f0e6';
  ctx.beginPath();
  ctx.roundRect(left + 15, top + 6, bookW, bookH - 12, [0, 8, 8, 0]);
  ctx.fill();

  // Hardcover
  ctx.beginPath();
  ctx.roundRect(left, top, bookW, bookH, 10);
  const coverGrad = ctx.createLinearGradient(left, top, left + bookW, top + bookH);
  coverGrad.addColorStop(0, adjustColor(color, 25));
  coverGrad.addColorStop(0.15, color);
  coverGrad.addColorStop(0.85, color);
  coverGrad.addColorStop(1, adjustColor(color, -30));
  ctx.fillStyle = coverGrad;
  ctx.fill();

  // Spine indentation line
  ctx.beginPath();
  ctx.moveTo(left + 24, top);
  ctx.lineTo(left + 24, top + bookH);
  ctx.strokeStyle = adjustColor(color, -45);
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Elastic closure band
  ctx.beginPath();
  const bandX = left + bookW - 40;
  ctx.fillRect(bandX, top - 2, 16, bookH + 4);
  ctx.fillStyle = adjustColor(color, -50);
  ctx.fill();

  // Ribbon bookmark hanging out bottom
  ctx.beginPath();
  ctx.moveTo(cx, top + bookH);
  ctx.quadraticCurveTo(cx + 8, top + bookH + 25, cx + 5, top + bookH + 40);
  ctx.lineTo(cx - 5, top + bookH + 40);
  ctx.quadraticCurveTo(cx - 2, top + bookH + 25, cx - 10, top + bookH);
  ctx.fillStyle = '#b91c1c';
  ctx.fill();

  ctx.restore();
}

function drawStickerBase(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  // Laptop metallic lid backdrop
  ctx.save();
  const laptopW = w * 0.8;
  const laptopH = h * 0.7;
  const left = (w - laptopW) / 2;
  const top = (h - laptopH) / 2;

  ctx.beginPath();
  ctx.roundRect(left, top, laptopW, laptopH, 20);
  const laptopGrad = ctx.createLinearGradient(left, top, left + laptopW, top + laptopH);
  laptopGrad.addColorStop(0, adjustColor(color, 25));
  laptopGrad.addColorStop(0.5, color);
  laptopGrad.addColorStop(1, adjustColor(color, -25));
  ctx.fillStyle = laptopGrad;
  ctx.fill();

  // Sleek anodized aluminum highlight streak
  ctx.beginPath();
  ctx.moveTo(left + 50, top);
  ctx.lineTo(left + laptopW, top + laptopH - 120);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 60;
  ctx.stroke();

  ctx.restore();
}

function drawPhoneCaseBase(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  const cx = w * 0.5;
  const cy = h * 0.5;
  const caseW = w * 0.42;
  const caseH = h * 0.68;
  const left = cx - caseW / 2;
  const top = cy - caseH / 2;

  ctx.save();

  // Phone Case Shape
  ctx.beginPath();
  ctx.roundRect(left, top, caseW, caseH, 36);
  const caseGrad = ctx.createLinearGradient(left, top, left + caseW, top + caseH);
  caseGrad.addColorStop(0, adjustColor(color, 25));
  caseGrad.addColorStop(0.3, color);
  caseGrad.addColorStop(0.8, color);
  caseGrad.addColorStop(1, adjustColor(color, -35));
  ctx.fillStyle = caseGrad;
  ctx.fill();

  // Raised edge bevel
  ctx.lineWidth = 3;
  ctx.strokeStyle = adjustColor(color, 35);
  ctx.stroke();

  // Camera Island (Top Left)
  const camX = left + 20;
  const camY = top + 24;
  const camW = 75;
  const camH = 80;
  ctx.beginPath();
  ctx.roundRect(camX, camY, camW, camH, 18);
  ctx.fillStyle = adjustColor(color, -40);
  ctx.fill();
  ctx.strokeStyle = adjustColor(color, -10);
  ctx.lineWidth = 2;
  ctx.stroke();

  // Three Camera Lenses
  const drawLens = (lx: number, ly: number) => {
    ctx.beginPath();
    ctx.arc(lx, ly, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Glass reflex
    ctx.beginPath();
    ctx.arc(lx - 3, ly - 3, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fill();
  };

  drawLens(camX + 22, camY + 24);
  drawLens(camX + 22, camY + 56);
  drawLens(camX + 53, camY + 40);

  // Flash
  ctx.beginPath();
  ctx.arc(camX + 53, camY + 18, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#fef08a';
  ctx.fill();

  ctx.restore();
}

// ----------------- LOGO DRAWING & WARPING -----------------

function drawLogoOnProduct(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  product: ProductConfig,
  logoImg: HTMLImageElement,
  transform: LogoTransform,
  productColor: string
) {
  const { printArea, warpType, curvedDepth = 0.12 } = product;

  // Print area in canvas coordinates
  const areaX = (printArea.x / 100) * w;
  const areaY = (printArea.y / 100) * h;
  const areaW = (printArea.width / 100) * w;
  const areaH = (printArea.height / 100) * h;

  // Center of print area + user offset
  const centerX = areaX + areaW / 2 + (transform.x / 100) * areaW;
  const centerY = areaY + areaH / 2 + (transform.y / 100) * areaH;

  // Calculate logo scaled dimensions preserving natural aspect ratio
  const imgAspect = logoImg.naturalWidth / logoImg.naturalHeight;
  let targetW = areaW * 0.7 * transform.scale;
  let targetH = targetW / imgAspect;

  if (targetH > areaH * 0.9 * transform.scale) {
    targetH = areaH * 0.9 * transform.scale;
    targetW = targetH * imgAspect;
  }

  // First render the logo to an offscreen canvas to apply user color/effects
  const offscreen = document.createElement('canvas');
  offscreen.width = Math.ceil(targetW);
  offscreen.height = Math.ceil(targetH);
  const offCtx = offscreen.getContext('2d');
  if (!offCtx) return;

  // Draw base logo
  offCtx.drawImage(logoImg, 0, 0, offscreen.width, offscreen.height);

  // Apply Logo Color Inversion / White Ink / Black Ink / Gold Foil / Embroidery Effects
  applyLogoEffects(offCtx, offscreen.width, offscreen.height, transform.effect, transform.invertColor);

  ctx.save();
  ctx.globalAlpha = transform.opacity;

  // Apply blend mode
  // If product is white/light and blendMode is multiply, it looks like real ink
  if (transform.blendMode === 'multiply') {
    ctx.globalCompositeOperation = 'multiply';
  } else if (transform.blendMode !== 'source-over') {
    ctx.globalCompositeOperation = transform.blendMode;
  }

  if (warpType === 'cylinder') {
    // Realistic cylindrical mapping:
    // Slices offscreen logo into vertical stripes, warps them with sinusoidal foreshortening
    drawCylinderWarp(
      ctx,
      offscreen,
      centerX,
      centerY,
      targetW,
      targetH,
      transform.rotation,
      curvedDepth,
      productColor
    );
  } else if (warpType === 'curved') {
    // Subtle arc curve (e.g. for baseball cap)
    drawCurvedWarp(ctx, offscreen, centerX, centerY, targetW, targetH, transform.rotation, curvedDepth);
  } else {
    // Flat / Fabric
    ctx.translate(centerX, centerY);
    ctx.rotate((transform.rotation * Math.PI) / 180);

    // If sticker, add white die-cut border with drop shadow!
    if (product.id === 'sticker') {
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;
    }

    ctx.drawImage(offscreen, -targetW / 2, -targetH / 2, targetW, targetH);
  }

  ctx.restore();
}

function applyLogoEffects(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  effect: LogoTransform['effect'],
  invertColor: boolean
) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  if (invertColor) {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 10) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
      }
    }
  }

  if (effect === 'white-ink') {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 20) {
        data[i] = 250;
        data[i + 1] = 250;
        data[i + 2] = 252;
      }
    }
  } else if (effect === 'black-ink') {
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 20) {
        data[i] = 20;
        data[i + 1] = 22;
        data[i + 2] = 26;
      }
    }
  } else if (effect === 'gold-foil') {
    // Metallic lustrous warm gold
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        if (data[i + 3] > 20) {
          const shimmer = Math.sin((x + y) * 0.08) * 30;
          data[i] = Math.min(255, 220 + shimmer); // R
          data[i + 1] = Math.min(255, 175 + shimmer); // G
          data[i + 2] = Math.min(255, 65 + shimmer * 0.5); // B
        }
      }
    }
  } else if (effect === 'vintage') {
    // Subtle distress cracks and washed-out tone
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 20) {
        if (Math.random() < 0.12) {
          data[i + 3] = Math.floor(data[i + 3] * 0.35); // weathered ink holes
        }
      }
    }
  } else if (effect === 'embroidery') {
    // Thread embroidery stitch texture
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        if (data[i + 3] > 20) {
          // Horizontal thread lines
          const threadShade = (y % 4 === 0) ? -25 : (y % 4 === 2) ? 15 : 0;
          data[i] = Math.max(0, Math.min(255, data[i] + threadShade));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + threadShade));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + threadShade));
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

function drawCylinderWarp(
  ctx: CanvasRenderingContext2D,
  source: HTMLCanvasElement,
  cx: number,
  cy: number,
  targetW: number,
  targetH: number,
  rotation: number,
  _depth: number,
  _productColor: string
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((rotation * Math.PI) / 180);

  const numSlices = 40;
  const sliceW = source.width / numSlices;

  // Cylinder perspective mapping:
  // Theta spans from -PI/3 to +PI/3 across targetW
  for (let i = 0; i < numSlices; i++) {
    const sx = i * sliceW;
    const normX = (i / numSlices) * 2 - 1; // -1 to +1
    // Cylindrical foreshortening
    const theta = normX * (Math.PI / 3.2);
    const destX = (Math.sin(theta) / Math.sin(Math.PI / 3.2)) * (targetW / 2);
    const sliceWidth = (Math.cos(theta) * targetW) / numSlices * 1.05;

    // Slight vertical curvature matching mug rim
    const curveY = (1 - Math.cos(theta)) * 12;

    ctx.drawImage(
      source,
      sx,
      0,
      sliceW,
      source.height,
      destX - sliceWidth / 2,
      -targetH / 2 + curveY,
      sliceWidth,
      targetH
    );
  }

  ctx.restore();
}

function drawCurvedWarp(
  ctx: CanvasRenderingContext2D,
  source: HTMLCanvasElement,
  cx: number,
  cy: number,
  targetW: number,
  targetH: number,
  rotation: number,
  depth: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((rotation * Math.PI) / 180);

  const numSlices = 20;
  const sliceW = source.width / numSlices;

  for (let i = 0; i < numSlices; i++) {
    const sx = i * sliceW;
    const normX = (i / numSlices) * 2 - 1; // -1 to 1
    const curveY = (1 - normX * normX) * depth * targetH;
    const dx = -targetW / 2 + (i / numSlices) * targetW;

    ctx.drawImage(
      source,
      sx,
      0,
      sliceW,
      source.height,
      dx,
      -targetH / 2 - curveY,
      targetW / numSlices + 0.5,
      targetH
    );
  }

  ctx.restore();
}

// ----------------- OVERLAYS (FOLDS, SPECULAR HIGHLIGHTS) -----------------

function drawProductOverlays(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  productId: string,
  _productColor: string
) {
  ctx.save();

  if (productId === 'mug' || productId === 'enamel-mug') {
    // Mug specular highlight gleam over front
    const cx = w * 0.5;
    const top = h * 0.28;
    const gleamGrad = ctx.createLinearGradient(cx - 80, 0, cx - 40, 0);
    gleamGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    gleamGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.28)');
    gleamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gleamGrad;
    ctx.fillRect(cx - 80, top, 40, h * 0.44);

    // Rim highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(cx, top, w * 0.21, 20, 0, Math.PI * 0.1, Math.PI * 0.9);
    ctx.stroke();
  } else if (productId === 'tumbler') {
    // Vertical specular sheen line
    const cx = w * 0.5;
    const gleam = ctx.createLinearGradient(cx - 50, 0, cx - 20, 0);
    gleam.addColorStop(0, 'rgba(255,255,255,0)');
    gleam.addColorStop(0.5, 'rgba(255,255,255,0.3)');
    gleam.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gleam;
    ctx.fillRect(cx - 50, h * 0.22, 30, h * 0.54);
  } else if (productId === 'tshirt' || productId === 'hoodie') {
    // Fabric wrinkle & fold shading overlays
    ctx.globalCompositeOperation = 'soft-light';
    const cx = w * 0.5;
    const cy = h * 0.48;

    // Organic soft folds
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.beginPath();
    ctx.moveTo(cx - 120, cy - 80);
    ctx.quadraticCurveTo(cx - 80, cy + 40, cx - 60, cy + 120);
    ctx.quadraticCurveTo(cx - 75, cy + 40, cx - 110, cy - 80);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx + 110, cy - 60);
    ctx.quadraticCurveTo(cx + 70, cy + 30, cx + 55, cy + 100);
    ctx.quadraticCurveTo(cx + 65, cy + 30, cx + 100, cy - 60);
    ctx.fill();

    // Subtle fabric weave texture
    ctx.globalAlpha = 0.04;
    ctx.fillStyle = '#000000';
    for (let y = cy - 120; y < cy + 140; y += 4) {
      ctx.fillRect(cx - 140, y, 280, 1);
    }
  } else if (productId === 'tote') {
    // Coarse canvas weave
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = '#000000';
    for (let y = h * 0.4; y < h * 0.85; y += 4) {
      ctx.fillRect(w * 0.25, y, w * 0.5, 1);
    }
  }

  ctx.restore();
}

function drawPrintZoneGuide(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  product: ProductConfig
) {
  const { printArea } = product;
  const x = (printArea.x / 100) * w;
  const y = (printArea.y / 100) * h;
  const pw = (printArea.width / 100) * w;
  const ph = (printArea.height / 100) * h;

  ctx.save();
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 6]);
  ctx.strokeRect(x, y, pw, ph);

  // Center crosshair
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
  ctx.beginPath();
  ctx.moveTo(x + pw / 2 - 12, y + ph / 2);
  ctx.lineTo(x + pw / 2 + 12, y + ph / 2);
  ctx.moveTo(x + pw / 2, y + ph / 2 - 12);
  ctx.lineTo(x + pw / 2, y + ph / 2 + 12);
  ctx.stroke();

  // Print area label badge
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(x, y - 20, 84, 18);
  ctx.fillStyle = '#ffffff';
  ctx.font = '10px Inter, sans-serif';
  ctx.fillText('PRINT AREA', x + 6, y - 7);

  ctx.restore();
}
