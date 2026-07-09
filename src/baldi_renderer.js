// --- Baldi's Basics 3D Raycasting Renderer Module ---

window.baldiRenderer = {
  render3D: function(ctx, canvasCtx) {
    if (ctx.jumpScareActive) {
      // Flashing screen
      canvasCtx.fillStyle = (Math.floor(Date.now() / 80) % 2 === 0) ? "#7a1111" : "#000000";
      canvasCtx.fillRect(0, 0, 320, 240);

      // Shaking giant image of Yam
      let shakeX = Math.random() * 16 - 8;
      let shakeY = Math.random() * 16 - 8;

      let imgW = 160;
      let imgH = 160;
      canvasCtx.drawImage(ctx.jumpscareYamImg, 160 - imgW / 2 + shakeX, 120 - imgH / 2 + shakeY, imgW, imgH);
      return;
    }

    // Clear screen with ceiling & floor colors
    canvasCtx.fillStyle = "#d2d2a6"; // Ceiling
    canvasCtx.fillRect(0, 0, 320, 120);
    canvasCtx.fillStyle = "#5b7b9c"; // Blue floor
    canvasCtx.fillRect(0, 120, 320, 120);

    let zBuffer = new Array(320);

    // Wall Raycasting
    for (let col = 0; col < 320; col++) {
      let rayAngle = ctx.pa - ctx.fov / 2 + (col / 320) * ctx.fov;
      let dx = Math.cos(rayAngle);
      let dy = Math.sin(rayAngle);

      let mapX = Math.floor(ctx.px);
      let mapY = Math.floor(ctx.py);

      let deltaDistX = Math.abs(1 / dx);
      let deltaDistY = Math.abs(1 / dy);

      let stepX, stepY;
      let sideDistX, sideDistY;

      if (dx < 0) {
        stepX = -1;
        sideDistX = (ctx.px - mapX) * deltaDistX;
      } else {
        stepX = 1;
        sideDistX = (mapX + 1.0 - ctx.px) * deltaDistX;
      }

      if (dy < 0) {
        stepY = -1;
        sideDistY = (ctx.py - mapY) * deltaDistY;
      } else {
        stepY = 1;
        sideDistY = (mapY + 1.0 - ctx.py) * deltaDistY;
      }

      let hit = false;
      let side = 0; // NS or EW wall
      let distance = 0;

      while (!hit && distance < 18) {
        if (sideDistX < sideDistY) {
          sideDistX += deltaDistX;
          mapX += stepX;
          side = 0;
        } else {
          sideDistY += deltaDistY;
          mapY += stepY;
          side = 1;
        }

        if (mapX < 0 || mapX >= ctx.mapSize || mapY < 0 || mapY >= ctx.mapSize) {
          distance = 18;
          break;
        }

        if (ctx.map[mapY][mapX] > 0) {
          hit = true;
        }
      }

      if (side === 0) distance = (mapX - ctx.px + (1 - stepX) / 2) / dx;
      else distance = (mapY - ctx.py + (1 - stepY) / 2) / dy;

      // Correct fish-eye
      let correctedDist = distance * Math.cos(rayAngle - ctx.pa);
      if (correctedDist <= 0.05) correctedDist = 0.05;

      zBuffer[col] = correctedDist;

      // Height of wall slice
      let sliceHeight = Math.floor(240 / correctedDist);
      let drawStart = Math.max(0, 120 - sliceHeight / 2);
      let drawEnd = Math.min(240, 120 + sliceHeight / 2);

      // Shading based on wall type and side
      let wallType = ctx.map[mapY][mapX];
      let wallColor = "#ffd447"; // Yellow brick default
      if (wallType === 2) {
        wallColor = "#9c3c3c"; // Red classroom door
      }

      canvasCtx.fillStyle = wallColor;
      canvasCtx.fillRect(col, drawStart, 1, drawEnd - drawStart);

      // Shadow overlay to create depth
      let shadow = Math.min(1.0, correctedDist / 12);
      if (side === 1) shadow = shadow * 0.7 + 0.3;
      canvasCtx.fillStyle = `rgba(0,0,0,${shadow.toFixed(2)})`;
      canvasCtx.fillRect(col, drawStart, 1, drawEnd - drawStart);
    }

    // Render sprites sorted by distance
    let spritesCopy = ctx.sprites.map(s => {
      let dx = s.x - ctx.px;
      let dy = s.y - ctx.py;
      return {
        sprite: s,
        dist: Math.sqrt(dx*dx + dy*dy),
        dx: dx,
        dy: dy
      };
    });

    spritesCopy.sort((a, b) => b.dist - a.dist);

    spritesCopy.forEach(sc => {
      let s = sc.sprite;
      if (s.type === "notebook" && s.collected) return;
      if (s.type === "exit" && !s.active) return;
      if (s.type === "yam" && !s.active) return;

      // Sprite angle relative to player direction
      let spriteAngle = Math.atan2(sc.dy, sc.dx) - ctx.pa;
      while (spriteAngle < -Math.PI) spriteAngle += Math.PI * 2;
      while (spriteAngle > Math.PI) spriteAngle -= Math.PI * 2;

      // Render if in FOV
      if (Math.abs(spriteAngle) < ctx.fov) {
        let screenX = 160 + Math.tan(spriteAngle) * 160 / Math.tan(ctx.fov / 2);
        let dist = sc.dist;
        if (dist < 0.1) dist = 0.1;

        // Check center column Z-Buffer
        let centerCol = Math.floor(screenX);
        if (centerCol >= 0 && centerCol < 320 && dist < zBuffer[centerCol]) {
          let size = Math.floor(200 / dist);
          if (size > 150) size = 150;
          if (size < 6) size = 6;

          if (s.type === "yam") {
            let imgW = size;
            let imgH = size;
            canvasCtx.drawImage(ctx.jumpscareYamImg, screenX - imgW / 2, 120 - imgH / 2, imgW, imgH);
          } else {
            canvasCtx.font = `${size}px Courier New`;
            canvasCtx.textAlign = "center";
            canvasCtx.textBaseline = "middle";

            canvasCtx.fillStyle = "#000000";
            canvasCtx.fillText(s.label, screenX + 1, 120 + 1);
            canvasCtx.fillStyle = "#ffffff";
            canvasCtx.fillText(s.label, screenX, 120);
          }
        }
      }
    });

    // Draw Map HUD overlays (Red light flashing if Yam is close)
    if (ctx.yamRef.active) {
      let dx = ctx.yamRef.x - ctx.px;
      let dy = ctx.yamRef.y - ctx.py;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 3.0) {
        ctx.hudAlert.className = "baldi-hud-alert";
        ctx.hudAlert.style.display = "block";
      } else {
        ctx.hudAlert.style.display = "none";
      }
    } else {
      ctx.hudAlert.style.display = "none";
    }
  }
};
