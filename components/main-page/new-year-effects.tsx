"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function isNewYearPeriod(now: Date) {
  const month = now.getMonth() + 1;
  const day = now.getDate();
  if (month === 12 && day >= 28) return true;
  if (month === 1 || month === 2) return true;
  if (month === 3 && day === 1) return true;
  return false;
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

const redEnvelopeSvg = `<svg viewBox="0 0 64 64" width="1em" height="1em"><rect x="8" y="4" width="48" height="56" rx="4" fill="#e53935"/><rect x="8" y="4" width="48" height="20" rx="4" fill="#c62828"/><circle cx="32" cy="24" r="10" fill="#ffd54f"/><text x="32" y="29" text-anchor="middle" fill="#c62828" font-size="12" font-weight="bold">福</text><rect x="28" y="34" width="8" height="16" fill="#ffd54f"/></svg>`;

const fuSvg = `<svg viewBox="0 0 64 64" width="1em" height="1em"><rect x="4" y="4" width="56" height="56" rx="4" fill="#e53935"/><rect x="8" y="8" width="48" height="48" rx="2" fill="#c62828" stroke="#ffd54f" stroke-width="2"/><text x="32" y="45" text-anchor="middle" fill="#ffd54f" font-size="36" font-weight="bold" font-family="serif">福</text></svg>`;

const lanternSvg = `<svg viewBox="0 0 64 80" width="1em" height="1em"><rect x="24" y="0" width="16" height="8" fill="#ffd54f"/><line x1="32" y1="8" x2="32" y2="14" stroke="#c62828" stroke-width="2"/><ellipse cx="32" cy="40" rx="24" ry="28" fill="#e53935"/><ellipse cx="32" cy="40" rx="20" ry="24" fill="#ff5722"/><ellipse cx="32" cy="40" rx="16" ry="20" fill="#ff7043"/><rect x="8" y="36" width="48" height="8" fill="#ffd54f" opacity="0.6"/><text x="32" y="45" text-anchor="middle" fill="#ffd54f" font-size="16" font-weight="bold">春</text><rect x="24" y="66" width="16" height="6" fill="#ffd54f"/><line x1="28" y1="72" x2="28" y2="80" stroke="#e53935" stroke-width="2"/><line x1="32" y1="72" x2="32" y2="82" stroke="#e53935" stroke-width="2"/><line x1="36" y1="72" x2="36" y2="80" stroke="#e53935" stroke-width="2"/></svg>`;

const sparklesSvg = `<svg viewBox="0 0 64 64" width="1em" height="1em"><polygon points="32,4 36,24 56,24 40,36 46,56 32,44 18,56 24,36 8,24 28,24" fill="#ffd54f"/><polygon points="32,12 34,24 46,24 36,32 40,44 32,36 24,44 28,32 18,24 30,24" fill="#ffeb3b"/><circle cx="32" cy="28" r="4" fill="#fff"/></svg>`;

const fallingIcons = [redEnvelopeSvg, fuSvg, lanternSvg, sparklesSvg];

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  hue: number;
  decay: number;
  gravity: number;

  constructor(x: number, y: number, hue: number) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1.5;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.hue = hue + Math.random() * 24 - 12;
    this.decay = 0.03 + Math.random() * 0.02;
    this.gravity = 0.05;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= 0.985;
    this.alpha -= this.decay;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha) * 0.75;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${this.hue}, 100%, 62%)`;
    ctx.fill();
    ctx.restore();
  }
}

class Firework {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  hue: number;
  exploded = false;
  particles: Particle[] = [];

  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = h;
    this.targetY = Math.random() * (h * 0.45) + 60;
    this.speed = 2.6 + Math.random() * 1.6;
    this.hue = Math.random() * 360;
  }

  update() {
    if (!this.exploded) {
      this.y -= this.speed;
      if (this.y <= this.targetY) this.explode();
    }
    this.particles = this.particles.filter((p) => p.alpha > 0);
    this.particles.forEach((p) => p.update());
  }

  explode() {
    this.exploded = true;
    const particleCount = 44 + Math.floor(Math.random() * 22);
    for (let i = 0; i < particleCount; i++) this.particles.push(new Particle(this.x, this.y, this.hue));
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.exploded) {
      ctx.save();
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${this.hue}, 100%, 70%)`;
      ctx.fill();
      ctx.restore();
    }
    this.particles.forEach((p) => p.draw(ctx));
  }

  isDead() {
    return this.exploded && this.particles.length === 0;
  }
}

export function NewYearEffects() {
  const active = useMemo(() => isNewYearPeriod(new Date()), []);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    if (!active) return;
    if (typeof window === "undefined") return;

    const storageKey = `ny-banner-closed-${new Date().getFullYear()}`;
    try {
      if (sessionStorage.getItem(storageKey) === "1") setShowBanner(false);
    } catch {
      // ignore
    }

    const reduced = prefersReducedMotion();
    const isMobile = window.innerWidth < 768;
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const fireworks: Firework[] = [];
    let frame = 0;
    const maxFireworks = isMobile ? 2 : 5;
    const spawnEvery = isMobile ? 100 : 70;

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (frame % spawnEvery === 0 && fireworks.length < maxFireworks) {
        fireworks.push(new Firework(canvas.width, canvas.height));
      }

      for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw(ctx);
        if (fireworks[i].isDead()) fireworks.splice(i, 1);
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    rafRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="ny-effects" aria-hidden="true">
      <canvas ref={canvasRef} className="ny-fireworks" />

      <div className="ny-falling" aria-hidden="true">
        {Array.from({ length: 15 }).map((_, idx) => (
          <div key={idx} className="ny-falling-item">
            <div
              className="ny-falling-inner"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: fallingIcons[idx % fallingIcons.length] }}
            />
          </div>
        ))}
      </div>

      {/* eslint-disable-next-line react/no-danger */}
      <div className="ny-corner ny-corner-left" dangerouslySetInnerHTML={{ __html: lanternSvg }} />
      {/* eslint-disable-next-line react/no-danger */}
      <div className="ny-corner ny-corner-right" dangerouslySetInnerHTML={{ __html: lanternSvg }} />

      {showBanner ? (
        <button
          type="button"
          className="ny-banner"
          onClick={() => {
            setShowBanner(false);
            const storageKey = `ny-banner-closed-${new Date().getFullYear()}`;
            try {
              sessionStorage.setItem(storageKey, "1");
            } catch {
              // ignore
            }
          }}
        >
          <div className="ny-banner-card">
            <div className="ny-banner-meta">
              <span className="ny-banner-badge">新年活动</span>
              <span className="ny-banner-hint">点击关闭</span>
            </div>
            <div className="ny-banner-text">SVC Fusion 开发团队祝各位新年快乐，万事如意！</div>
          </div>
        </button>
      ) : null}
    </div>
  );
}
