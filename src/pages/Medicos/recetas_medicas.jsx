import Layout_Medicos from "./Layout_Medicos"
import {  CardContent, Typography,Chip, Card} from "@mui/material";
import Form from 'react-bootstrap/Form';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import Button from 'react-bootstrap/Button';
import DownloadIcon from '@mui/icons-material/Download';
import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Link } from "react-router-dom";
import Axios from "axios";
import { useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function recetas_medicas({ data = [], dataPacientes=[]}){
    const [busqueda, setBusqueda] = useState("");
    const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
const [openModal, setOpenModal] = useState(false);
    const [openFullModal, setOpenFullModal] = useState(false);
    const [consultas, setConsultas] = useState([]);


const handleBusqueda = (e) => {
  const valor = e.target.value;
  setBusqueda(valor);

  const resultado = listaPacientes.filter((p) =>
    p.paciente?.usuario?.nombre?.toLowerCase().includes(valor.toLowerCase()) ||
    p.paciente?.apellidoP?.toLowerCase().includes(valor.toLowerCase())
  );

  setPacientesFiltrados(resultado);
};

useEffect(() => {
  Axios.get(`${API_URL}/MostrarConsulta`)
    .then((res) => {
      setConsultas(res.data);
    })
    .catch((error) => {
      console.error("Error cargando consultas:", error);
    });
}, []);

const pacientesConRecetas = consultas
  .filter(c => c.receta && c.receta.detalles.length > 0)
  .reduce((acc, consulta) => {
    const id = consulta.paciente?.id;

    if (!acc[id]) {
      acc[id] = {
        paciente: consulta.paciente,
        consultas: []
      };
    }

    acc[id].consultas.push(consulta);

    return acc;
  }, {});

  const listaPacientes = Object.values(pacientesConRecetas).map(p => ({
  ...p,
  consultas: p.consultas.sort((a, b) => b.id - a.id)
}));

const handleDownloadFullPDF = async (consulta) => {
  const doc = new jsPDF();
/* ================= HEADER ================= */
doc.setFillColor(15, 76, 129);
doc.rect(0, 0, 210, 30, "F");

doc.setTextColor(255, 255, 255);
doc.setFontSize(18);
doc.text("RECETA MÉDICA", 20, 18);

doc.setFontSize(10);
doc.text("Sistema Profesional Médico", 20, 25);

doc.setTextColor(0, 0, 0);

/* ================= DOCTOR ================= */
doc.setFontSize(11);
doc.setFont("helvetica", "bold");

doc.text(
  `Doctor: ${consulta.doctor?.usuario?.nombre ?? "N/A"}`,
  20,
  40
);

doc.setFont("helvetica", "normal");

doc.text(
  `Cédula: ${consulta.doctor?.cedula_profesional ?? "N/A"}`,
  140,
  40
);

// línea separadora elegante
doc.setDrawColor(200, 200, 200);
doc.line(20, 45, 190, 45);

/* ================= PACIENTE ================= */
doc.setFont("helvetica", "bold");

doc.text(
  `Paciente: ${consulta.paciente?.usuario?.nombre ?? ""} ${consulta.paciente?.apellidoP ?? ""}`,
  20,
  50
);

doc.setFont("helvetica", "normal");

doc.text(`ID Consulta: #${consulta.id}`, 20, 58);
doc.text(`Teléfono: ${consulta.paciente?.usuario?.telefono ?? "N/A"}`, 20, 66);
doc.text(`Correo: ${consulta.paciente?.usuario?.correo ?? "N/A"}`, 20, 74);
  /* ================= CONSULTA ================= */
  doc.setFontSize(14);
  doc.text("Detalle de Consulta", 20, 90);

  autoTable(doc, {
    startY: 95,
    head: [["Motivo", "Síntomas", "Diagnóstico"]],
    body: [
      [
        consulta.motivo ?? "N/A",
        consulta.sintomas ?? "N/A",
        consulta.diagnostico ?? "N/A",
      ],
    ],
  });

  /* ================= NOTAS ================= */
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Notas Clínicas"]],
    body: [[consulta.notas_clinicas ?? "N/A"]],
  });

  /* ================= RECETA (MEDICAMENTOS) ================= */
if (consulta.receta && consulta.receta.detalles.length > 0) {
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [["Medicamento", "Dosis", "Frecuencia", "Duración", "Instrucciones"]],
    body: consulta.receta.detalles.map(d => [
      d.medicamento?.nombre ?? "N/A",
      d.dosis ?? "N/A",
      d.frecuencia ?? "N/A",
      d.duracion ?? "N/A",
      d.instrucciones ?? "N/A",
    ]),
  });
}

/* ================= FIRMA ================= */
const finalY = doc.lastAutoTable.finalY + 20;

// línea
doc.line(130, finalY, 190, finalY);

// nombre doctor
doc.setFontSize(10);
doc.text(
  `${consulta.doctor?.usuario?.nombre ?? "Doctor"}`,
  135,
  finalY + 5
);

