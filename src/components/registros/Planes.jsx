import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Dialog,
  Alert,
  Divider,
  CircularProgress,
  IconButton,
} from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CloseIcon from "@mui/icons-material/Close";
import Axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const CLAVE_PLANES = "planes_activos_por_usuario";

import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import "./planes.css";

const stripePromise = loadStripe("pk_test_51R8RUF95m6kbYLsOIfvOI5g81zyuygW0ckS0PlIs8e59WLwa8Yfe4iEBlRZWSlBtDVGG9n8DXSLxAk0jipn9pqg900ljY2BTwR");

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1e293b",
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      "::placeholder": { color: "#94a3b8" },
    },
    invalid: { color: "#d32f2f" },
  },
};

function obtenerUsuarioId() {
  const directo = localStorage.getItem("usuario_id");
  if (directo) return String(directo);

  try {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
    const id = usuario?.id || usuario?.user_id;
    return id != null && id !== "" ? String(id) : null;
  } catch {
    return null;
  }
}

function leerPlanGuardado() {
  const usuarioId = obtenerUsuarioId();
  if (!usuarioId) return null;

  try {
    const mapa = JSON.parse(localStorage.getItem(CLAVE_PLANES) || "{}");
    const planId = mapa[usuarioId];
    return planId != null && planId !== "" ? String(planId) : null;
  } catch {
    return null;
  }
}

function guardarPlanActivo(planId) {
  const usuarioId = obtenerUsuarioId();
  if (!usuarioId || planId == null || planId === "") return;

  let mapa = {};
  try {
    mapa = JSON.parse(localStorage.getItem(CLAVE_PLANES) || "{}");
  } catch {
    mapa = {};
  }

  mapa[usuarioId] = String(planId);
  localStorage.setItem(CLAVE_PLANES, JSON.stringify(mapa));
}

function esPlanGratuito(plan) {
  const nombre = (plan?.nombre || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return Number(plan?.precio) === 0 || nombre.includes("freem");
}

function rutaDashboard() {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
    if (usuario?.rol === "Doctor") return "/Medicos/Dashboard_medicos";
    if (usuario?.rol === "Paciente") return "/Dashboard_paciente";
  } catch {
    /* se usa el inicio de farmacia */
  }

  return "/farmacia/Home";
}

