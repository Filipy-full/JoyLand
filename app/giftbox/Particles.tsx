"use client"
import { useEffect, useRef } from 'react';

export default function Particles({ type }: { type: 'olive' | 'almond', active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrame: number;
    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = canvas.offsetHeight;
    const colors = type === 'olive' ? ['#a7f3d0', '#6ee7b7', '#10b981', '#facc15'] : ['#fde68a', '#fbbf24', '#f59e42', '#a3e635'];
    const shapes = type === 'olive' ? ['circle','olive'] : ['circle','almond'];
    const particles = Array.from({length: 18}, (_,i) => ({
      x: Math.random()*w,
      y: h+Math.random()*60,
      r: 12+Math.random()*16,
      color: colors[Math.floor(Math.random()*colors.length)],
      shape: shapes[Math.floor(Math.random()*shapes.length)],
      speed: 1+Math.random()*2,
      drift: (Math.random()-0.5)*1.2,
      angle: Math.random()*Math.PI*2,
      spin: (Math.random()-0.5)*0.04
    }));
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0,0,w,h);
      for (const p of particles) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = 0.85;
        if (p.shape==='circle') {
          ctx.beginPath();
          ctx.arc(0,0,p.r,0,Math.PI*2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 18;
          ctx.fill();
        } else if (p.shape==='olive') {
          ctx.beginPath();
          ctx.ellipse(0,0,p.r*0.7,p.r*0.4,0,0,Math.PI*2);
          ctx.fillStyle = '#a3e635';
          ctx.shadowColor = '#a3e635';
          ctx.shadowBlur = 18;
          ctx.fill();
        } else if (p.shape==='almond') {
          ctx.beginPath();
          ctx.ellipse(0,0,p.r*0.7,p.r*0.4,0,0,Math.PI*2);
          ctx.fillStyle = '#fbbf24';
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 18;
          ctx.fill();
        }
        ctx.restore();
        p.y -= p.speed;
        p.x += p.drift;
        p.angle += p.spin;
        if (p.y < -40) {
          p.y = h+Math.random()*60;
          p.x = Math.random()*w;
        }
      }
      animationFrame = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animationFrame);
  }, [type]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{zIndex: 40}} />
  );
}
