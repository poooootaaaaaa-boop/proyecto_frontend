import { useEffect, useState } from "react";
import { Box, Typography, Button, Container, Modal } from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import Axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import "./planes.css";

const stripePromise = loadStripe("pk_test_51R8RUF95m6kbYLsOIfvOI5g81zyuygW0ckS0PlIs8e59WLwa8Yfe4iEBlRZWSlBtDVGG9n8DXSLxAk0jipn9pqg900ljY2BTwR");

function CheckoutForm({ planId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

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
      // 1. Pedimos al backend de Laravel que cree el PaymentIntent y devuelva el clientSecret
      const { data } = await Axios.post(`${API_URL}/pago`, {
        usuario_id,
        plan_id: planId,
      });

      const clientSecret = data.clientSecret;

      if (!clientSecret) {
        throw new Error("No se pudo obtener el secreto de pago del servidor.");
      }

      // 2. Confirmamos el pago en el cliente usando Stripe Elements
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          alert("¡Pago exitoso!");
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error en el pago:", error);
      setErrorMessage(error.response?.data?.error || error.message || "Hubo un error al procesar el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px", background: "#fff", borderRadius: "8px" }}>
      <Typography variant="h6" gutterBottom>Ingresa los datos de tu tarjeta</Typography>
      <Box sx={{ border: "1px solid #ccc", padding: "15px", borderRadius: "4px", mb: 2 }}>
        <CardElement />
      </Box>
      {errorMessage && <Typography color="error" variant="body2" sx={{ mb: 2 }}>{errorMessage}</Typography>}
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={!stripe || loading}>
        {loading ? "Procesando..." : "Pagar Ahora"}
      </Button>
    </form>
  );
}

function Planes() {
  const [planes, setPlanes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  useEffect(() => {
    Axios.get(`${API_URL}/Getplanes`)
      .then((response) => {
        setPlanes(response.data || []);
      })
      .catch((error) => {
        console.error("Error cargando planes:", error);
      });
  }, []);

  const abrirPasarela = (plan_id) => {
    setSelectedPlanId(plan_id);
    setOpenModal(true);
  };

  const getIcon = (index) => {
    if (index === 0) return <FavoriteIcon fontSize="large" />;
    if (index === 1) return <StarIcon fontSize="large" />;
    return <LocalHospitalIcon fontSize="large" />;
  };

  return (
    <Box className="planes-page">
      <Box className="hero-section">
        <MedicalServicesIcon className="hero-logo" />
        <Typography variant="h3" className="hero-title">
          Planes Médicos Inteligentes
        </Typography>
      </Box>

      <Container maxWidth="lg">
        <div className="planes-grid">
          {planes.map((plan, index) => (
            <div key={plan.id} className={`plan-card ${index === 1 ? "featured" : ""}`}>
              {index === 1 && <div className="popular-badge">MÁS POPULAR</div>}
              <div className="plan-icon">{getIcon(index)}</div>
              <h2>{plan.nombre}</h2>
              <p className="plan-description">Protección médica para ti y tu familia.</p>
              <div className="price-box">
                <span className="currency">$</span>
                <span className="price">{parseFloat(plan.precio).toFixed(0)}</span>
                <span className="month">/mes</span>
              </div>
              <Button
                fullWidth
                className="buy-button"
                onClick={() => abrirPasarela(plan.id)}
              >
                Contratar Plan
              </Button>
            </div>
          ))}
        </div>
      </Container>

      {/* Modal de pago */}
      <Modal open={openModal} onClose={() => setOpenModal(false)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: 400, bgcolor: 'background.paper', p: 2, borderRadius: 2, outline: 'none' }}>
          <Elements stripe={stripePromise}>
            <CheckoutForm planId={selectedPlanId} onSuccess={() => setOpenModal(false)} />
          </Elements>
        </Box>
      </Modal>
    </Box>
  );
}

export default Planes;