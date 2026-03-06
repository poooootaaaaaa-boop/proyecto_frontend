import { Nav, Offcanvas } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import LogoutModal from "./LogoutModal";

export default function Sidebar() {
  const [openLogout, setOpenLogout] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "10px",
    textDecoration: "none",
    background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
    fontWeight: isActive ? "600" : "400",
    transition: "0.2s",
  });

  const sidebarContent = (
    <>
      <div
        style={{
          fontSize: "22px",
          fontWeight: "700",
          marginBottom: "35px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <i className="bi bi-hospital"></i>
        CliniConnect
      </div>

      <Nav className="flex-column gap-2">

        <Nav.Link as={NavLink} to="/farmacia/Home" style={linkStyle}>
          <i className="bi bi-house-door"></i>
          Inicio
        </Nav.Link>

        <Nav.Link as={NavLink} to="/farmacia/dashboard" style={linkStyle}>
          <i className="bi bi-speedometer2"></i>
          Dashboard
        </Nav.Link>

        <Nav.Link as={NavLink} to="/farmacia/RecetasMedicas" style={linkStyle}>
          <i className="bi bi-file-earmark-medical"></i>
          Recetas Médicas
        </Nav.Link>

        <Nav.Link as={NavLink} to="/farmacia/inventario" style={linkStyle}>
          <i className="bi bi-box-seam"></i>
          Inventario
        </Nav.Link>

        {/* DISTRIBUIDORES */}
        <Nav.Link as={NavLink} to="/farmacia/Distribuidores" style={linkStyle}>
          <i className="bi bi-truck"></i>
          Distribuidores
        </Nav.Link>

        {/* DOCTORES */}
        <Nav.Link as={NavLink} to="/farmacia/doctores" style={linkStyle}>
          <i className="bi bi-person-badge"></i>
          Doctores
        </Nav.Link>

      </Nav>

      <div style={{ marginTop: "auto" }}>
        <hr style={{ borderColor: "rgba(255,255,255,0.3)" }} />

        <Nav.Link as={NavLink} to="/farmacia/configuracion" style={linkStyle}>
          <i className="bi bi-gear"></i>
          Configuración
        </Nav.Link>

        <Nav.Link
          onClick={() => setOpenLogout(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#ffdddd",
            padding: "10px 15px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          <i className="bi bi-box-arrow-right"></i>
          Cerrar sesión
        </Nav.Link>
      </div>
    </>
  );

  return (
    <>
      {/* BOTON HAMBURGUESA SOLO EN MOBILE */}
      <button
        className="btn btn-primary d-lg-none m-3"
        onClick={handleShow}
      >
        <i className="bi bi-list"></i>
      </button>

      {/* SIDEBAR FIJO EN DESKTOP */}
      <div
        className="d-none d-lg-flex"
        style={{
          width: "250px",
          background: "linear-gradient(180deg,#1f3fa3,#162c73)",
          color: "#fff",
          minHeight: "100vh",
          padding: "25px 20px",
          flexDirection: "column",
        }}
      >
        {sidebarContent}
      </div>

      {/* SIDEBAR MOBILE */}
      <Offcanvas show={show} onHide={handleClose} className="d-lg-none">
        <Offcanvas.Body
          style={{
            background: "linear-gradient(180deg,#1f3fa3,#162c73)",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            padding: "25px 20px",
          }}
        >
          {sidebarContent}
        </Offcanvas.Body>
      </Offcanvas>

      <LogoutModal
        open={openLogout}
        handleClose={() => setOpenLogout(false)}
      />
    </>
  );
}