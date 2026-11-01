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
  const [estadoFaceId, setEstadoFaceId] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const humanRef = useRef(null);
  const embeddingRef = useRef(null);
  const verificandoRef = useRef(false);


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
  if (!humanRef.current || !videoRef.current || verificandoRef.current) {
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

        // Iniciar verificación y animación automáticamente sin presionar botón
        if (!verificandoRef.current) {
          verificandoRef.current = true;
          iniciarLoginRostro(embeddingRef.current);
        }
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


const iniciarLoginRostro = async (embeddingDirecto) => {
  const embeddingAUsar = embeddingDirecto || embeddingRef.current;
  if (!embeddingAUsar) {
    verificandoRef.current = false;
    setMensajeRostro(
      "Primero coloca tu rostro frente a la cámara."
    );
    return;
  }

  verificandoRef.current = true;

  try {
    setEstadoFaceId("loading");
    setMensajeRostro("Verificando rostro...");

    console.log(
      "Enviando embedding al backend:",
      embeddingAUsar
    );

    const response = await loginWithFace(
      embeddingAUsar
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
    setEstadoFaceId("success");

    // Esperar a que se aprecie la animación verde de Face ID
    await new Promise((resolve) => setTimeout(resolve, 1400));

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
    const errorMsg =
      err.response?.data?.mensaje ||
      (err.response
        ? "Rostro no reconocido."
        : "No se pudo conectar con el servidor.");

    setMensajeRostro(errorMsg);
    setEstadoFaceId("error");

    console.error(
      "Error en login facial:",
      err
    );

    // Permitir ver animación de fallo antes de reintentar
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setEstadoFaceId(null);
    verificandoRef.current = false;
  }
};


const cerrarCamara = () => {
  verificandoRef.current = false;
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
  setEstadoFaceId(null);
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
          <div className="camera-modal-backdrop">
            <div className="camera-modal-card">
              {estadoFaceId && (
                <div className="faceid-overlay">
                  <div className="faceid-card">
                    {estadoFaceId === "loading" && (
                      <>
                        <div className="faceid-icon-container">
                          <div className="faceid-pulse-ring"></div>
                          <div className="faceid-scanner-laser"></div>
                          <svg viewBox="0 0 100 100" className="faceid-svg">
                            <path d="M 22 36 V 26 A 12 12 0 0 1 34 14 H 44" fill="none" stroke="#30d158" strokeWidth="5.5" strokeLinecap="round" />
                            <path d="M 56 14 H 66 A 12 12 0 0 1 78 26 V 36" fill="none" stroke="#30d158" strokeWidth="5.5" strokeLinecap="round" />
                            <path d="M 78 64 V 74 A 12 12 0 0 1 66 86 H 56" fill="none" stroke="#30d158" strokeWidth="5.5" strokeLinecap="round" />
                            <path d="M 44 86 H 34 A 12 12 0 0 1 22 74 V 64" fill="none" stroke="#30d158" strokeWidth="5.5" strokeLinecap="round" />
                            <circle cx="37" cy="42" r="4.5" fill="#30d158" />
                            <circle cx="63" cy="42" r="4.5" fill="#30d158" />
                            <path d="M 50 42 V 55 A 4 4 0 0 1 46 59 H 45" fill="none" stroke="#30d158" strokeWidth="4.5" strokeLinecap="round" />
                            <path d="M 37 68 Q 50 78 63 68" fill="none" stroke="#30d158" strokeWidth="5" strokeLinecap="round" />
                          </svg>
                        </div>
                        <h3 className="faceid-title">Face ID</h3>
                        <p className="faceid-subtitle">Verificando rostro...</p>
                        <div className="faceid-bar-loader">
                          <div className="faceid-bar-fill"></div>
                        </div>
                      </>
                    )}

                    {estadoFaceId === "success" && (
                      <>
                        <div className="faceid-success-circle">
                          <svg viewBox="0 0 60 60" className="faceid-check-svg">
                            <path
                              d="M 16 31 L 26 41 L 44 20"
                              fill="none"
                              stroke="#30d158"
                              strokeWidth="5.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="faceid-check-path"
                            />
                          </svg>
                        </div>
                        <h3 className="faceid-title">Face ID</h3>
                        <p className="faceid-subtitle" style={{ color: "#30d158", fontWeight: "600", marginTop: "4px" }}>
                          Inicio de sesión exitoso
                        </p>
                      </>
                    )}

                    {estadoFaceId === "error" && (
                      <>
                        <div className="faceid-error-circle">
                          <svg viewBox="0 0 50 50" className="faceid-error-svg">
                            <path
                              d="M 15 15 L 35 35 M 35 15 L 15 35"
                              fill="none"
                              stroke="#ef4444"
                              strokeWidth="5"
                              strokeLinecap="round"
                              className="faceid-error-path"
                            />
                          </svg>
                        </div>
                        <h3 className="faceid-title">Face ID</h3>
                        <p className="faceid-subtitle" style={{ color: "#ef4444", fontWeight: "600", marginTop: "4px" }}>
                          Inicio de sesión fallido
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="camera-modal-header">
                <div className="camera-modal-title-group">
                  <h3 className="camera-modal-title">
                    <span className="material-symbols-outlined" style={{ fontSize: "22px", color: "#0047cc" }}>
                      face
                    </span>
                    Reconocimiento facial
                  </h3>
                  <p className="camera-modal-subtitle">Centra tu rostro dentro del visor</p>
                </div>
                <button
                  type="button"
                  className="camera-modal-close"
                  onClick={cerrarCamara}
                  disabled={!!estadoFaceId}
                  title="Cerrar cámara"
                >
                  ✕
                </button>
              </div>

              <div className={`camera-viewfinder ${rostroDetectado ? "is-detected" : ""}`}>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="camera-video"
                />

                <div className="viewfinder-hud">
                  <div className={`viewfinder-badge ${rostroDetectado ? "detected" : "searching"}`}>
                    <span className={`badge-dot ${rostroDetectado ? "green" : "pulse"}`}></span>
                    {rostroDetectado ? "Rostro detectado" : "Buscando rostro..."}
                  </div>
                </div>

                <div className="viewfinder-target">
                  <span className="target-corner tl"></span>
                  <span className="target-corner tr"></span>
                  <span className="target-corner bl"></span>
                  <span className="target-corner br"></span>
                </div>
              </div>

              <p className={`camera-status-msg ${mensajeRostro && !rostroDetectado ? "error" : ""}`}>
                {mensajeRostro || (rostroDetectado ? "✓ Rostro detectado y enfocado" : "Coloca tu rostro frente a la cámara")}
              </p>

              <div className="camera-btn-group">
                <button
                  type="button"
                  onClick={cerrarCamara}
                  className="btn-cancel-face"
                  disabled={!!estadoFaceId}
                >
                  Cerrar cámara
                </button>
              </div>

            </div>
          </div>
        )}
    </div>
  );
}