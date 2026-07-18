import React, { useEffect, useRef } from 'react';

interface FloatingParticlesProps {
  theme?: 'hearts' | 'roses' | 'stars' | 'none';
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
}

export default function FloatingParticles({ theme = 'hearts' }: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (theme === 'none') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const maxParticles = theme === 'stars' ? 80 : 40;

    const colors = {
      hearts: ['#fb7185', '#f43f5e', '#ec4899', '#fda4af', '#f472b6'],
      roses: ['#ef4444', '#dc2626', '#b91c1c', '#f87171', '#fda4af'],
      stars: ['#fef08a', '#fde047', '#eab308', '#ffffff', '#fef9c3']
    };

    const activeColors = colors[theme as 'hearts' | 'roses' | 'stars'] || colors.hearts;

    const createParticle = (isInitial = false): Particle => {
      return {
        x: Math.random() * width,
        y: isInitial ? Math.random() * height : -20,
        size: Math.random() * (theme === 'stars' ? 4 : 12) + 4,
        speedY: Math.random() * 1.2 + 0.5,
        speedX: Math.random() * 0.8 - 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() * 0.02 - 0.01),
        opacity: Math.random() * 0.5 + 0.3,
        color: activeColors[Math.floor(Math.random() * activeColors.length)]
      };
    };

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }

    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(x, y + topCurveHeight);
      c.bezierCurveTo(
        x - size / 2, y - topCurveHeight, 
        x - size, y + topCurveHeight, 
        x, y + size
      );
      c.bezierCurveTo(
        x + size, y + topCurveHeight, 
        x + size / 2, y - topCurveHeight, 
        x, y + topCurveHeight
      );
      c.closePath();
      c.fill();
    };

    const drawRosePetal = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      c.beginPath();
      c.moveTo(x, y);
      c.quadraticCurveTo(x - size, y - size / 2, x, y - size);
      c.quadraticCurveTo(x + size, y - size / 2, x, y);
      c.closePath();
      c.fill();
    };

    const drawStar = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      const p = 5;
      const m = 0.4;
      let angle = Math.PI / 2 * 3;
      const step = Math.PI / p;
      c.beginPath();
      c.moveTo(x, y - size);
      for (let i = 0; i < p; i++) {
        c.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
        angle += step;
        c.lineTo(x + Math.cos(angle) * size * m, y + Math.sin(angle) * size * m);
        angle += step;
      }
      c.lineTo(x, y - size);
      c.closePath();
      c.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, index) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        // Reset if goes off screen
        if (p.y > height + 20 || p.x < -20 || p.x > width + 20) {
          particles[index] = createParticle(false);
          return;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (theme === 'hearts') {
          drawHeart(ctx, 0, 0, p.size);
        } else if (theme === 'roses') {
          drawRosePetal(ctx, 0, 0, p.size);
        } else if (theme === 'stars') {
          // Glow effect for stars
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          drawStar(ctx, 0, 0, p.size / 2);
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  if (theme === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
