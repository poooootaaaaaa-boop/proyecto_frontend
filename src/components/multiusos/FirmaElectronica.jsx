import { useRef, useState, useEffect, useCallback } from "react";
import { Eraser, RotateCcw, Check, PenLine, Loader2 } from "lucide-react";
import "./FirmaElectronica.css";

/**
 * FirmaElectronica
 * Lienzo de firma para mouse, dedo y lápiz (Pointer Events).
 *
 * Mejoras respecto a la versión anterior:
 * - Se adapta al ancho del contenedor (antes tenía 500 px fijos y se salía en móvil).
 * - Trazo suavizado con curvas; los trazos se guardan normalizados, así que
 *   sobreviven a cambios de tamaño de pantalla o rotación del dispositivo.
 * - Exporta un PNG transparente recortado al contorno de la firma, en alta resolución.
 *   Así entra bien en el recuadro del PDF sin bordes vacíos.
 * - Rechaza firmas vacías o demasiado cortas (un punto o una raya).
 * - Ya no depende de Tailwind: usa FirmaElectronica.css.
 *
 * Props (las anteriores siguen funcionando):
 * - onGuardar(dataUrl)  → PNG en base64 (data URL).
 * - onCambio(vacia)     → se llama cuando el lienzo pasa de vacío a con trazo y al revés.
 * - ancho, alto         → proporción y tamaño máximo del lienzo (500x200 por defecto).
 * - colorTrazo, grosorTrazo
 * - etiqueta            → texto de la cabecera.
 * - textoGuardar        → texto del botón principal.
 * - guardando           → muestra un spinner y bloquea el componente mientras se envía.
 * - deshabilitado       → modo solo lectura.
 */
