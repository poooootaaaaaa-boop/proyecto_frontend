import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container
} from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import Axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

import "./planes.css";

const stripePromise = loadStripe("pk_test_TU_CLAVE_PUBLICA");

function Planes() {
  const [planes, setPlanes] = useState([]);

  useEffect(() => {
    Axios.get("http://127.0.0.1:8000/api/Getplanes")
      .then((response) => {
        setPlanes(response.data || []);
      })
      .catch((error) => {
        console.error("Error cargando planes:", error);
      });
  }, []);

  const comprarPlan = (plan_id) => {
    const usuario_id = localStorage.getItem("usuario_id");

    Axios.post("http://127.0.0.1:8000/api/stripe-session", {
      usuario_id,
      plan_id,
    })
      .then(async (response) => {
        const stripe = await stripePromise;

        stripe.redirectToCheckout({
          sessionId: response.data.id,
        });
      })
      .catch((error) => {
        console.error("Error al pagar:", error);
      });
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

  <Typography
    variant="body1"
    className="hero-subtitle"
  >
    Cuida tu salud y la de tu familia con cobertura médica moderna,
    consultas rápidas y atención especializada.
  </Typography>
</Box>

      <Container maxWidth="lg">
        <div className="planes-grid">

          {planes.map((plan, index) => (
            <div
              key={plan.id}
              className={`plan-card ${
                index === 1 ? "featured" : ""
              }`}
            >
              {index === 1 && (
                <div className="popular-badge">
                  MÁS POPULAR
                </div>
              )}

              <div className="plan-icon">
                {getIcon(index)}
              </div>

              <h2>{plan.nombre}</h2>

              <p className="plan-description">
                Cobertura médica integral para proteger tu bienestar.
              </p>

              <div className="price-box">
                <span className="currency">$</span>
                <span className="price">
                  {parseFloat(plan.precio).toFixed(0)}
                </span>
                <span className="month">/mes</span>
              </div>

              <ul className="features">
                <li>✔ Consultas ilimitadas</li>
                <li>✔ Atención prioritaria</li>
                <li>✔ Historial médico digital</li>

                <li
                  className={
                    index === 0 ? "disabled" : ""
                  }
                >
                  {index === 0
                    ? "✖ Especialistas"
                    : "✔ Especialistas"}
                </li>

                <li
                  className={
                    index < 2 ? "disabled" : ""
                  }
                >
                  {index < 2
                    ? "✖ Ambulancia"
                    : "✔ Ambulancia"}
                </li>
              </ul>

              <Button
                fullWidth
                className="buy-button"
                onClick={() => comprarPlan(plan.id)}
              >
                Contratar Plan
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </Box>
  );
}

export default Planes;