function CheckoutForm({ planId, planNombre, planPrecio, onSuccess, onAlreadyOwned, onProcessingChange }) {
  const stripe = useStripe();
  const elements = useElements();
  const enviandoRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    onProcessingChange?.(loading || paid);
  }, [loading, paid, onProcessingChange]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || paid || loading || enviandoRef.current) return;

    enviandoRef.current = true;
    setLoading(true);
    setErrorMessage("");

    let usuario_id = localStorage.getItem("usuario_id");

    if (!usuario_id) {
      try {
        const usuarioGuardado = JSON.parse(localStorage.getItem("usuario") || "null");
        usuario_id = usuarioGuardado?.id || usuarioGuardado?.user_id;
      } catch (err) {
        console.error("Error al parsear el usuario del localStorage", err);
      }
    }

    if (!usuario_id) {
      setErrorMessage("No se encontró el ID del usuario en la sesión. Vuelve a iniciar sesión.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await Axios.post(`${API_URL}/pago`, {
        usuario_id,
        plan_id: planId,
      });

      const clientSecret = data.clientSecret;

      if (!clientSecret) {
        throw new Error("No se pudo obtener el secreto de pago del servidor.");
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        enviandoRef.current = false;
        setLoading(false);
        setErrorMessage(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setPaid(true);
        setTimeout(() => onSuccess(), 900);
      } else {
        enviandoRef.current = false;
        setLoading(false);
      }
    } catch (error) {
      console.error("Error en el pago:", error);
      enviandoRef.current = false;
      setLoading(false);
      const mensaje = error.response?.data?.error || error.message || "Hubo un error al procesar el pago.";
      if (typeof mensaje === "string" && mensaje.toLowerCase().includes("plan activo")) {
        onAlreadyOwned?.();
      }
      setErrorMessage(mensaje);
    }
  };

  const precioVisible = Number.isFinite(Number(planPrecio))
    ? `$${Number(planPrecio).toFixed(0)} / mes`
    : null;

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, pr: 4, mb: 2.5 }}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: "14px",
            display: "grid",
            placeItems: "center",
            color: "#1565c0",
            background: "linear-gradient(180deg, #e3f2fd, #f4f9ff)",
            border: "1px solid #d7e7fb",
            flexShrink: 0,
          }}
        >
          <CreditCardIcon />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>
            Pago seguro
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            {planNombre ? `Estás contratando ${planNombre}` : "Ingresa los datos de tu tarjeta"}
          </Typography>
        </Box>
      </Box>

      {precioVisible && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2.5,
            px: 1.75,
            py: 1.4,
            borderRadius: "14px",
            background: "#f8fafc",
            border: "1px solid #e8eef5",
          }}
        >
          <Typography variant="body2" sx={{ color: "#475569", fontWeight: 600 }}>
            Total a pagar
          </Typography>
          <Typography sx={{ color: "#1565c0", fontWeight: 800 }}>{precioVisible}</Typography>
        </Box>
      )}

      <Typography variant="body2" sx={{ fontWeight: 700, color: "#334155", mb: 1 }}>
        Datos de la tarjeta
      </Typography>
      <Box
        sx={{
          border: "1px solid #dbe3ee",
          padding: "16px 14px",
          borderRadius: "14px",
          mb: 2,
          background: loading || paid ? "#f8fafc" : "#fff",
          pointerEvents: loading || paid ? "none" : "auto",
          opacity: loading || paid ? 0.7 : 1,
        }}
      >
        <CardElement options={{ ...cardElementOptions, disabled: loading || paid }} />
      </Box>

      {loading && (
        <Alert severity="info" icon={<CircularProgress size={18} />} sx={{ mb: 2, borderRadius: "12px" }}>
          Procesando pago, por favor espera...
        </Alert>
      )}
      {paid && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: "12px" }}>
          Pago exitoso. Tu plan ya está activo.
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: "12px" }}>
          {errorMessage}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={!stripe || loading || paid}
        startIcon={loading ? <CircularProgress size={18} sx={{ color: "inherit" }} /> : null}
        sx={{
          py: 1.45,
          borderRadius: "14px",
          textTransform: "none",
          fontWeight: 800,
          fontSize: "0.98rem",
          lineHeight: 1.35,
          boxShadow: "none",
          background: "linear-gradient(90deg, #1565c0, #42a5f5)",
          "&.Mui-disabled": {
            color: "#fff",
            background: loading || paid ? "#90caf9" : undefined,
          },
        }}
      >
        {paid ? "Pago confirmado" : loading ? "Procesando pago, por favor espera..." : "Pagar ahora"}
      </Button>

      <Divider sx={{ my: 2 }} />
      <Typography variant="caption" sx={{ display: "block", textAlign: "center", color: "#94a3b8", lineHeight: 1.5 }}>
        El cobro lo procesa Stripe. El número de tarjeta no se guarda en ClinicaVital.
      </Typography>
    </form>
  );
}

