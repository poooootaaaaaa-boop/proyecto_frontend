import { useLocation } from "react-router-dom";
import Layout_Medicos from "./Layout_Medicos"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Historial({ data }) {
  const location = useLocation();
  const paciente = location.state?.paciente;

  if (!paciente) {
    return <p>No se encontró el paciente</p>;
  }

const consultasPaciente = data.filter(
  consulta => Number(consulta.pacienteId) === Number(paciente.id)
);


  return (
    <div>
        <Layout_Medicos> 
            <div className="container mt-4"style={{maxWidth:"900px"}}>
                <div style={{background:"#f8fafc",padding:"18px 22px",borderRadius:"10px",border:"1px solid #e5e7eb",marginBottom:"20px" }} >
                            <h2 style={{ fontWeight:"600",margin:0,color:"#1e3a8a" }}>
                                Historial Clínico
                            </h2>

                            <p style={{ margin:0,color:"#64748b",fontSize:"16px"}}>
                                Paciente: <strong>{paciente.nombre} {paciente.apellidoP}</strong>
                            </p>
                        </div>

            <div className="row">

            {/* NOTAS RAPIDAS */}
                <div className="bg-white mb-4"style={{borderRadius:"12px",boxShadow:"0 8px 20px rgba(0,0,0,0.08)",padding:"28px",borderTop:"10px solid #2563eb"}}>

                <h5 className="text-primary mb-3">NOTAS RÁPIDAS</h5>

                {consultasPaciente.filter(c=>c.notas).map((c) => (
                <div key={c.id} style={{background:"#f8fafc",borderRadius:"10px",padding:"16px",marginBottom:"12px",borderLeft:"5px solid #f59e0b",boxShadow:"0 2px 6px rgba(0,0,0,0.05)"}}>
                <p style={{marginBottom:"6px"}}>{c.notas}</p>

                <small style={{color:"#64748b"}}>
                    {new Date(c.id).toLocaleDateString()}
                </small>

                </div>
                ))}

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
                <strong className="text-muted">Examen Físico</strong>
                <p className="mb-0">{consulta.examen}</p>
                </div>

                </div>

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