export default function FirmaElectronica({
  onGuardar,
  onCambio,
  ancho = 500,
  alto = 200,
  colorTrazo = "#0e2a3b",
  grosorTrazo = 2.4,
  etiqueta = "Firme dentro del recuadro",
  textoGuardar = "Guardar firma",
  guardando = false,
  deshabilitado = false,
}) {
  const contenedorRef = useRef(null);
  const canvasRef = useRef(null);
  const trazosRef = useRef([]); // [[{x,y}, ...], ...] con x,y normalizados (0..1)
  const dibujandoRef = useRef(false);
  const tamanoRef = useRef({ w: ancho, h: alto });

  const [vacio, setVacio] = useState(true);
  const [guardado, setGuardado] = useState(false);
  const [aviso, setAviso] = useState("");

  const bloqueado = deshabilitado || guardando;

  // ---- Dibujo ----------------------------------------------------------
  const pintarTrazo = useCallback(
    (ctx, trazo, w, h, grosor) => {
      ctx.strokeStyle = colorTrazo;
      ctx.fillStyle = colorTrazo;
      ctx.lineWidth = grosor;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const p = trazo.map((pt) => ({ x: pt.x * w, y: pt.y * h }));
      ctx.beginPath();
      if (p.length === 1) {
        ctx.arc(p[0].x, p[0].y, grosor / 2, 0, Math.PI * 2);
        ctx.fill();
        return;
      }
      ctx.moveTo(p[0].x, p[0].y);
      for (let i = 1; i < p.length - 1; i++) {
        const mx = (p[i].x + p[i + 1].x) / 2;
        const my = (p[i].y + p[i + 1].y) / 2;
        ctx.quadraticCurveTo(p[i].x, p[i].y, mx, my);
      }
      ctx.lineTo(p[p.length - 1].x, p[p.length - 1].y);
      ctx.stroke();
    },
    [colorTrazo]
  );

  const redibujar = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { w, h } = tamanoRef.current;
    const dpr = window.devicePixelRatio || 1;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const grosor = grosorTrazo * (w / ancho);
    trazosRef.current.forEach((t) => pintarTrazo(ctx, t, w, h, grosor));
  }, [ancho, grosorTrazo, pintarTrazo]);

  // ---- Ajuste al ancho del contenedor ------------------------------------
  useEffect(() => {
    const contenedor = contenedorRef.current;
    const canvas = canvasRef.current;
    if (!contenedor || !canvas) return undefined;

    const ajustar = () => {
      const w = Math.max(200, Math.min(ancho, Math.floor(contenedor.clientWidth)));
      const h = Math.round((w * alto) / ancho);
      const dpr = window.devicePixelRatio || 1;
      tamanoRef.current = { w, h };
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      redibujar();
    };

    ajustar();
    const observador = new ResizeObserver(ajustar);
    observador.observe(contenedor);
    return () => observador.disconnect();
  }, [ancho, alto, redibujar]);

  // ---- Eventos del puntero -----------------------------------------------
  const posicion = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)),
    };
  };

  const alPresionar = (e) => {
    if (bloqueado) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dibujandoRef.current = true;
    trazosRef.current.push([posicion(e)]);
    setAviso("");
    redibujar();
  };

  const alMover = (e) => {
    if (!dibujandoRef.current || bloqueado) return;
    e.preventDefault();
    const trazo = trazosRef.current[trazosRef.current.length - 1];
    trazo.push(posicion(e));
    redibujar();
    if (vacio) {
      setVacio(false);
      setGuardado(false);
      onCambio?.(false);
    }
  };

  const alSoltar = (e) => {
    if (!dibujandoRef.current) return;
    dibujandoRef.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    // Un toque sin movimiento también cuenta como trazo (punto).
    if (vacio && trazosRef.current.length > 0) {
      setVacio(false);
      setGuardado(false);
      onCambio?.(false);
    }
  };

  // ---- Acciones ------------------------------------------------------------
  const limpiar = () => {
    trazosRef.current = [];
    setVacio(true);
    setGuardado(false);
    setAviso("");
    redibujar();
    onCambio?.(true);
  };

  const deshacer = () => {
    if (trazosRef.current.length === 0) return;
    trazosRef.current.pop();
    const queda = trazosRef.current.length === 0;
    setVacio(queda);
    setGuardado(false);
    setAviso("");
    redibujar();
    onCambio?.(queda);
  };

  /** PNG transparente, recortado al contorno de la firma y a 3x de resolución. */
  const exportarPng = () => {
    const escala = 3;
    const W = ancho;
    const H = alto;
    const puntos = trazosRef.current.flat();

    const xs = puntos.map((p) => p.x * W);
    const ys = puntos.map((p) => p.y * H);
    const margen = 10;
    const minX = Math.max(0, Math.min(...xs) - margen);
    const minY = Math.max(0, Math.min(...ys) - margen);
    const maxX = Math.min(W, Math.max(...xs) + margen);
    const maxY = Math.min(H, Math.max(...ys) + margen);
    const cw = maxX - minX;
    const ch = maxY - minY;

    // Evita guardar un simple punto o una raya diminuta.
    if (puntos.length < 8 || cw + ch < 40) return null;

    const salida = document.createElement("canvas");
    salida.width = Math.round(cw * escala);
    salida.height = Math.round(ch * escala);
    const ctx = salida.getContext("2d");
    ctx.scale(escala, escala);
    ctx.translate(-minX, -minY);
    trazosRef.current.forEach((t) => pintarTrazo(ctx, t, W, H, grosorTrazo));
    return salida.toDataURL("image/png");
  };

  const guardar = () => {
    if (vacio || bloqueado) return;
    const dataUrl = exportarPng();
    if (!dataUrl) {
      setAviso("La firma es muy corta. Dibuja tu firma completa dentro del recuadro.");
      return;
    }
    setAviso("");
    setGuardado(true);
    onGuardar?.(dataUrl);
  };

  return (
    <div className="firma" ref={contenedorRef}>
      <div className="firma-cabecera">
        <span className="firma-etiqueta">
          <PenLine size={15} />
          {etiqueta}
        </span>
        {guardado && !guardando && (
          <span className="firma-ok">
            <Check size={14} />
            Firma lista
          </span>
        )}
      </div>

      <div className={`firma-lienzo ${bloqueado ? "is-bloqueado" : ""}`}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Área para dibujar la firma"
          onPointerDown={alPresionar}
          onPointerMove={alMover}
          onPointerUp={alSoltar}
          onPointerCancel={alSoltar}
        />
        {vacio && <span className="firma-guia">Firma aquí con el mouse, el dedo o un lápiz</span>}
        <span className="firma-linea-base" aria-hidden="true" />
      </div>

      {aviso && (
        <p className="firma-aviso" role="alert">
          {aviso}
        </p>
      )}

      <div className="firma-acciones">
        <button type="button" onClick={deshacer} disabled={bloqueado || vacio} className="firma-btn">
          <RotateCcw size={14} />
          Deshacer
        </button>
        <button type="button" onClick={limpiar} disabled={bloqueado || vacio} className="firma-btn">
          <Eraser size={14} />
          Limpiar
        </button>
        <button
          type="button"
          onClick={guardar}
          disabled={bloqueado || vacio}
          className="firma-btn firma-btn-principal"
        >
          {guardando ? <Loader2 size={14} className="firma-giro" /> : <Check size={14} />}
          {guardando ? "Guardando..." : textoGuardar}
        </button>
      </div>
    </div>
  );
}