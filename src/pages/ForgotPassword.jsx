import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1 buscar correo | 2 cambiar contraseña
  const [message, setMessage] = useState("");

  const handleRecover = (e) => {
    e.preventDefault();

    const users =
      JSON.parse(localStorage.getItem("registeredUsers")) || [];

    const userExists = users.find((u) => u.email === email);

    if (!userExists) {
      setMessage("Este correo no está registrado.");
      return;
    }

    setMessage("");
    setStep(2);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setMessage("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }

    let users =
      JSON.parse(localStorage.getItem("registeredUsers")) || [];

    users = users.map((u) =>
      u.email === email ? { ...u, password: newPassword } : u
    );

    localStorage.setItem("registeredUsers", JSON.stringify(users));

    setMessage("Contraseña actualizada correctamente");

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="login-container">

      {/* LADO IZQUIERDO */}
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
            Restablece tu contraseña para volver a ingresar a la plataforma.
          </p>
        </div>
      </div>

      {/* LADO DERECHO */}
      <div className="login-right">
        <div className="login-card">
          <h2>Recuperar contraseña</h2>

          {step === 1 && (
            <>
              <p>Ingresa tu correo electrónico.</p>

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
                  <p style={{ color: "red", marginBottom: "10px" }}>
                    {message}
                  </p>
                )}

                <button type="submit" className="login-btn">
                  Continuar
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <p>Escribe tu nueva contraseña.</p>

              <form className="login-form" onSubmit={handleResetPassword}>
                <div className="input-group">
                  <label>Nueva contraseña</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                {message && (
                  <p style={{ color: "#2563eb", marginBottom: "10px" }}>
                    {message}
                  </p>
                )}

                <button type="submit" className="login-btn">
                  Cambiar contraseña
                </button>
              </form>
            </>
          )}

          <p
            className="forgot"
            style={{ cursor: "pointer", marginTop: "15px" }}
            onClick={() => navigate("/login")}
          >
            ← Volver al inicio de sesión
          </p>
        </div>
      </div>

    </div>
  );
}