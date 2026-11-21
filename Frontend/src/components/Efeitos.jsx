import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function Efeitos() {
  const [tema, setTema] = useState(() => localStorage.getItem('tema') || 'dark');
  const location = useLocation();
  const canvasRef = useRef(null);

  const isLogin = location.pathname === '/' || location.pathname === '/login';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('tema', tema);
  }, [tema]);

  // Efeito de rede conectada (nós + linhas) apenas na tela de Login
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

    // Quantidade de pontos proporcional ao tamanho da tela
    const numPontos = Math.min(Math.floor((width * height) / 14000), 85);
    const pontos = Array.from({ length: numPontos }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.65,
      vy: (Math.random() - 0.5) * 0.65,
      raio: Math.random() * 2 + 1.5,
      branco: Math.random() > 0.65, // Mistura nós azuis e brancos
    }));

    function desenhar() {
      ctx.clearRect(0, 0, width, height);

      // Cores adaptadas ao Modo Noturno ou Claro
      const corAzul = tema === 'dark' ? '56, 189, 248' : '3, 105, 161';
      const corBranca = tema === 'dark' ? '255, 255, 255' : '14, 165, 233';

      for (let i = 0; i < pontos.length; i++) {
        const p1 = pontos[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Rebate suavemente nas bordas da tela
        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Desenha o ponto (nó) com brilho suave
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.raio, 0, Math.PI * 2);
        ctx.fillStyle = p1.branco
          ? `rgba(${corBranca}, 0.85)`
          : `rgba(${corAzul}, 0.85)`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${corAzul}, 0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Conecta pontos próximos com linhas
        for (let j = i + 1; j < pontos.length; j++) {
          const p2 = pontos[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distancia = Math.sqrt(dx * dx + dy * dy);
          const distanciaMax = 145;

          if (distancia < distanciaMax) {
            const opacidade = (1 - distancia / distanciaMax) * 0.45;
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
  }, [isLogin, tema]);

  function alternarTema() {
    setTema((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  return (
    <>
      {isLogin && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}

      <button type="button" onClick={alternarTema} className="theme-toggle-btn">
        {tema === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Noturno'}
      </button>
    </>
  );
}
