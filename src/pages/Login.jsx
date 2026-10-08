import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginUser } from "../api/authService"; // ajusta la ruta
import { loginWithFace } from "../api/authService";
import Human from "@vladmandic/human";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const [mostrarCamara, setMostrarCamara] = useState(false);
  const [rostroDetectado, setRostroDetectado] = useState(false);
  const [mensajeRostro, setMensajeRostro] = useState("");

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const humanRef = useRef(null);
  const embeddingRef = useRef(null);
  


  useEffect(() => {
  const inicializarHuman = async () => {
    try {
const config = {
  backend: "webgl",

  // Ubicación de los modelos
  modelBasePath: "https://vladmandic.github.io/human-models/models/",

  face: {
    enabled: true,

    detector: {
      rotation: true,
      return: true,
    },

    mesh: {
      enabled: true,
    },

    description: {
      enabled: true,
    },

    // Por ahora no necesitamos estos modelos
    iris: {
      enabled: false,
    },

    emotion: {
      enabled: false,
    },

    age: {
      enabled: false,
    },

    gender: {
      enabled: false,
    },

    antispoof: {
      enabled: true,
    },

    liveness: {
      enabled: true,
    },
  },

  // Desactivamos módulos que no necesitamos
  body: {
    enabled: false,
  },

  hand: {
    enabled: false,
  },

  object: {
    enabled: false,
  },

  gesture: {
    enabled: false,
  },

  segmentation: {
    enabled: false,
  },
};

      const human = new Human(config);

      humanRef.current = human;

      await human.load();
      await human.warmup();

      console.log("Human cargado correctamente");

    } catch (error) {
      console.error("Error cargando Human:", error);
    }
  };

  inicializarHuman();
}, []);


const abrirCamara = async () => {
  try {
    setMensajeRostro("");
    setRostroDetectado(false);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
      },
      audio: false,
    });

    streamRef.current = stream;

    setMostrarCamara(true);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }, 100);

  } catch (error) {
    console.error("Error accediendo a la cámara:", error);
    setMensajeRostro("No se pudo acceder a la cámara.");
  }
};

const detectarRostro = async () => {
  if (!humanRef.current || !videoRef.current) {
    return;
  }

  try {
    const resultado = await humanRef.current.detect(videoRef.current);

    console.log("Resultado Human:", resultado);

    if (resultado.face && resultado.face.length > 0) {
      const rostro = resultado.face[0];

      if (rostro.embedding) {
        embeddingRef.current = Array.from(rostro.embedding);

        console.log(
          "Embedding para login:",
          embeddingRef.current
        );

        setRostroDetectado(true);
        setMensajeRostro("Rostro detectado correctamente.");
      }
    } else {
      embeddingRef.current = null;

      setRostroDetectado(false);
      setMensajeRostro("No se detectó ningún rostro.");
    }

  } catch (error) {
    console.error("Error detectando rostro:", error);
  }
};


const iniciarLoginRostro = async () => {
  if (!embeddingRef.current) {
    setMensajeRostro(
      "Primero coloca tu rostro frente a la cámara."
    );
    return;
  }

  try {
    setMensajeRostro("Verificando rostro...");

    console.log(
      "Enviando embedding al backend:",
      embeddingRef.current
    );

    const response = await loginWithFace(
      embeddingRef.current
    );

    console.log(
      "Respuesta del login facial:",
      response
    );

    const user = response.usuario;

    localStorage.setItem(
      "usuario",
      JSON.stringify(user)
    );

    localStorage.setItem(
      "token",
      response.token
    );

    setMensajeRostro("✓ Rostro reconocido correctamente.");

    // Apagar cámara antes de cambiar de página
    cerrarCamara();

    // Misma navegación que el login normal
    const roleRoutes = {
      "Doctor": "/Medicos/Dashboard_medicos",
      "Clinica/Farmacia": "/Farmacia/dashboard",
      "Paciente": "/dashboard_paciente",
    };

    const route = roleRoutes[user.rol];

    if (route) {
      navigate(route);
    } else {
      navigate("/");
    }

  } catch (err) {

    console.error(
      "Error en login facial:",
      err
    );

    if (err.response) {
      setMensajeRostro(
        err.response.data?.mensaje ||
        "Rostro no reconocido."
      );
    } else {
      setMensajeRostro(
        "No se pudo conectar con el servidor."
      );
    }
  }
};