// texto firma
doc.text("Firma del Médico", 140, finalY + 10);
  /* ================= FOOTER ================= */
  const pageHeight = doc.internal.pageSize.height;

  doc.line(20, pageHeight - 20, 190, pageHeight - 20);
  doc.setFontSize(9);
  doc.text(
    "Documento generado automáticamente • Sistema Médico",
    20,
    pageHeight - 10
  );

  /* ================= DESCARGA ================= */
  doc.save(`Receta_${consulta.paciente?.usuario?.nombre}_${consulta.id}.pdf`);
};


    return(
      
    <Layout_Medicos>
{openModal && pacienteSeleccionado && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999
  }}>

    <div style={{
      width: "90%",
      maxWidth: "800px",
      background: "#fff",
      borderRadius: "20px",
      padding: "20px",
      maxHeight: "80vh",
      overflowY: "auto",
      animation: "fadeIn 0.3s ease"
    }}>

      {/* HEADER */}
      <div style={{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        marginBottom:"15px"
      }}>
        <h5 style={{margin:0}}>
          {pacienteSeleccionado.paciente.usuario?.nombre} {pacienteSeleccionado.paciente?.apellidoP}
        </h5>

        <button
          onClick={() => setOpenModal(false)}
          style={{
            border:"none",
            background:"transparent",
            fontSize:"20px",
            cursor:"pointer"
          }}
        >
          ✕
        </button>
      </div>
      <style>
{`
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
`}
</style>

      {/* CONTENIDO */}
      {pacienteSeleccionado.consultas.map((consulta, i) => (
        <div key={i} style={{
          border:"1px solid #e5e7eb",
          borderRadius:"15px",
          padding:"15px",
          marginBottom:"10px"
        }}>
          
          <Typography><b>Motivo:</b> {consulta.motivo}</Typography>
          <Typography><b>Diagnóstico:</b> {consulta.diagnostico}</Typography>

          <Button
            size="sm"
            style={{marginTop:"10px"}}
            onClick={() => handleDownloadFullPDF(consulta)}
          >
            <DownloadIcon fontSize="small"/> Descargar PDF
          </Button>

        </div>
      ))}

    </div>
  </div>
)}
        <br />
        <br />
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: "600" }}>Gestion de Recetas Medicas</h1>
        <Typography className="medicine-name" style={{color:"gray"}}>
            Consulte y descargue las recetas médicas de sus pacientes.
        </Typography>
        <br />


                    <div className="container mt-3">

                        <div className="bg-white p-4" style={{borderRadius:"20px",border:"1px solid #e5e7eb",boxShadow:"0 2px 10px rgba(0,0,0,0.05)"}}>

                                <div className="row justify-content-center">

                                    <div className="col-lg-10">

                                        <div style={{position:"relative"}}>

                                            <Form.Control type="text"placeholder="Buscar por nombre....."style={{height:"55px",borderRadius:"30px",background:"#f3f4f6",border:"none",paddingLeft:"20px",paddingRight:"60px"}} value={busqueda} onChange={handleBusqueda}/>


                                        </div>

                                    </div>

                                </div>

                                <div  className="row mt-4 align-items-center">

                                        <div className="col-12 text-end">
                                            <Button style={{background:"#1d4ed8",border:"none",borderRadius:"30px",padding:"12px 25px",fontWeight:"600"}} as={Link} to="/Medicos/consulta">+ Nueva Consulta</Button>

                                        </div>

                                 </div>


                        </div>

                    </div>
         <br />
         <br />


<div className="container mt-4">
  <div style={{
    background: "#fff",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  }}>

    <table className="table align-middle">
      <thead>
        <tr style={{color:"#6b7280", fontSize:"14px"}}>
          <th>Paciente</th>
          <th>Último Motivo</th>
          <th>Total Consultas</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {(busqueda ? pacientesFiltrados : listaPacientes).map((p, index) => (
          <tr key={index} style={{cursor:"pointer"}}>

            {/* Paciente */}
            <td onClick={() => {
              setPacienteSeleccionado(p);
              setOpenModal(true);
            }}>
              <div style={{display:"flex", alignItems:"center"}}>
                <img
                  src={p.paciente?.usuario?.foto_url || "https://i.imgur.com/0y0y0y0.png"}
                  alt="Paciente"
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    marginRight: "10px"
                  }}
                />

                <div>
                  <div style={{fontWeight:"600"}}>
                    {p.paciente.usuario?.nombre} {p.paciente?.apellidoP}
                  </div>
                  <div style={{fontSize:"12px", color:"#9ca3af"}}>
                    ID: {p.paciente?.id}
                  </div>
                </div>
              </div>
            </td>

            {/* Motivo */}
            <td>{p.consultas[0]?.motivo}</td>

            {/* Total */}
            <td>
              <span style={{
                background:"#e0f2fe",
                padding:"5px 10px",
                borderRadius:"10px",
                fontSize:"13px",
                fontWeight:"600"
              }}>
                {p.consultas.length} consultas
              </span>
            </td>

            {/* Acción */}
            <td>
              <Button
                size="sm"
                style={{borderRadius:"20px"}}
                onClick={() => handleDownloadFullPDF(p.consultas[0])}
              >
                <DownloadIcon fontSize="small"/> PDF
              </Button>
            </td>

          </tr>
        ))}
      </tbody>
    </table>

  </div>
</div>


    </Layout_Medicos>


    )

    

}

export default recetas_medicas