import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Avatar,
  IconButton
} from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import Axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import "./planes.css";
const stripePromise = loadStripe("pk_test_TU_CLAVE_PUBLICA");

function Planes() {
    const [darkMode, setDarkMode] = useState(false);
    const [planes, setPlanes] = useState([]);

    useEffect(() => {

        Axios.get("http://127.0.0.1:8000/api/Getplanes")
            .then((response) => {

                const data = response.data || [];
                setPlanes(data);

            })
            .catch((error) => {
                console.error("Error cargando planes:", error);
            });

    }, []);

    const comprarPlan = (plan_id) => {

        const usuario_id = localStorage.getItem("usuario_id");
        //localStorage.setItem("users", JSON.stringify(users));

        Axios.post("http://127.0.0.1:8000/api/stripe-session", {
            usuario_id: usuario_id,
            plan_id: plan_id
        })
        .then(async (response) => {

            const stripe = await stripePromise;

            stripe.redirectToCheckout({
                sessionId: response.data.id
            });

        })
        .catch((error) => {
            console.error("Error al pagar:", error);
        });
    };

    return (

        <Box className={`clinic-container ${darkMode ? "dark" : ""}`}>

      {/* Header */}
      <Box className="clinic-header">
        <MedicalServicesIcon className="header-icon" />
        <Typography variant="h6" className="header-title">
          ClinicaVital
        </Typography>
      </Box>

        <div className="planes-container">
    <h1 className="planes-title">Selecciona un plan</h1>
        <p className="planes-subtitle">
        Selecciona la cobertura que mejor se adapte a tus necesidades y las de tu familia. 
        Comienza tu camino hacia el bienestar con el respaldo de ClinicaVital.
    </p>

    <div className="planes-grid">
        {planes.map((plan) => (
            <div 
                key={plan.id} 
                className="plan-card"
            >
                <div className="plan-header">
                    <div className="plan-icon">💊</div>

                    <h2 className="plan-name">{plan.nombre}</h2>
                    <p className="plan-desc">
                        Cobertura médica pensada para ti
                    </p>
                </div>

                <div className="plan-price-container">
                    <span className="plan-price">${plan.precio}</span>
                    <span className="plan-period">/mes</span>
                </div>

                <ul className="plan-features">
                    <li>✔ Consultas generales</li>
                    <li>✔ Atención básica</li>
                    <li className="disabled">✖ Especialistas</li>
                </ul>

                <button 
                    className="plan-button"
                    onClick={() => comprarPlan(plan.id)}
                >
                    Comprar
                </button>
            </div>
        ))}
    </div>
</div>
 </Box> 
    );
}

export default Planes;