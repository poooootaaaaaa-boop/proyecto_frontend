import { useLocation } from "react-router-dom";
import Layout_Medicos from "./Layout_Medicos";
import { useEffect, useState } from "react";
import Axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
function Historial() {

  const location = useLocation();
  const paciente = location.state?.paciente;

  const [consultasPaciente, setConsultasPaciente] = useState([]);

  useEffect(() => {
    if (paciente?.id) {
      Axios.get(`${API_URL}/consultas/${paciente.id}`)
        .then((response) => {
          setConsultasPaciente(response.data.consultas);
        })
        .catch((error) => {
          console.error("Error cargando consultas:", error);
        });
    }
  }, [paciente]);

  if (!paciente) {
    return <p>No se encontró el paciente</p>;
  }

  return (
    <div>
      <Layout_Medicos>

        <div className="container mt-4" style={{ maxWidth: "900px" }}>

          {/* HEADER */}
          <div style={{
            background: "#f8fafc",
            padding: "18px 22px",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            marginBottom: "20px"
          }}>
            <h2 style={{ fontWeight: "600", margin: 0, color: "#1e3a8a" }}>
              Historial Clínico
            </h2>

            <p style={{ margin: 0, color: "#64748b", fontSize: "16px" }}>
              Paciente: <strong>{paciente.nombre} {paciente.apellidoP}</strong>
            </p>
          </div>

          <div className="row">

            {/* NOTAS */}
            <div className="bg-white mb-4"
              style={{
                borderRadius: "12px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                padding: "28px",
                borderTop: "10px solid #2563eb"
              }}>

              <h5 className="text-primary mb-3">NOTAS RÁPIDAS</h5>

              {consultasPaciente.filter(c => c.notas).length > 0 ? (
                consultasPaciente
                  .filter(c => c.notas)
                  .map((c) => (
                    <div key={c.id}
                      style={{
                        background: "#f8fafc",
                        borderRadius: "10px",
                        padding: "16px",
                        marginBottom: "12px",
                        borderLeft: "5px solid #f59e0b",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
                      }}>

                      <p style={{ marginBottom: "6px" }}>{c.notas}</p>

                      <small style={{ color: "#64748b" }}>
                        {new Date(c.created_at).toLocaleDateString()}
                      </small>

                    </div>
                  ))
              ) : (
                <p style={{ color: "#64748b" }}>No hay notas registradas</p>
              )}

            </div>

            {/* HISTORIAL */}
            <h5 className="mb-4 fw-bold">🩺 Resumen de Visitas</h5>

            {consultasPaciente.length > 0 ? (
              <div className="timeline">

                {consultasPaciente.map((consulta) => (
                  <div key={consulta.id} className="card shadow-sm mb-4 border-0">

                    <div className="card-body">

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold text-primary mb-0">
                          Consulta #{consulta.id}
                        </h6>

                        <small style={{ color: "#64748b" }}>
                          {new Date(consulta.created_at).toLocaleString()}
                        </small>
                      </div>

                      <div className="row">

                        <div className="col-md-4 mb-2">
                          <strong className="text-muted">Motivo</strong>
                          <p className="mb-0">{consulta.motivo}</p>
                        </div>

                        <div className="col-md-4 mb-2">
                          <strong className="text-muted">Síntomas</strong>
                          <p className="mb-0">{consulta.sintomas}</p>
                        </div>

                        <div className="col-md-4 mb-2">
                          <strong className="text-muted">Examen</strong>
                          <p className="mb-0">{consulta.examen}</p>
                        </div>

                      </div>

                      {/* EXTRA INFO */}
                      {consulta.tratamientoLargo && (
                        <div className="mt-3">
                          <strong>Tratamiento largo:</strong> {consulta.tratamientoLargo}
                        </div>
                      )}

                      {consulta.fechaTratamiento && (
                        <div>
                          <strong>Fecha de control:</strong> {consulta.fechaTratamiento}
                        </div>
                      )}

                    </div>

                  </div>
                ))}

              </div>
            ) : (
              <p>No hay consultas registradas para este paciente.</p>
            )}

          </div>
        </div>

      </Layout_Medicos>
    </div>
  );
}

export default Historial;