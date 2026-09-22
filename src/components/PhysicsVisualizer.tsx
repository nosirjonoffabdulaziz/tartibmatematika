import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { Play, Pause, RotateCcw, Activity, Zap, TrendingUp, Sliders } from 'lucide-react';
import { MathView } from './MathView';

interface PhysicsVisualizerProps {
  lang: Language;
}

export const PhysicsVisualizer: React.FC<PhysicsVisualizerProps> = ({ lang }) => {
  const isUz = lang.startsWith('uz');
  const isRu = lang === 'ru';

  const [simType, setSimType] = useState<'newton' | 'parabola' | 'circuit'>('newton');

  // --- Newton simulation state ---
  const [mass, setMass] = useState<number>(5); // kg
  const [force, setForce] = useState<number>(20); // N
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [cartPos, setCartPos] = useState<number>(50); // px
  const [cartVel, setCartVel] = useState<number>(0); // m/s
  const [simTime, setSimTime] = useState<number>(0); // s

  // --- Parabola state ---
  const [pA, setPA] = useState<number>(1);
  const [pB, setPB] = useState<number>(-5);
  const [pC, setPC] = useState<number>(6);

  // --- Circuit state ---
  const [voltage, setVoltage] = useState<number>(12); // V
  const [resistance, setResistance] = useState<number>(4); // Ohm
  const electronOffsetRef = useRef<number>(0);

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Real-time calculations
  const acceleration = mass > 0 ? force / mass : 0;
  const current = resistance > 0 ? voltage / resistance : 0;
  const power = voltage * current;
  const discriminant = pB * pB - 4 * pA * pC;

  // Handle Newton / Circuit animation loop
  useEffect(() => {
    let lastTs = performance.now();

    const loop = (ts: number) => {
      const dt = Math.min((ts - lastTs) / 1000, 0.05); // seconds
      lastTs = ts;

      const canvas = canvasRef.current;
      if (!canvas) {
        animFrameRef.current = requestAnimationFrame(loop);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, w, h);

      if (simType === 'newton') {
        // --- 1. NEWTON'S 2ND LAW CANVAS ---
        if (isRunning) {
          setSimTime((prev) => prev + dt);
          setCartVel((prev) => prev + acceleration * dt);
          setCartPos((prev) => {
            const next = prev + cartVel * 20 * dt;
            if (next > w - 120) return 50; // wrap around track
            return next;
          });
        }

        // Draw ground / track
        const groundY = h - 60;
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(w, groundY);
        ctx.stroke();

        // Track markings every 40px
        for (let x = 0; x < w; x += 40) {
          ctx.strokeStyle = '#1e293b';
          ctx.beginPath();
          ctx.moveTo(x, groundY);
          ctx.lineTo(x, groundY + 8);
          ctx.stroke();
        }

        // Draw cart
        const cartW = 80;
        const cartH = 40;
        const cartX = cartPos;
        const cartY = groundY - cartH - 12;

        // Cart body
        ctx.fillStyle = '#0284c7';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(cartX, cartY, cartW, cartH, 6);
        ctx.fill();
        ctx.stroke();

        // Cart mass text
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`m = ${mass} kg`, cartX + cartW / 2, cartY + cartH / 2 + 4);

        // Wheels
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        // Front wheel
        ctx.beginPath();
        ctx.arc(cartX + 20, groundY - 6, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Rear wheel
        ctx.beginPath();
        ctx.arc(cartX + cartW - 20, groundY - 6, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Force vector arrow (pointing right from cart front)
        if (force > 0) {
          const arrowLen = Math.min(force * 1.5, 120);
          const startX = cartX + cartW;
          const startY = cartY + cartH / 2;
          const endX = startX + arrowLen;

          ctx.strokeStyle = '#f59e0b';
          ctx.fillStyle = '#f59e0b';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, startY);
          ctx.stroke();

          // Arrowhead
          ctx.beginPath();
          ctx.moveTo(endX, startY);
          ctx.lineTo(endX - 10, startY - 6);
          ctx.lineTo(endX - 10, startY + 6);
          ctx.closePath();
          ctx.fill();

          ctx.font = 'bold 11px sans-serif';
          ctx.fillText(`F = ${force} N`, startX + arrowLen / 2, startY - 8);
        }

        // Acceleration label
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`a = ${acceleration.toFixed(2)} m/s²`, 20, 30);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px monospace';
        ctx.fillText(`v = ${cartVel.toFixed(2)} m/s`, 20, 50);
        ctx.fillText(`t = ${simTime.toFixed(1)} s`, 20, 70);

      } else if (simType === 'parabola') {
        // --- 2. PARABOLA GRAPH ---
        const originX = w / 2;
        const originY = h / 2;
        const scale = 25; // px per unit

        // Grid lines
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += scale) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += scale) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        // Axes
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        // X axis
        ctx.beginPath();
        ctx.moveTo(0, originY);
        ctx.lineTo(w, originY);
        ctx.stroke();
        // Y axis
        ctx.beginPath();
        ctx.moveTo(originX, 0);
        ctx.lineTo(originX, h);
        ctx.stroke();

        // Parabola curve
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        let started = false;

        for (let px = 0; px < w; px += 2) {
          const xVal = (px - originX) / scale;
          const yVal = pA * xVal * xVal + pB * xVal + pC;
          const py = originY - yVal * scale;

          if (py >= -100 && py <= h + 100) {
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else {
              ctx.lineTo(px, py);
            }
          }
        }
        ctx.stroke();

        // Mark Roots if D >= 0
        if (discriminant >= 0 && pA !== 0) {
          const r1 = (-pB + Math.sqrt(discriminant)) / (2 * pA);
          const r2 = (-pB - Math.sqrt(discriminant)) / (2 * pA);

          const px1 = originX + r1 * scale;
          const px2 = originX + r2 * scale;

          // Glowing dot for root 1
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.arc(px1, originY, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillText(`x₁ = ${r1.toFixed(1)}`, px1, originY + 18);

          // Glowing dot for root 2
          ctx.beginPath();
          ctx.arc(px2, originY, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillText(`x₂ = ${r2.toFixed(1)}`, px2, originY + 18);
        }

        // Vertex
        if (pA !== 0) {
          const vx = -pB / (2 * pA);
          const vy = pA * vx * vx + pB * vx + pC;
          const vpx = originX + vx * scale;
          const vpy = originY - vy * scale;

          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(vpx, vpy, 4, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (simType === 'circuit') {
        // --- 3. OHM'S LAW ELECTRIC CIRCUIT ---
        electronOffsetRef.current = (electronOffsetRef.current + current * 40 * dt) % 40;

        const left = 80;
        const right = w - 80;
        const top = 60;
        const bottom = h - 60;

        // Wire rectangle
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(left, top, right - left, bottom - top, 16);
        ctx.stroke();

        // Battery on left side
        const midY = (top + bottom) / 2;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(left - 10, midY - 25, 20, 50);

        // Long plate (+)
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(left - 12, midY - 15);
        ctx.lineTo(left + 12, midY - 15);
        ctx.stroke();

        // Short plate (-)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(left - 7, midY + 15);
        ctx.lineTo(left + 7, midY + 15);
        ctx.stroke();

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`+ ${voltage} V`, left - 25, midY - 15);

        // Resistor on right side
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(right - 15, midY - 30, 30, 60);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.strokeRect(right - 15, midY - 30, 30, 60);

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`R = ${resistance} Ω`, right + 25, midY);

        // Moving electrons (dots) along the wire
        ctx.fillStyle = '#38bdf8';
        const perimeter = 2 * (right - left) + 2 * (bottom - top);
        const numElectrons = 20;

        for (let i = 0; i < numElectrons; i++) {
          const dist = (i * (perimeter / numElectrons) + electronOffsetRef.current) % perimeter;
          let ex = 0;
          let ey = 0;

          if (dist < right - left) {
            ex = left + dist;
            ey = top;
          } else if (dist < right - left + (bottom - top)) {
            ex = right;
            ey = top + (dist - (right - left));
          } else if (dist < 2 * (right - left) + (bottom - top)) {
            ex = right - (dist - (right - left + (bottom - top)));
            ey = bottom;
          } else {
            ex = left;
            ey = bottom - (dist - (2 * (right - left) + (bottom - top)));
          }

          ctx.beginPath();
          ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Lightbulb in top wire
        const midX = (left + right) / 2;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(midX - 20, top - 20, 40, 40);

        // Glow based on power P = UI
        const glowRadius = Math.min(power * 1.5 + 5, 45);
        const gradient = ctx.createRadialGradient(midX, top, 2, midX, top, glowRadius);
        gradient.addColorStop(0, 'rgba(253, 224, 71, 0.9)');
        gradient.addColorStop(0.5, 'rgba(234, 179, 8, 0.4)');
        gradient.addColorStop(1, 'rgba(234, 179, 8, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(midX, top, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(midX, top, 14, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`P = ${power.toFixed(1)} W`, midX, top + 35);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [simType, isRunning, acceleration, cartVel, mass, force, pA, pB, pC, voltage, resistance, current, power, discriminant]);

  const handleResetNewton = () => {
    setCartPos(50);
    setCartVel(0);
    setSimTime(0);
  };

  return (
    <div className="bg-white dark:bg-[#0B1533] border border-blue-100 dark:border-blue-900/60 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5 transition-colors duration-200">
      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 text-[#0056E0] dark:text-yellow-400 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-blue-950 dark:text-white">
              {isUz
                ? 'Interaktiv fizik va matematik simulyator'
                : isRu
                ? 'Интерактивный симулятор физики и математики'
                : 'Interactive Physics & Math Visualizer'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-blue-200">
              {isUz
                ? 'Haqiqiy vaqt rejimida qonuniyatlarni parametrik sinab koʻrish'
                : 'Real-time interactive physical laws and graphical visualizations'}
            </p>
          </div>
        </div>

        {/* Sim mode tabs */}
        <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-[#070D1F] p-1 rounded-xl border border-blue-200 dark:border-blue-900/60">
          <button
            onClick={() => setSimType('newton')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              simType === 'newton'
                ? 'bg-[#0056E0] text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-blue-200 hover:text-blue-950 dark:hover:text-white'
            }`}
          >
            <span>F = ma</span>
          </button>
          <button
            onClick={() => setSimType('circuit')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              simType === 'circuit'
                ? 'bg-[#0056E0] text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-blue-200 hover:text-blue-950 dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span>I = U/R</span>
          </button>
          <button
            onClick={() => setSimType('parabola')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              simType === 'parabola'
                ? 'bg-[#0056E0] text-white font-bold shadow-xs'
                : 'text-slate-600 dark:text-blue-200 hover:text-blue-950 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-yellow-400" />
            <span>ax²+bx+c</span>
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative bg-[#070D1F] border border-blue-200 dark:border-blue-900/80 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={700}
          height={280}
          className="w-full max-w-full h-auto block"
        />

        {/* Newton Play / Reset overlay controls */}
        {simType === 'newton' && (
          <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-[#070D1F]/90 backdrop-blur-sm p-1.5 rounded-xl border border-blue-900/60 shadow-md">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="p-2 rounded-lg bg-blue-950 hover:bg-blue-900 text-yellow-400 transition-colors"
              title={isRunning ? 'Toʻxtatish' : 'Boshlash'}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={handleResetNewton}
              className="p-2 rounded-lg bg-blue-950 hover:bg-blue-900 text-white transition-colors"
              title="Qayta boshlash"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Sliders and Metrics Control Panel */}
      <div className="bg-blue-50/40 dark:bg-[#070D1F]/80 border border-blue-100 dark:border-blue-900/60 rounded-2xl p-4 sm:p-5 space-y-4">
        {simType === 'newton' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Force Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-blue-300">{isUz ? 'Kuch (F)' : 'Force (F)'}</span>
                  <span className="text-yellow-600 dark:text-yellow-400 font-mono">{force} N</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={force}
                  onChange={(e) => setForce(parseFloat(e.target.value))}
                  className="w-full accent-[#0056E0] cursor-pointer"
                />
              </div>

              {/* Mass Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-blue-300">{isUz ? 'Massa (m)' : 'Mass (m)'}</span>
                  <span className="text-[#0056E0] dark:text-blue-300 font-mono">{mass} kg</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={mass}
                  onChange={(e) => setMass(parseFloat(e.target.value))}
                  className="w-full accent-[#0056E0] cursor-pointer"
                />
              </div>
            </div>

            {/* Real-time Math explanation box */}
            <div className="p-3 bg-white dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between text-xs sm:text-sm font-mono shadow-xs">
              <span className="text-slate-600 dark:text-blue-300 font-bold">Formula: a = F / m</span>
              <span className="text-[#0056E0] dark:text-yellow-300 font-bold">
                a = {force} / {mass} = {acceleration.toFixed(2)} m/s²
              </span>
            </div>
          </div>
        )}

        {simType === 'circuit' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Voltage Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-blue-300">{isUz ? 'Kuchlanish (U)' : 'Voltage (U)'}</span>
                  <span className="text-rose-600 dark:text-rose-400 font-mono">{voltage} V</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="36"
                  value={voltage}
                  onChange={(e) => setVoltage(parseFloat(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              {/* Resistance Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600 dark:text-blue-300">{isUz ? 'Qarshilik (R)' : 'Resistance (R)'}</span>
                  <span className="text-yellow-600 dark:text-yellow-400 font-mono">{resistance} Ω</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={resistance}
                  onChange={(e) => setResistance(parseFloat(e.target.value))}
                  className="w-full accent-[#0056E0] cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 bg-white dark:bg-blue-950/80 rounded-xl border border-blue-200 dark:border-blue-800 font-mono shadow-xs">
                <span className="text-[11px] text-slate-500 dark:text-blue-300 font-bold block">{isUz ? 'Tok kuchi' : 'Current'} (I = U/R)</span>
                <span className="text-[#0056E0] dark:text-yellow-300 font-bold text-sm sm:text-base">{current.toFixed(2)} A</span>
              </div>
              <div className="p-2.5 bg-white dark:bg-blue-950/80 rounded-xl border border-blue-200 dark:border-blue-800 font-mono shadow-xs">
                <span className="text-[11px] text-slate-500 dark:text-blue-300 font-bold block">{isUz ? 'Quvvat' : 'Power'} (P = U·I)</span>
                <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm sm:text-base">{power.toFixed(1)} W</span>
              </div>
            </div>
          </div>
        )}

        {simType === 'parabola' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-600 dark:text-blue-300 font-bold block mb-1">Koeffitsiyent a</label>
                <input
                  type="number"
                  step="0.5"
                  value={pA}
                  onChange={(e) => setPA(parseFloat(e.target.value) || 1)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-[#0056E0] dark:text-yellow-300 font-mono font-bold shadow-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-blue-300 font-bold block mb-1">Koeffitsiyent b</label>
                <input
                  type="number"
                  step="0.5"
                  value={pB}
                  onChange={(e) => setPB(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-[#0056E0] dark:text-yellow-300 font-mono font-bold shadow-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 dark:text-blue-300 font-bold block mb-1">Koeffitsiyent c</label>
                <input
                  type="number"
                  step="0.5"
                  value={pC}
                  onChange={(e) => setPC(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-[#0056E0] dark:text-yellow-300 font-mono font-bold shadow-xs"
                />
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between text-xs sm:text-sm font-mono shadow-xs">
              <span className="text-slate-600 dark:text-blue-300 font-bold">D = b² - 4ac:</span>
              <span className={`font-bold ${discriminant >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                D = {discriminant.toFixed(2)} ({discriminant > 0 ? (isUz ? '2 ta haqiqiy ildiz' : '2 real roots') : discriminant === 0 ? (isUz ? '1 ta karrali ildiz' : '1 double root') : (isUz ? 'Haqiqiy ildiz yoʻq' : 'No real roots')})
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
