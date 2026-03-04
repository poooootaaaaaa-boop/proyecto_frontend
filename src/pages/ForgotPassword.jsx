import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // reutilizamos el mismo CSS

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRecover = (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Por favor ingresa tu correo electrónico");
      return;
    }

    // Simulación de envío
    setMessage(
      "Si el correo existe en nuestra base de datos, recibirás un enlace para restablecer tu contraseña."
    );
  };

  return (
    <div className="login-container">
      {/* LADO IZQUIERDO (IGUAL QUE LOGIN) */}
      <div className="login-left">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9LBrMbSEzUiVz1ArBBeFjQg7XWhzfTOdmvGXmOiQTx0-K4wFOgwd87pwu991r6Zca-nz_UsA_Y_6r1jg5a6sP4P-_8W9U9TO5LHGmfkqCJqyTH2CvJGV17Ds3oVX0BQeLufx47uVkWHg4LTXNN3DcemfCmvetV4bSkqoVVDNfZxUcm9SqXaNto0bh7c01-MQh2bikvr1gSMrvCkSM7BgHzSzr_OiQ_dCZCnLlyKGxpmPbNIk3uuXzkbavzui2o1U4Fj2HXU3ypWsP"
          alt="Interior clínica"
          className="login-bg"
        />
        <div className="overlay"></div>

        <div className="login-left-content">
          <div className="brand">
            <span className="material-symbols-outlined">
              medical_services
            </span>
            <h2>ClinicaVital</h2>
          </div>

          <h1>
            Recupera el acceso <br />
            a tu cuenta de forma <br />
            segura.
          </h1>

          <p>
            Te enviaremos un enlace para que puedas restablecer tu contraseña
            rápidamente.
          </p>
        </div>
      </div>

      {/* LADO DERECHO */}
      <div className="login-right">
        <div className="login-card">
          <h2>Recuperar contraseña</h2>
          <p>Ingresa tu correo electrónico para continuar.</p>

          <form className="login-form" onSubmit={handleRecover}>
            <div className="input-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {message && (
              <p style={{ marginBottom: "10px", color: "#2563eb" }}>
                {message}
              </p>
            )}

            <button type="submit" className="login-btn">
              Enviar enlace
            </button>

            <p
              className="forgot"
              style={{ cursor: "pointer", marginTop: "15px" }}
              onClick={() => navigate("/login")}
            >
              ← Volver al inicio de sesión
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}