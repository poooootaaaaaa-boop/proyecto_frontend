import React, { useState, useEffect } from "react";
import "./PerfilPremium.css";
import ModalEdit from "./ModalEdit";

const API_URL = import.meta.env.VITE_API_URL;

const PerfilPremium = () => {
  const [activeTab, setActiveTab] = useState("datos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagen, setImagen] = useState(null);
useEffect(() => {
  const obtenerPerfil = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      if (!usuario) return;

      const res = await fetch(`${API_URL}/perfil/${usuario.id}`);
      const data = await res.json();

      setPerfil((prev) => ({
        ...prev,
        nombre: data.nombre || "",
        correo: data.correo || "",
        telefono: data.telefono || "",
        fechaNacimiento: data.fechaNacimiento || "",
        direccion: data.direccion || "",
      }));

    } catch (error) {
      console.error("Error:", error);
    }
  };

  obtenerPerfil();
}, []);

const obtenerNotificaciones = async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const res = await fetch(`${API_URL}/notificaciones/${usuario.id}`);
  const data = await res.json();

  setPerfil((prev) => ({
    ...prev,
    notificaciones: data,
  }));
};
useEffect(() => {
  obtenerNotificaciones();
}, []);

const handleToggleNotificacion = async (id) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  await fetch(`${API_URL}/notificaciones/toggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usuario_id: usuario.id,
      notificacion_id: id,
    }),
  });

  await obtenerNotificaciones(); // refrescar
};



const [showPassword, setShowPassword] = useState({
  actual: false,
  nueva: false,
  confirmar: false,
});

const handleSave = async () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const formData = new FormData();

  formData.append("usuario_id", usuario.id);
  formData.append("nombre", perfil.nombre);
  formData.append("correo", perfil.correo);
  formData.append("telefono", perfil.telefono);
  formData.append("fechaNacimiento", perfil.fechaNacimiento);
  formData.append("direccion", perfil.direccion);

  if (imagen) {
    formData.append("imagen", imagen);
  }

  await fetch(`${API_URL}/perfil/actualizar`, {
    method: "POST",
    body: formData,
  });

  // contraseña (igual que ya lo tienes)
  if (perfil.seguridad.nueva) {
    await fetch(`${API_URL}/perfil/cambiar-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario_id: usuario.id,
        actual: perfil.seguridad.actual,
        nueva: perfil.seguridad.nueva,
      }),
    });
  }

  setIsModalOpen(true);
};

const [doctor, setDoctor] = useState(null);

useEffect(() => {
  const obtenerDoctor = async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    const res = await fetch(`${API_URL}/perfil/doctor/${usuario.id}`);
    const data = await res.json();

    setDoctor(data);
  };

  obtenerDoctor();
}, []);

 const handleChange = (e) => {
  setPerfil({
    ...perfil,
    [e.target.name]: e.target.value,
  });
};

