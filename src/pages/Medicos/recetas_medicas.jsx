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

function recetas_medicas({ data = [], dataPacientes=[]}){
    const [busqueda, setBusqueda] = useState("");
    const [pacientesFiltrados, setPacientesFiltrados] = useState(data);
    const [openFullModal, setOpenFullModal] = useState(false);
    const [consultas, setConsultas] = useState([]);


const handleBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);

    const resultado = consultas.filter((c) =>
    c.paciente?.nombre?.toLowerCase().includes(valor.toLowerCase())||
    c.paciente?.apellidoP?.toLowerCase().includes(valor.toLowerCase())

    
);

    setPacientesFiltrados(resultado);
};


useEffect(() => {
  Axios.get("http://127.0.0.1:8000/api/MostrarConsulta")
    .then((res) => {
      setConsultas(res.data);
    })
    .catch((error) => {
      console.error("Error cargando consultas:", error);
    });
}, []);

/*const handleDownloadFullPDF = (consulta) => {
  const doc = new jsPDF();

  // ===== HEADER =====
  doc.setFillColor(25, 118, 210); // azul médico
  doc.rect(0, 0, 210, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("HISTORIAL MÉDICO", 20, 18);

  // Logo fake (texto por ahora)
  doc.setFontSize(10);
  doc.text("Hospital San Gabriel", 150, 18);

  // Reset color
  doc.setTextColor(0, 0, 0);

  // ===== INFO PACIENTE =====
  doc.setFontSize(14);
  doc.text("Información del Paciente", 20, 45);

  doc.setFontSize(11);
  doc.text("Nombre: Juan Pérez", 20, 55);
  doc.text("Edad: 34 años", 20, 62);
  doc.text("Última actualización: 2024", 20, 69);

  // ===== TRATAMIENTOS =====
  doc.setFontSize(14);
  doc.text("Tratamientos Activos", 20, 85);

  autoTable(doc, {
    startY: 90,
    head: [["Medicamento", "Dosis", "Frecuencia", "Médico"]],
    body: [
      ["Metformina", "850mg", "Cada 12 horas", "Dra. Elena Vargas"],
      ["Vitamina D3", "2000 UI", "Diariamente", "Dr. Ricardo Soto"],
    ],
    theme: "striped",
    headStyles: { fillColor: [25, 118, 210] },
  });

  // ===== CONSULTAS =====
  const finalY = doc.lastAutoTable.finalY + 15;

  doc.setFontSize(14);
  doc.text("Historial de Consultas", 20, finalY);

  autoTable(doc, {
    startY: finalY + 5,
    head: [["Fecha", "Motivo", "Especialista", "ID"]],
    body: [
      ["15 Ene 2024", "Chequeo Anual", "Dra. Sofía García", "#C-58421"],
      ["10 Oct 2023", "Dolor lumbar", "Dr. Ricardo Soto", "#C-58400"],
    ],
    theme: "grid",
    headStyles: { fillColor: [56, 142, 60] },
  });

  // ===== FOOTER =====
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    "Documento generado automáticamente - Sistema Médico",
    20,
    pageHeight - 10
  );

  doc.save("historial_medico_profesional.pdf");

  setOpenFullModal(false);
  setOpenAlert(true);
};*/


const handleDownloadFullPDF = (consulta) => {

  const doc = new jsPDF();

  /* =========================
        HEADER MÉDICO
  ==========================*/
  doc.setFillColor(15, 76, 129); // azul médico elegante
  doc.rect(0, 0, 210, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("HISTORIAL CLÍNICO", 20, 20);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Sistema Profesional Médico", 20, 28);

  // línea decorativa
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 40, 190, 40);

  doc.setTextColor(0, 0, 0);

  /* =========================
        TARJETA PACIENTE
  ==========================*/
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(20, 45, 170, 35, 5, 5, "F");

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Información del Paciente", 25, 55);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  doc.text(
    `Nombre: ${consulta.paciente?.nombre ?? ""} ${consulta.paciente?.apellidoP ?? ""}`,
    25,
    65
  );

  doc.text(
    `ID Consulta: #${consulta.id}`,
    25,
    72
  );


  /* =========================
        SECCIÓN CONSULTA
  ==========================*/
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Detalle de la Consulta Médica", 20, 95);

  autoTable(doc, {
    startY: 100,
    head: [["Motivo", "Síntomas", "Notas Médicas"]],
    body: [
      [
        consulta.motivo ?? "N/A",
        consulta.sintomas ?? "N/A",
        consulta.notas ?? "N/A",
      ],
    ],
    theme: "grid",

    styles: {
      fontSize: 11,
      cellPadding: 6,
      valign: "middle",
    },

    headStyles: {
      fillColor: [15, 76, 129],
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },

    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  /* =========================
        FIRMA MÉDICA
  ==========================*/
  const finalY = doc.lastAutoTable.finalY + 25;

  doc.setDrawColor(150);
  doc.line(130, finalY, 190, finalY);

  doc.setFontSize(10);
  doc.text("Firma del Médico", 145, finalY + 5);

  /* =========================
        FOOTER PROFESIONAL
  ==========================*/
  const pageHeight = doc.internal.pageSize.height;

  doc.setDrawColor(220);
  doc.line(20, pageHeight - 20, 190, pageHeight - 20);

  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    "Documento generado automáticamente • Sistema Médico Profesional",
    20,
    pageHeight - 10
  );

  /* =========================
        DESCARGA
  ==========================*/
  doc.save(
    `Consulta_${consulta.paciente?.nombre}_${consulta.id}.pdf`
  );
};




    return(
    <Layout_Medicos>

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
            <div className="row g-4">
                {(busqueda ? pacientesFiltrados : consultas).map((consulta, index) => (
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
                        <Card  style={{ borderRadius: "20px", border: "1px solid #e5e7eb",boxShadow: "0 4px 10px rgba(0,0,0,0.05)",padding: "10px"}}>
                            <CardContent>
                                <div>
                                    <div style={{ display:"flex", alignItems:"center" }}>
                                            <div style={{width:"40px", height:"40px", borderRadius:"50%", background:"#dbeafe", display:"flex", alignItems:"center",justifyContent:"center",color:"#1d4ed8",fontWeight:"bold",marginRight:"15px"}}>
                                                {consulta.paciente?.nombre?.charAt(0)}
                                                {consulta.paciente?.apellidoP?.charAt(0)}
                                            </div>

                                            <Typography style={{ fontWeight:"700", fontSize:"18px" }}>
                                                {consulta.paciente?.nombre} {consulta.paciente?.apellidoP}
                                            </Typography>

                                        </div>
                                    <Typography style={{ fontSize: "13px", color: "#6b7280", background: "#f3f4f6", padding: "5px 10px", borderRadius: "10px",display: "inline-block" }}>
                                         Motivo: {consulta.motivo}
                                    </Typography>
                                </div>
                        {/* Botón */}
                        <div style={{ marginTop: "15px", textAlign: "center" }}>

                            <Button style={{background: "#1d4ed8",border: "none",borderRadius: "25px",padding: "8px 20px",fontWeight: "600"}} onClick={() => handleDownloadFullPDF(consulta)}>
                                <DownloadIcon /> Descargar PDF
                            </Button>

                        </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </div>


    </Layout_Medicos>


    )

    

}

export default recetas_medicas