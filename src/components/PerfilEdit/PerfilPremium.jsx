import React, { useState } from "react";
import "./PerfilPremium.css";
import ModalEdit from "./ModalEdit";

const PerfilPremium = () => {
  const [activeTab, setActiveTab] = useState("datos");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = () => {
    setIsModalOpen(true);
  };

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
                    <input type="text" defaultValue="Sofía Cárdenas" />
                  </div>

                  <div className="form-group">
                    <label>Fecha de Nacimiento</label>
                    <input type="text" placeholder="DD/MM/AAAA" />
                  </div>

                  <div className="form-group">
                    <label>Teléfono</label>
                    <input type="text" placeholder="+52 55 1234 5678" />
                  </div>

                  <div className="form-group">
                    <label>Correo</label>
                    <input type="email" defaultValue="sofia.cardenas@example.com" />
                  </div>

                  <div className="form-group full">
                    <label>Dirección</label>
                    <input type="text" placeholder="Calle Ejemplo 123, CDMX" />
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
                    <input type="checkbox" defaultChecked />
                    Recordatorios por WhatsApp
                  </label>

                  <label>
                    <input type="checkbox" defaultChecked />
                    Resultados de Laboratorio
                  </label>

                  <label>
                    <input type="checkbox" />
                    Boletín Mensual
                  </label>

                  <label>
                    <input type="checkbox" />
                    Promociones Exclusivas Premium
                  </label>
                </div>
              </>
            )}

            {activeTab === "seguridad" && (
              <>
                <div className="section-title">
                  <h3>Seguridad de la Cuenta</h3>
                </div>

                <div className="form-group small">
                  <label>Contraseña Actual</label>
                  <input type="password" defaultValue="••••••••••••" />
                </div>

                <div className="form-group small">
                  <label>Nueva Contraseña</label>
                  <input type="password" placeholder="Nueva contraseña" />
                </div>

                <div className="form-group small">
                  <label>Confirmar Nueva Contraseña</label>
                  <input type="password" placeholder="Confirmar contraseña" />
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