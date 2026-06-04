import {
Card,
Form,
Button,
Row,
Col
} from "react-bootstrap";

import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";

import { useState, useEffect } from "react";
import axios from "axios";

import "./Consultorios.css";
import "./dashboardFarmacia.css";

export default function MedicinasCaducadas() {


    const [caducados, setCaducados] = useState([]);

  useEffect(() => {
    obtenerCaducados();
  }, []);

  const obtenerCaducados = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/getcaducados");
      setCaducados(response.data.data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };


  return (
    <div className="home-layout">
      <Sidebar />
      <div
        className="main-content"
        style={{
          width: "100%",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <h1>Medicinas Caducadas</h1>

        <div
          className="card-modern"
          style={{
            width: "100%",
            maxWidth: "1140px",
            margin: "0 auto",
          }}
        >
          <h5 className="section-title">Lista de Medicinas Caducadas</h5>

          <div
            className="table-modern"
            style={{
              width: "100%",
              minWidth: "720px",
              overflowX: "auto",
            }}
          >
            <div className="table-header-modern">
              <span>Medicamento</span>
              <span>Motivo</span>
              <span>Cantidad</span>
              <span>Status</span>
            </div>


            {caducados.map((item, index) => (
                <div className="table-row-modern" key={index}>

                <div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div>
                <strong>{item.inventario?.medicamento?.nombre}</strong>
                <br />
                <small className="muted">
                    {item.inventario?.medicamento?.sustancia_activa}
                </small>
                </div>
            </div>

            <br />
            <small className="muted">
                {item.inventario?.medicamento?.categoria}
            </small>
            </div>
                <div>{item.motivo}</div>
                <div>{item.cantidad}</div>
                <div>
                    <span className="badge bg-danger">Caducado</span>
                </div>
            </div>
            ))}

          </div>
        </div>
      </div>
    </div>    
  );
}