const cerrarCamara = () => {
  if (streamRef.current) {
    streamRef.current.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;
  }
  embeddingRef.current = null;
  setMostrarCamara(false);
  setRostroDetectado(false);
  setMensajeRostro("");
};


useEffect(() => {
  if (!mostrarCamara) {
    return;
  }

  const intervalo = setInterval(() => {
    detectarRostro();
  }, 1000);

  return () => {
    clearInterval(intervalo);
  };

}, [mostrarCamara]);



  // Usuarios demo
  const demoUsers = [
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
      route: "/dashboard_paciente",
      role: "paciente",
    },
  ];
const handleLogin = async () => {
  try {
    const response = await loginUser({
      correo: email,
      password: password,
    });

    const user = response.usuario;

    console.log(user); // para confirmar

    localStorage.setItem("usuario", JSON.stringify(user));
    localStorage.setItem("token", response.token);

    setError("");

    const roleRoutes = {
      "Doctor": "/Medicos/Dashboard_medicos",
      "Clinica/Farmacia": "/Farmacia/dashboard",
      "Paciente": "/dashboard_paciente",
    };

    const route = roleRoutes[user.rol];

    if (route) {
      navigate(route);
    } else {
      navigate("/");
    }

  } catch (err) {
    // fallback demo
    const savedUsers =
      JSON.parse(localStorage.getItem("registeredUsers")) || [];

    const allUsers = [...demoUsers, ...savedUsers];

    const foundUser = allUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      setError("");
      localStorage.setItem("user", JSON.stringify(foundUser));
      navigate(foundUser.route);
    } else {
      setError("Credenciales incorrectas");
    }
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
              <p style={{ color: "red", marginBottom: "10px" }}>
                {error}
              </p>
            )}

            <button type="submit" className="login-btn">
              Iniciar sesión
            </button>

            <button
              type="button"
              className="login-btn"
              onClick={abrirCamara}
              style={{ marginTop: "10px" }}
              >
              👤 Iniciar con rostro
            </button>

            <p
              className="forgot"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/recuperar")}
            >
              ¿Olvidaste tu contraseña?
            </p>

          </form>

          {/* Usuarios demo */}
          <div style={{ marginTop: "20px", fontSize: "12px", opacity: 0.7 }}>
            <p><strong>Usuarios demo:</strong></p>
            <p>farmacia@demo.com / 123456</p>
            <p>medico@demo.com / 123456</p>
            <p>paciente@demo.com / 123456</p>
          </div>

        </div>
      </div>

              {mostrarCamara && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "15px",
                textAlign: "center",
              }}
            >

              <h3>Reconocimiento facial</h3>

              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: "400px",
                  maxWidth: "90vw",
                  borderRadius: "10px",
                }}
              />

              <p>
                {mensajeRostro || "Coloca tu rostro frente a la cámara"}
              </p>

              {rostroDetectado && (
                <p style={{ color: "green" }}>
                  ✓ Rostro detectado
                </p>
              )}

              <button
                type="button"
                onClick={iniciarLoginRostro}
                className="login-btn"
                disabled={!rostroDetectado}
                style={{ marginBottom: "10px" }}
              >
                🔐 Verificar rostro
              </button>

              <button
                type="button"
                onClick={cerrarCamara}
                className="login-btn"
              >
                Cerrar cámara
              </button>

            </div>
          </div>
        )}
    </div>
  );
}