import Sidebar from "../../components/farmacia/Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";

import "./MedicinasCaducadas.css";
const API_URL = import.meta.env.VITE_API_URL;

export default function MedicinasCaducadas() {
  const [caducados, setCaducados] = useState([]);

  useEffect(() => {
    obtenerCaducados();
  }, []);

  const obtenerCaducados = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/getcaducados`
      );

      setCaducados(response.data.data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  return (
    <div className="caducados-layout">
      <Sidebar />

      <div className="caducados-container">
        {/* HEADER */}

        <div className="page-header">
          <div>
            <h2>Medicinas Caducadas</h2>

            <p>
              Control y seguimiento de medicamentos vencidos
            </p>
          </div>

          <div className="stats-card">
            <span>Total</span>
            <strong>{caducados.length}</strong>
          </div>
        </div>

        {/* CARD */}

        <div className="caducados-card">
          <div className="card-header-custom">
            <h3>Lista de Medicamentos Caducados</h3>
          </div>

          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Medicamento</th>
                  <th>Motivo</th>
                  <th>Cantidad</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {caducados.length > 0 ? (
                  caducados.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="medicamento-info">
                          <div className="medicine-icon">
                            💊
                          </div>

                          <div>
                            <strong>
                              {
                                item.inventario?.medicamento
                                  ?.nombre
                              }
                            </strong>

                            <p>
                              {
                                item.inventario?.medicamento
                                  ?.sustancia_activa
                              }
                            </p>

                            <small>
                              {
                                item.inventario?.medicamento
                                  ?.categoria
                              }
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>{item.motivo}</td>

                      <td>
                        <span className="cantidad-badge">
                          {item.cantidad}
                        </span>
                      </td>

                      <td>
                        <span className="status-badge">
                          Caducado
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="empty-state"
                    >
                      No hay medicamentos caducados registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}