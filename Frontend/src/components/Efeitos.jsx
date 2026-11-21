import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function Efeitos() {
  const location = useLocation();
  const canvasRef = useRef(null);

  const isLogin = location.pathname === '/' || location.pathname === '/login';

  useEffect(() => {
    const temaSalvo = localStorage.getItem('tema') || 'dark';
    document.documentElement.setAttribute('data-theme', temaSalvo);
  }, []);

  useEffect(() => {
    if (!isLogin) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const numPontos = Math.min(Math.floor((width * height) / 14000), 85);
    const pontos = Array.from({ length: numPontos }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.65,
      vy: (Math.random() - 0.5) * 0.65,
      raio: Math.random() * 2 + 1.5,
      branco: Math.random() > 0.65,
    }));

    function desenhar() {
      ctx.clearRect(0, 0, width, height);
      const temaAtual = document.documentElement.getAttribute('data-theme') || 'dark';
      const corAzul = temaAtual === 'dark' ? '56, 189, 248' : '3, 105, 161';
      const corBranca = temaAtual === 'dark' ? '255, 255, 255' : '14, 165, 233';

      for (let i = 0; i < pontos.length; i++) {
        const p1 = pontos[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.raio, 0, Math.PI * 2);
        ctx.fillStyle = p1.branco ? `rgba(${corBranca}, 0.85)` : `rgba(${corAzul}, 0.85)`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${corAzul}, 0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = i + 1; j < pontos.length; j++) {
          const p2 = pontos[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distancia = Math.sqrt(dx * dx + dy * dy);

          if (distancia < 145) {
            const opacidade = (1 - distancia / 145) * 0.45;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${corAzul}, ${opacidade})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(desenhar);
    }

    desenhar();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isLogin]);

  if (!isLogin) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
