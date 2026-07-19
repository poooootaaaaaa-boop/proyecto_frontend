import { useRef, useState, useEffect, useCallback } from "react";
import { Eraser, RotateCcw, Check, PenLine } from "lucide-react";

/**
 * FirmaElectronica
 * Componente reutilizable de firma electrónica sobre <canvas>.
 * Funciona con mouse, touch (móvil/tablet) y pantallas táctiles con lápiz.
 *
 * Props:
 * - onGuardar(dataUrl: string): callback que recibe la firma como imagen PNG en base64.
 * - onCambio(vacia: boolean): callback opcional que se dispara cada vez que cambia el trazo.
 * - ancho, alto: dimensiones del lienzo (por defecto 500x200).
 * - colorTrazo: color de la tinta (por defecto un azul tinta).
 * - grosorTrazo: grosor del trazo en px.
 * - etiqueta: texto que aparece arriba del componente.
 * - deshabilitado: si true, bloquea la firma (modo solo lectura).
 *
 * Uso:
 * <FirmaElectronica onGuardar={(dataUrl) => console.log(dataUrl)} />
 */
export default function FirmaElectronica({
  onGuardar,
  onCambio,
  ancho = 500,
  alto = 200,
  colorTrazo = "#1e3a5f",
  grosorTrazo = 2.5,
  etiqueta = "Firme dentro del recuadro",
  deshabilitado = false,
}) {
  const canvasRef = useRef(null);
  const contextoRef = useRef(null);
  const dibujandoRef = useRef(false);
  const trazosRef = useRef([]); // historial de trazos para "deshacer"
  const [vacio, setVacio] = useState(true);
  const [guardado, setGuardado] = useState(false);
  const [factorEscala, setFactorEscala] = useState(1);

  // Configura el canvas considerando la densidad de píxeles (retina/hiDPI)
  useEffect(() => {
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    setFactorEscala(dpr);

    canvas.width = ancho * dpr;
    canvas.height = alto * dpr;
    canvas.style.width = `${ancho}px`;
    canvas.style.height = `${alto}px`;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = colorTrazo;
    ctx.lineWidth = grosorTrazo;
    contextoRef.current = ctx;
  }, [ancho, alto, colorTrazo, grosorTrazo]);

  const obtenerPosicion = useCallback((evento) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const esTouch = evento.touches && evento.touches.length > 0;
    const clienteX = esTouch ? evento.touches[0].clientX : evento.clientX;
    const clienteY = esTouch ? evento.touches[0].clientY : evento.clientY;
    return {
      x: clienteX - rect.left,
      y: clienteY - rect.top,
    };
  }, []);

  const iniciarTrazo = useCallback(
    (evento) => {
      if (deshabilitado) return;
      evento.preventDefault();
      const ctx = contextoRef.current;
      const { x, y } = obtenerPosicion(evento);
      dibujandoRef.current = true;
      ctx.beginPath();
      ctx.moveTo(x, y);
      trazosRef.current.push([{ x, y }]);
    },
    [deshabilitado, obtenerPosicion]
  );

  const continuarTrazo = useCallback(
    (evento) => {
      if (!dibujandoRef.current || deshabilitado) return;
      evento.preventDefault();
      const ctx = contextoRef.current;
      const { x, y } = obtenerPosicion(evento);
      ctx.lineTo(x, y);
      ctx.stroke();
      const trazoActual = trazosRef.current[trazosRef.current.length - 1];
      trazoActual.push({ x, y });

      if (vacio) {
        setVacio(false);
        setGuardado(false);
        onCambio?.(false);
      }
    },
    [deshabilitado, obtenerPosicion, vacio, onCambio]
  );

  const finalizarTrazo = useCallback(() => {
    dibujandoRef.current = false;
  }, []);

  const limpiar = useCallback(() => {
    const ctx = contextoRef.current;
    ctx.clearRect(0, 0, ancho, alto);
    trazosRef.current = [];
    setVacio(true);
    setGuardado(false);
    onCambio?.(true);
  }, [ancho, alto, onCambio]);

  const deshacer = useCallback(() => {
    if (trazosRef.current.length === 0) return;
    trazosRef.current.pop();
    const ctx = contextoRef.current;
    ctx.clearRect(0, 0, ancho, alto);

    trazosRef.current.forEach((trazo) => {
      ctx.beginPath();
      trazo.forEach((punto, indice) => {
        if (indice === 0) ctx.moveTo(punto.x, punto.y);
        else ctx.lineTo(punto.x, punto.y);
      });
      ctx.stroke();
    });

    const quedaVacio = trazosRef.current.length === 0;
    setVacio(quedaVacio);
    setGuardado(false);
    onCambio?.(quedaVacio);
  }, [ancho, alto, onCambio]);

  const guardar = useCallback(() => {
    if (vacio) return;
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    setGuardado(true);
    onGuardar?.(dataUrl);
  }, [vacio, onGuardar]);

  return (
    <div className="inline-flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
          <PenLine size={16} className="text-slate-400" />
          {etiqueta}
        </span>
        {guardado && (
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <Check size={14} />
            Firma guardada
          </span>
        )}
      </div>

      <div
        className={`relative rounded-lg border-2 border-dashed ${
          deshabilitado
            ? "border-slate-200 bg-slate-50"
            : "border-slate-300 bg-slate-50/50"
        }`}
        style={{ width: ancho, height: alto }}
      >
        <canvas
          ref={canvasRef}
          className={`rounded-lg ${
            deshabilitado ? "cursor-not-allowed" : "cursor-crosshair"
          } touch-none`}
          onMouseDown={iniciarTrazo}
          onMouseMove={continuarTrazo}
          onMouseUp={finalizarTrazo}
          onMouseLeave={finalizarTrazo}
          onTouchStart={iniciarTrazo}
          onTouchMove={continuarTrazo}
          onTouchEnd={finalizarTrazo}
        />
        {vacio && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-sm text-slate-300">
              Firme aquí con el mouse o el dedo
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={deshacer}
          disabled={deshabilitado || vacio}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw size={14} />
          Deshacer
        </button>
        <button
          type="button"
          onClick={limpiar}
          disabled={deshabilitado || vacio}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Eraser size={14} />
          Limpiar
        </button>
        <button
          type="button"
          onClick={guardar}
          disabled={deshabilitado || vacio}
          className="ml-auto flex items-center gap-1.5 rounded-lg bg-slate-800 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Check size={14} />
          Guardar firma
        </button>
      </div>
    </div>
  );
}
