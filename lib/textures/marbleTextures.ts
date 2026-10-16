"use client";

import * as THREE from "three";

let cachedCalacattaTexture: THREE.CanvasTexture | null = null;
let cachedBlackMarbleTexture: THREE.CanvasTexture | null = null;
let cachedLogoTexture: THREE.CanvasTexture | null = null;
let cachedCircleLogoTexture: THREE.CanvasTexture | null = null;

/**
 * Procedural Calacatta Gold Marble Canvas Texture
 * Creates luxury ivory marble with organic gold and soft charcoal veins
 */
export function getCalacattaMarbleTexture(): THREE.CanvasTexture {
  if (typeof window === "undefined") {
    return new THREE.CanvasTexture({} as any);
  }
  if (cachedCalacattaTexture) return cachedCalacattaTexture;

  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // 1. Base Warm Skin-Gold Ivory & Champagne Calacatta Marble
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, "#F6E8D5");
    grad.addColorStop(0.25, "#EFE0CB");
    grad.addColorStop(0.65, "#E8D5BC");
    grad.addColorStop(1, "#F2E4D0");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // 2. Rich stone clouding & warm amber mineral depth
    for (let i = 0; i < 50; i++) {
      const cx = Math.random() * size;
      const cy = Math.random() * size;
      const r = 90 + Math.random() * 260;
      const cloudGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      cloudGrad.addColorStop(0, "rgba(224, 198, 165, 0.42)");
      cloudGrad.addColorStop(0.5, "rgba(235, 214, 186, 0.22)");
      cloudGrad.addColorStop(1, "rgba(246, 232, 213, 0)");
      ctx.fillStyle = cloudGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Elegant Gold & Taupe Diagonal Veins
    const drawVein = (startX: number, startY: number, color: string, width: number, branches: number) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      let x = startX;
      let y = startY;
      ctx.beginPath();
      ctx.moveTo(x, y);

      for (let s = 0; s < 22; s++) {
        x += 30 + Math.random() * 42;
        y += 22 + (Math.random() - 0.45) * 48;
        ctx.lineTo(x, y);

        if (branches > 0 && Math.random() > 0.52) {
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x, y);
          let bx = x;
          let by = y;
          for (let b = 0; b < 6; b++) {
            bx += 16 + Math.random() * 26;
            by += (Math.random() - 0.4) * 32;
            ctx.lineTo(bx, by);
          }
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x, y);
        }
      }
      ctx.stroke();
      ctx.restore();
    };

    // Major Warm Golden Veins
    for (let v = 0; v < 8; v++) {
      drawVein(-100, v * 150 - 70, "rgba(208, 158, 68, 0.72)", 4.0, 3);
      drawVein(-60, v * 150 - 30, "rgba(232, 190, 98, 0.48)", 7.0, 2);
    }

    // Secondary Rich Warm Grey/Bronze Whisper Veins
    for (let v = 0; v < 9; v++) {
      drawVein(-120, v * 130 + 20, "rgba(152, 134, 114, 0.38)", 2.4, 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.needsUpdate = true;
  cachedCalacattaTexture = texture;
  return texture;
}

/**
 * Procedural Bookmatched Black Gold Marble Canvas Texture
 * For the monumental feature wall behind the grand staircase
 */
export function getBookmatchedBlackMarbleTexture(): THREE.CanvasTexture {
  if (typeof window === "undefined") {
    return new THREE.CanvasTexture({} as any);
  }
  if (cachedBlackMarbleTexture) return cachedBlackMarbleTexture;

  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // 1. Deep Obsidian / Nero Marquina Base
    ctx.fillStyle = "#0D0C0B";
    ctx.fillRect(0, 0, size, size);

    // Subtle dark graphite clouds
    for (let i = 0; i < 30; i++) {
      const cx = Math.random() * size;
      const cy = Math.random() * size;
      const r = 100 + Math.random() * 200;
      const cloudGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      cloudGrad.addColorStop(0, "rgba(26, 25, 24, 0.6)");
      cloudGrad.addColorStop(1, "rgba(13, 12, 11, 0)");
      ctx.fillStyle = cloudGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Symmetrical Bookmatched Golden Marble Veins
    const half = size / 2;
    const drawVeinHalf = (color: string, width: number) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = "round";

      // Draw left half, then mirror to right half
      const points: [number, number][] = [];
      let x = half - 10;
      let y = 100;
      points.push([x, y]);

      for (let i = 0; i < 12; i++) {
        x -= 25 + Math.random() * 35;
        y += 45 + Math.random() * 50;
        points.push([x, y]);
      }

      // Draw Left Side
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
      ctx.stroke();

      // Mirror to Right Side (Bookmatch)
      ctx.beginPath();
      ctx.moveTo(half + (half - points[0][0]), points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(half + (half - points[i][0]), points[i][1]);
      }
      ctx.stroke();

      ctx.restore();
    };

    // Draw bookmatch pairs
    for (let k = 0; k < 5; k++) {
      drawVeinHalf("rgba(217, 180, 90, 0.75)", 2.8);
      drawVeinHalf("rgba(240, 185, 104, 0.4)", 5.0);
      drawVeinHalf("rgba(242, 232, 216, 0.35)", 1.4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  cachedBlackMarbleTexture = texture;
  return texture;
}

/**
 * Transparent Official MW Logo Texture
 * Loads /mw-logo-official.jpg and cuts out black background into transparent alpha
 */
export function loadTransparentLogoTexture(onLoaded?: (tex: THREE.CanvasTexture) => void): THREE.CanvasTexture {
  if (typeof window === "undefined") {
    return new THREE.CanvasTexture({} as any);
  }
  if (cachedLogoTexture) {
    if (onLoaded) onLoaded(cachedLogoTexture);
    return cachedLogoTexture;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = "/mw-logo-official.jpg";

  img.onload = () => {
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, 640, 640);
    const imgData = ctx.getImageData(0, 0, 640, 640);
    const data = imgData.data;

    // Convert pure black background to transparent alpha
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

      if (luminance < 22) {
        // Pure black background -> transparent
        data[i + 3] = 0;
      } else if (luminance < 60) {
        // Smooth transition edge
        data[i + 3] = Math.round(((luminance - 22) / 38) * 255);
      } else {
        // Gold logo body -> solid
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    texture.needsUpdate = true;
    cachedLogoTexture = texture;
    if (onLoaded) onLoaded(texture);
  };

  return texture;
}

/**
 * Circular Masked Official MW Logo Texture
 * Circular black marble medallion with official gold logo
 */
export function loadCircularMedallionTexture(onLoaded?: (tex: THREE.CanvasTexture) => void): THREE.CanvasTexture {
  if (typeof window === "undefined") {
    return new THREE.CanvasTexture({} as any);
  }
  if (cachedCircleLogoTexture) {
    if (onLoaded) onLoaded(cachedCircleLogoTexture);
    return cachedCircleLogoTexture;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = "/mw-logo-official.jpg";

  img.onload = () => {
    if (!ctx) return;
    // 1. Black marble core disc
    ctx.clearRect(0, 0, 640, 640);
    ctx.save();
    ctx.beginPath();
    ctx.arc(320, 320, 318, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.fillStyle = "#0E0D0C";
    ctx.fillRect(0, 0, 640, 640);

    // Draw logo centered
    ctx.drawImage(img, 0, 0, 640, 640);
    ctx.restore();

    texture.needsUpdate = true;
    cachedCircleLogoTexture = texture;
    if (onLoaded) onLoaded(texture);
  };

  return texture;
}

const signTextureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Procedural Illuminated Luxury Storefront Fascia Sign Texture
 * Generates ultra-crisp, high-resolution champagne gold typography on polished black marble
 */
export function createFasciaSignTexture(text: string): THREE.CanvasTexture {
  if (typeof window === "undefined") {
    return new THREE.CanvasTexture({} as any);
  }
  if (signTextureCache.has(text)) {
    return signTextureCache.get(text)!;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // 1. Deep Glossy Nero Marquina Black Marble Fascia Background
    ctx.fillStyle = "#0A0908";
    ctx.fillRect(0, 0, 2048, 512);

    // Subtle stone clouding & organic depth
    for (let i = 0; i < 28; i++) {
      const cx = Math.random() * 2048;
      const cy = Math.random() * 512;
      const r = 80 + Math.random() * 180;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, "rgba(32, 29, 26, 0.5)");
      g.addColorStop(1, "rgba(10, 9, 8, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Faint golden marble micro-veins
    ctx.save();
    ctx.strokeStyle = "rgba(224, 182, 94, 0.22)";
    ctx.lineWidth = 1.5;
    for (let v = 0; v < 5; v++) {
      ctx.beginPath();
      let vx = v * 420 + 80;
      let vy = 0;
      ctx.moveTo(vx, vy);
      for (let s = 0; s < 12; s++) {
        vx += 35 + Math.random() * 45;
        vy += 45;
        ctx.lineTo(vx, vy);
      }
      ctx.stroke();
    }
    ctx.restore();

    // High-Gloss Specular Clearcoat Sheen across upper fascia
    const clearcoat = ctx.createLinearGradient(0, 0, 0, 220);
    clearcoat.addColorStop(0, "rgba(255, 255, 255, 0.16)");
    clearcoat.addColorStop(0.35, "rgba(255, 240, 200, 0.08)");
    clearcoat.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = clearcoat;
    ctx.fillRect(0, 0, 2048, 220);

    // 2. Double Champagne Gold Architectural Inlay Borders top & bottom
    // Outer Border
    ctx.fillStyle = "#E5BE5E";
    ctx.fillRect(45, 24, 1958, 7);
    ctx.fillRect(45, 481, 1958, 7);
    // Inner Thin Accent Line
    ctx.fillStyle = "rgba(240, 205, 125, 0.65)";
    ctx.fillRect(75, 40, 1898, 2.5);
    ctx.fillRect(75, 469, 1898, 2.5);

    // 3. Ultra-Luxury Letterspaced Branded Serif Typography
    // Format words with refined letterspacing
    const words = text.trim().split(/\s+/);
    const spacedWords = words.map((w) => w.split("").join("   "));
    const formattedText = spacedWords.join("        ");

    // Dynamic sizing to guarantee text NEVER overflows or touches margins
    let fontSize = 152;
    ctx.font = `bold ${fontSize}px 'Cinzel', 'Playfair Display', 'Bodoni MT', 'Times New Roman', serif`;
    let measuredWidth = ctx.measureText(formattedText).width;
    const maxAllowedWidth = 1760; // 144px safety margin on left and right
    if (measuredWidth > maxAllowedWidth) {
      fontSize = Math.floor(fontSize * (maxAllowedWidth / measuredWidth));
      ctx.font = `bold ${fontSize}px 'Cinzel', 'Playfair Display', 'Bodoni MT', 'Times New Roman', serif`;
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Ambient Golden Backlight Halo
    ctx.shadowColor = "rgba(245, 195, 110, 0.9)";
    ctx.shadowBlur = 40;
    ctx.fillStyle = "#FFF6DC";
    ctx.fillText(formattedText, 1024, 256);

    // Secondary Soft Glow
    ctx.shadowBlur = 18;
    ctx.fillStyle = "#F5D075";
    ctx.fillText(formattedText, 1024, 256);

    // Sharp Multi-Stop Champagne Gold Core Face
    ctx.shadowBlur = 0;
    const goldGrad = ctx.createLinearGradient(0, 150, 0, 360);
    goldGrad.addColorStop(0, "#FFFFFF");
    goldGrad.addColorStop(0.18, "#FFF2D2");
    goldGrad.addColorStop(0.55, "#E5BE5E");
    goldGrad.addColorStop(0.85, "#B88A2C");
    goldGrad.addColorStop(1, "#7D5814");
    ctx.fillStyle = goldGrad;
    ctx.fillText(formattedText, 1024, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  signTextureCache.set(text, texture);
  return texture;
}

let cachedPlaqueTexture: THREE.CanvasTexture | null = null;
export function createComingSoonPlaqueTexture(): THREE.CanvasTexture {
  if (typeof window === "undefined") {
    return new THREE.CanvasTexture({} as any);
  }
  if (cachedPlaqueTexture) return cachedPlaqueTexture;

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#11100F";
    ctx.fillRect(0, 0, 1024, 256);

    // Gold borders
    ctx.fillStyle = "#E5BE5E";
    ctx.fillRect(16, 12, 992, 4);
    ctx.fillRect(16, 240, 992, 4);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Primary Line
    ctx.font = "bold 44px 'Cinzel', 'Playfair Display', 'Times New Roman', serif";
    ctx.fillStyle = "#E5BE5E";
    ctx.fillText("A   N E W   M W   E X P E R I E N C E", 512, 95);

    // Subline
    ctx.font = "32px monospace";
    ctx.fillStyle = "#A39682";
    ctx.fillText("C U R A T I N G   S O O N", 512, 175);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  cachedPlaqueTexture = texture;
  return texture;
}

let cachedEmptyFloorTexture: THREE.CanvasTexture | null = null;
export function createEmptyFloorBannerTexture(): THREE.CanvasTexture {
  if (typeof window === "undefined") {
    return new THREE.CanvasTexture({} as any);
  }
  if (cachedEmptyFloorTexture) return cachedEmptyFloorTexture;

  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 300;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#0D0C0B";
    ctx.fillRect(0, 0, 1200, 300);

    // Double Gold Trim
    ctx.fillStyle = "#E5BE5E";
    ctx.fillRect(20, 16, 1160, 4);
    ctx.fillRect(20, 280, 1160, 4);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Primary Title
    ctx.font = "bold 48px 'Cinzel', 'Playfair Display', 'Times New Roman', serif";
    ctx.fillStyle = "#E5BE5E";
    ctx.fillText("M W   C O L L E C T I O N S   A R E   B E I N G   P R E P A R E D", 600, 110);

    // Subtitle
    ctx.font = "28px monospace";
    ctx.fillStyle = "#D3C7B8";
    ctx.fillText("NEW ATELIER EXPERIENCES ARRIVING SHORTLY", 600, 200);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  cachedEmptyFloorTexture = texture;
  return texture;
}

