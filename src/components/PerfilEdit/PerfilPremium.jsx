import React, { useState, useEffect } from "react";
import "./PerfilPremium.css";
import ModalEdit from "./ModalEdit";

const PerfilPremium = () => {
  const [activeTab, setActiveTab] = useState("datos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
  const datosGuardados = localStorage.getItem("perfilPremium");
  if (datosGuardados) {
    setPerfil(JSON.parse(datosGuardados));
  }
}, []);

const [showPassword, setShowPassword] = useState({
  actual: false,
  nueva: false,
  confirmar: false,
});

const handleSave = () => {
  // Validar que las contraseñas coincidan
  if (perfil.seguridad.nueva !== perfil.seguridad.confirmar) {
    alert("Las contraseñas no coinciden");
    return;
  }

  // Actualizar contraseña actual con la nueva
  const perfilActualizado = {
    ...perfil,
    seguridad: {
      actual: perfil.seguridad.nueva || perfil.seguridad.actual,
      nueva: "",
      confirmar: "",
    },
  };

  setPerfil(perfilActualizado);
  localStorage.setItem("perfilPremium", JSON.stringify(perfilActualizado));

  setIsModalOpen(true);
};

 const handleChange = (e) => {
  setPerfil({
    ...perfil,
    [e.target.name]: e.target.value,
  });
};

const handleCheckbox = (e) => {
  setPerfil({
    ...perfil,
    notificaciones: {
      ...perfil.notificaciones,
      [e.target.name]: e.target.checked,
    },
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
  notificaciones: {
    whatsapp: true,
    laboratorio: true,
    boletin: false,
    promociones: false,
  },
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
                    <input type="text" name="fechaNacimiento" value={perfil.fechaNacimiento} onChange={handleChange} placeholder="DD/MM/AAAA" />
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
                </div>
              </>
            )}

            {activeTab === "notificaciones" && (
              <>
                <div className="section-title">
                  <h3>Preferencias de Notificación</h3>
                </div>

                <div className="preferences-box">
                  <label>
                    <input type="checkbox" name="whatsapp" checked={perfil.notificaciones.whatsapp} onChange={handleCheckbox}/>
                    Recordatorios por WhatsApp
                  </label>

                  <label>
                    <input type="checkbox" name="laboratorio" checked={perfil.notificaciones.laboratorio} onChange={handleCheckbox}/>
                    Resultados de Laboratorio
                  </label>

                  <label>
                    <input type="checkbox" name="boletin" checked={perfil.notificaciones.boletin} onChange={handleCheckbox}/>
                    Boletín Mensual
                  </label>

                  <label>
                    <input type="checkbox" name="promociones" checked={perfil.notificaciones.promociones} onChange={handleCheckbox}/>
                    Promociones Exclusivas Premium
                  </label>
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
         disabled  
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
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAcKqEKNmAiba_IH3a251qyLF9pipVNv7o52Hw5Yv_M3x2vcbk51NL-VhmIbBnWQi1bw8Z1OJgyMoC33R8aqF_qSV_SMY-QRihzGenpgU94MXGq30tS1yJEa5gAzY6sirMlmC_6RbpU7TaVkT6kEvTKNfc-lQJB88hMoobQR1Kt8G2fZx53V-c5SzjYWCJNn6DJ33sqeuD23Nfsb3B53Ut-eziSLPzNqYoLExTGGmp-nCjIBodzCTeRiXidTNzI6y4Rhqx8UtJsxDoz")',
                }}
              />

              <h5>Dra. Elena Ramirez</h5>
              <p className="specialty">Cardiología</p>
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