function Planes() {
  const navigate = useNavigate();
  const [planes, setPlanes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [planActivoId, setPlanActivoId] = useState(null);
  const [procesandoPago, setProcesandoPago] = useState(false);

  useEffect(() => {
    Axios.get(`${API_URL}/Getplanes`)
      .then((response) => {
        setPlanes(response.data || []);
      })
      .catch((error) => {
        console.error("Error cargando planes:", error);
      });
  }, []);

  useEffect(() => {
    if (!planes.length) return;

    const guardado = leerPlanGuardado();
    const planGuardado = planes.find((plan) => String(plan.id) === String(guardado));

    if (planGuardado && !esPlanGratuito(planGuardado)) {
      setPlanActivoId(String(planGuardado.id));
      return;
    }

    setPlanActivoId(null);
  }, [planes]);

  const marcarPlanActivo = (planId) => {
    if (planId == null) return;
    guardarPlanActivo(planId);
    setPlanActivoId(String(planId));
  };

  const planActivo = planes.find((plan) => String(plan.id) === String(planActivoId)) || null;
  const tienePlanDePago = Boolean(planActivo && !esPlanGratuito(planActivo));

  const estaBloqueado = (plan) => {
    if (tienePlanDePago && esPlanGratuito(plan)) return true;
    return tienePlanDePago && String(plan.id) === String(planActivoId);
  };

  const cerrarModal = () => {
    if (procesandoPago) return;
    setOpenModal(false);
  };

  const abrirPasarela = (plan) => {
    if (estaBloqueado(plan) || procesandoPago) return;
    setSelectedPlanId(plan.id);
    setOpenModal(true);
  };

  const descripciones = [
    [
      "Agenda médica y citas.",
      "Hasta 100 pacientes.",
      "Hasta 100 recetas.",
      "Expediente clínico básico.",
    ],
    [
      "Hasta 5,000 pacientes.",
      "Hasta 10,000 recetas.",
      "Expediente clínico completo.",
      "Integración con farmacia.",
      "Recordatorios automáticos.",
      "Gestión de múltiples doctores.",
    ],
    [
      "Portal del paciente.",
      "Historial y seguimiento avanzado.",
      "Autogestión de citas.",
      "Soporte prioritario.",
      "Funciones personalizadas para clínicas.",
    ],
  ];

  const getDescripcion = (plan, index) => {
    const nombre = (plan.nombre || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (nombre.includes("freem")) return descripciones[0];
    if (nombre.includes("pro")) return descripciones[1];
    if (nombre.includes("enterp")) return descripciones[2];

    return descripciones[index] || [];
  };

  const getIcon = (index) => {
    if (index === 0) return <FavoriteIcon fontSize="large" />;
    if (index === 1) return <StarIcon fontSize="large" />;
    return <LocalHospitalIcon fontSize="large" />;
  };

  const planSeleccionado = planes.find((plan) => plan.id === selectedPlanId) || null;

  return (
    <Box className="planes-page">
      <Box className="planes-topbar">
        <Button
          variant="outlined"
          className="back-button"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(rutaDashboard())}
        >
          Regresar
        </Button>
      </Box>

      <Box className="hero-section">
        <MedicalServicesIcon className="hero-logo" />
        <Typography variant="h3" className="hero-title">
          Planes Médicos Inteligentes
        </Typography>
      </Box>

      <Container maxWidth="lg">
        <div className="planes-grid">
          {planes.map((plan, index) => {
            const bloqueado = estaBloqueado(plan);
            const esGratuito = esPlanGratuito(plan);
            const esPlanComprado = bloqueado && !esGratuito;
            const destacado = index === 1 && !bloqueado;

            return (
              <div
                key={plan.id}
                className={`plan-card ${destacado ? "featured" : ""} ${bloqueado ? "is-owned" : ""}`}
              >
                {bloqueado && (
                  <div className={`owned-badge ${esGratuito ? "unavailable" : ""}`}>
                    <LockOutlinedIcon sx={{ fontSize: 14 }} />
                    {esPlanComprado ? "Ya adquirido" : "No disponible"}
                  </div>
                )}
                {destacado && <div className="popular-badge">MÁS POPULAR</div>}
                <div className="plan-icon">{getIcon(index)}</div>
                <h2>{plan.nombre}</h2>
                <div className="price-box">
                  <span className="currency">$</span>
                  <span className="price">{parseFloat(plan.precio).toFixed(0)}</span>
                  <span className="month">/mes</span>
                </div>
                <ul className="features">
                  {getDescripcion(plan, index).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <Button
                  fullWidth
                  className={`buy-button ${bloqueado ? "locked" : ""}`}
                  disabled={bloqueado}
                  startIcon={bloqueado ? <LockOutlinedIcon /> : null}
                  onClick={() => abrirPasarela(plan)}
                >
                  {esPlanComprado ? "Plan activo" : bloqueado ? "No disponible" : "Contratar Plan"}
                </Button>
              </div>
            );
          })}
        </div>
      </Container>

      <Dialog
        open={openModal}
        onClose={cerrarModal}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "22px",
            overflow: "hidden",
            boxShadow: "0 28px 70px rgba(15, 23, 42, 0.22)",
          },
        }}
      >
        <Box
          sx={{
            height: 6,
            background: "linear-gradient(90deg, #1565c0, #42a5f5)",
          }}
        />
        <Box sx={{ position: "relative", p: { xs: 2.5, sm: 3 } }}>
          <IconButton
            aria-label="Cerrar pago"
            onClick={cerrarModal}
            disabled={procesandoPago}
            sx={{ position: "absolute", top: 12, right: 12, color: "#64748b" }}
          >
            <CloseIcon />
          </IconButton>
          <Elements stripe={stripePromise}>
            <CheckoutForm
              planId={selectedPlanId}
              planNombre={planSeleccionado?.nombre}
              planPrecio={planSeleccionado?.precio}
              onProcessingChange={setProcesandoPago}
              onSuccess={() => {
                marcarPlanActivo(selectedPlanId);
                setProcesandoPago(false);
                setOpenModal(false);
              }}
              onAlreadyOwned={() => {
                marcarPlanActivo(selectedPlanId);
                setProcesandoPago(false);
              }}
            />
          </Elements>
        </Box>
      </Dialog>
    </Box>
  );
}

export default Planes;
