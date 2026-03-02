import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //  Usuarios demo
  const users = [
    {
      email: "farmacia@demo.com",
      password: "123456",
      route: "/Farmacia/dashboard",
      role: "farmacia",
    },
    {
      email: "medico@demo.com",
      password: "123456",
      route: "/Medicos/Dashboard_medicos",
      role: "medico",
    },
    {
      email: "paciente@demo.com",
      password: "123456",
      route: "/",
      role: "paciente",
    },
  ];

  const handleLogin = () => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      setError("");

      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(foundUser));

      navigate(foundUser.route);
    } else {
      setError("Credenciales incorrectas");
    }
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
            La salud de tus <br />
            pacientes en las <br />
            mejores manos.
          </h1>

          <p>
            Gestiona historias clínicas, citas y diagnósticos con nuestra
            plataforma líder en el sector médico.
          </p>
        </div>
      </div>

      {/* LADO DERECHO */}
      <div className="login-right">
        <div className="login-card">
          <h2>Bienvenido a Cliniconnect</h2>
          <p>Ingresa tus credenciales para acceder a la plataforma.</p>

          <form
            className="login-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="input-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
            )}

            <button type="submit" className="login-btn">
              Iniciar sesión
            </button>

            <a href="#" className="forgot">
              ¿Olvidaste tu contraseña?
            </a>
          </form>

          {/*  Usuarios demo visibles */}
          <div style={{ marginTop: "20px", fontSize: "12px", opacity: 0.7 }}>
            <p><strong>Usuarios demo:</strong></p>
            <p>farmacia@demo.com / 123456</p>
            <p>medico@demo.com / 123456</p>
            <p>paciente@demo.com / 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}