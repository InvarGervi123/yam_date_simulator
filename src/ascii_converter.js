// --- Client-side Image-to-ASCII Converter ---

window.asciiCache = {};

// Pre-defined ASCII assets for file:// protocol compliance (No CORS/Canvas taint blocks)
const PREDEFINED_ASCII = {
  "yam_angry.png": `
        .-"""-.
       / ☠   ☠ \\\\
      |  (o.o)  |
      |   \\\\=/   |
       \\\\   m   /
        |     |
  `,
  "yam.png": `
        .-"""-.
       /  o   o  \\\\
      |   (o.o)   |
      |    \\\\=/    |
       \\\\    m    /
        |       |
  `,
  "yam_dead.png": `
       .---.
      / ☠ ☠ \\\\
     |  (X.X)  |
      \\\\   ^   /
       |||||||
       '-----'
  `,
  "room.jpg": `
+-------------------------------------------------+
|  /|                                         |\\\\  |
| / |               [ WINDOW ]                | \\\\ |
|/  |             +------------+              |  \\\\|
|   |             |   ★    ★   |              |   |
|   |             +------------+              |   |
|   |                                         |   |
|   |             +------------+              |   |
|   |             |  [ BED ]   |              |   |
|   |_____________|   YAMDATE  |______________|   |
|  /              +------------+               \\\\  |
| /                                             \\\\ |
|/                                               \\\\|
+-------------------------------------------------+
  `
};

window.convertToAscii = function(imgElement, width, height, callback) {
  if (!imgElement) {
    if (callback) callback("");
    return "";
  }

  const src = imgElement.src || "";
  
  // Find match in predefined ASCII based on filename
  for (const filename in PREDEFINED_ASCII) {
    if (src.includes(filename)) {
      const art = PREDEFINED_ASCII[filename];
      if (callback) callback(art);
      return art;
    }
  }

  // Fallback to canvas conversion (if running on http/https server with CORS support)
  if (window.asciiCache[src]) {
    if (callback) callback(window.asciiCache[src]);
    return window.asciiCache[src];
  }

  const canvas = document.createElement("canvas");
  canvas.width = width || 80;
  canvas.height = height || 45;
  const ctx = canvas.getContext("2d");
  
  try {
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    
    // Character ramp (high contrast)
    const chars = "@#8&o:*. ";
    let asciiStr = "";
    
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4;
        const r = data[idx];
        const g = data[idx+1];
        const b = data[idx+2];
        const a = data[idx+3];
        
        if (a < 50) {
          asciiStr += " ";
        } else {
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
          const charIdx = Math.floor((brightness / 255) * (chars.length - 1));
          asciiStr += chars[charIdx];
        }
      }
      asciiStr += "\n";
    }
    
    window.asciiCache[src] = asciiStr;
    if (callback) callback(asciiStr);
    return asciiStr;
  } catch (e) {
    console.warn("Local ASCII conversion failed (CORS file:// block expected, fallback to default)", e);
    
    // Return empty fallback art instead of crash
    const fallbackArt = "\n [ ASCII ART ] \n";
    if (callback) callback(fallbackArt);
    return fallbackArt;
  }
};