const handleSeguridad = (e) => {
  setPerfil({
    ...perfil,
    seguridad: {
      ...perfil.seguridad,
      [e.target.name]: e.target.value,
    },
  });
};
  const [perfil, setPerfil] = useState({
  nombre: "Sofía Cárdenas",
  fechaNacimiento: "",
  telefono: "",
  correo: "sofia.cardenas@example.com",
  direccion: "",
notificaciones: [],
  seguridad: {
    actual: "",
    nueva: "",
    confirmar: "",
  },
});

  return (
    <div className="perfil-container">
      <div className="perfil-wrapper">

         <ModalEdit
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

        {/* Header */}
        <div className="perfil-header">
          <h2>Mi Perfil y Configuración Premium</h2>

          <div className="header-actions">
            <button className="icon-btn">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "datos" ? "active" : ""}`}
            onClick={() => setActiveTab("datos")}
          >
            Datos Personales
          </button>

          <button
            className={`tab ${activeTab === "notificaciones" ? "active" : ""}`}
            onClick={() => setActiveTab("notificaciones")}
          >
            Notificaciones
          </button>

          <button
            className={`tab ${activeTab === "seguridad" ? "active" : ""}`}
            onClick={() => setActiveTab("seguridad")}
          >
            Seguridad
          </button>
        </div>

        <div className="perfil-grid">

          {/* LEFT CONTENT */}
          <div className="perfil-left fade-slide">

            {activeTab === "datos" && (
              <>
                <div className="section-title">
                  <h3>Información Personal</h3>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Nombre Completo</label>
                    <input type="text" name="nombre"  value={perfil.nombre}  onChange={handleChange}/>
                  </div>

                  <div className="form-group">
                    <label>Fecha de Nacimiento</label>
                    <input type="date" name="fechaNacimiento" value={perfil.fechaNacimiento} onChange={handleChange} placeholder="DD/MM/AAAA" />
                  </div>

                  <div className="form-group">
                    <label>Teléfono</label>
                    <input type="text" name="telefono" value={perfil.telefono} onChange={handleChange} placeholder="+52 55 1234 5678" />
                  </div>

                  <div className="form-group">
                    <label>Correo</label>
                    <input type="email" name="correo" value={perfil.correo} onChange={handleChange} />
                  </div>

                  <div className="form-group full">
                    <label>Dirección</label>
                    <input type="text" name="direccion" value={perfil.direccion} onChange={handleChange} placeholder="Calle Ejemplo 123, CDMX" />
                  </div>

                  <input 
  type="file" 
  onChange={(e) => setImagen(e.target.files[0])}
/>
                </div>
              </>
            )}

            {activeTab === "notificaciones" && (
              <>
                <div className="section-title">
                  <h3>Preferencias de Notificación</h3>
                </div>

                <div className="preferences-box">
{perfil.notificaciones.map((n) => (
  <label key={n.id}>
    <input
      type="checkbox"
      checked={!!n.habilitado}
      onChange={() => handleToggleNotificacion(n.id)}
    />
    {n.nombre}
  </label>
))}
                </div>
              </>
            )}

          {activeTab === "seguridad" && (
  <>
    {/* CONTRASEÑA ACTUAL */}
    <div className="form-group small">
      <label>Contraseña Actual</label>

      <div className="password-wrapper">
<input
  type={showPassword.actual ? "text" : "password"}
  name="actual"
  value={perfil.seguridad.actual}
  onChange={handleSeguridad}
/>

        <span
          className="material-symbols-outlined eye-icon"
          onClick={() =>
            setShowPassword((prev) => ({
              ...prev,
              actual: !prev.actual,
            }))
          }
        >
          {showPassword.actual ? "visibility_off" : "visibility"}
        </span>
      </div>
    </div>

    {/* NUEVA CONTRASEÑA */}
    <div className="form-group small">
      <label>Nueva Contraseña</label>

      <div className="password-wrapper">
        <input
          type={showPassword.nueva ? "text" : "password"}
          name="nueva"
          value={perfil.seguridad.nueva}
          onChange={handleSeguridad}
        />

        <span
          className="material-symbols-outlined eye-icon"
          onClick={() =>
            setShowPassword((prev) => ({
              ...prev,
              nueva: !prev.nueva,
            }))
          }
        >
          {showPassword.nueva ? "visibility_off" : "visibility"}
        </span>
      </div>
    </div>

    {/* CONFIRMAR CONTRASEÑA */}
    <div className="form-group small">
      <label>Confirmar Nueva Contraseña</label>

      <div className="password-wrapper">
        <input
          type={showPassword.confirmar ? "text" : "password"}
          name="confirmar"
          value={perfil.seguridad.confirmar}
          onChange={handleSeguridad}
        />

        <span
          className="material-symbols-outlined eye-icon"
          onClick={() =>
            setShowPassword((prev) => ({
              ...prev,
              confirmar: !prev.confirmar,
            }))
          }
        >
          {showPassword.confirmar ? "visibility_off" : "visibility"}
        </span>
      </div>
    </div>
  </>
)}

            <button className="update-btn" onClick={handleSave}>Guardar Cambios</button>
          </div>

          {/* RIGHT CARD */}
          <div className="perfil-right fade-slide">
            <h4>Médico Asignado</h4>

            <div className="doctor-card">
              <div
                className="avatar-large"
style={{
  backgroundImage: perfil.foto_url
    ? `url("http://localhost:8000/api/usuario/foto/${perfil.foto_url}")`
    : `url("https://ui-avatars.com/api/?name=${perfil.nombre}")`
}}
              />
<h5>{doctor?.nombre}</h5>
<p className="specialty">{doctor?.especialidad}</p>
              <p className="address">
                Sede Central: Plaza Médica 123 <br />
                Ciudad de México
              </p>

              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PerfilPremium;