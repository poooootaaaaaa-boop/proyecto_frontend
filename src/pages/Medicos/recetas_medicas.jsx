import Layout_Medicos from "./Layout_Medicos"
import {  CardContent, Typography,Chip, Card} from "@mui/material";
import Form from 'react-bootstrap/Form';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import Button from 'react-bootstrap/Button';
import DownloadIcon from '@mui/icons-material/Download';
import { useState } from "react";


function recetas_medicas({ data = [] }){

          const buscarPaciente = () => {
    console.log("Buscando paciente")

  }
    return(
    <Layout_Medicos>

        <br />
        <br />
        <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: "600" }}>Gestion de Recetas Medicas</h1>
        <Typography className="medicine-name" style={{color:"gray"}}>
            Consulte y descargue las recetas médicas de sus pacientes.
        </Typography>
        <br />
        <br />








            <div className="container mt-4">

                <div style={{background: "#f8fafc",borderRadius: "20px",padding: "25px",boxShadow: "0 4px 10px rgba(0,0,0,0.05)",border: "1px solid #e5e7eb"}}>

                    
                    <h5 style={{fontWeight:"700", marginBottom:"5px"}}>Buscar Paciente</h5>

                    <p style={{color:"#6b7280", marginBottom:"20px"}}>Ingrese el nombre del paciente para filtrar las recetas y acceder a su historial completo.</p>


                    <div className="row align-items-center">

                        <div className="col-md-9 position-relative">

                            <Form>
                                <Form.Group>

                                    <Form.Control type="text"placeholder="🔍 Buscar por nombre del paciente..." style={{borderRadius:"30px",padding:"12px 20px",border:"none",background:"#e5e7eb",fontSize:"15px"}}/>

                                </Form.Group>
                            </Form>

                        </div>


                        {/* Botón */}
                        <div className="col-md-3 text-end">

                            <Button onClick={buscarPaciente}style={{ background:"#1d4ed8",border:"none",borderRadius:"30px",padding:"12px 25px",fontWeight:"600",boxShadow:"0 5px 12px rgba(29,78,216,0.3)"}}>🔍 Buscar</Button>

                        </div>

                    </div>

                </div>

            </div>
         <br />
         <br />


        <div className="container mt-4">
            <div className="row g-4">
                {data.map((paciente, index) => (
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
                        <Card  style={{ borderRadius: "20px", border: "1px solid #e5e7eb",boxShadow: "0 4px 10px rgba(0,0,0,0.05)",padding: "10px"}}>
                            <CardContent>
                                <div>
                                    <div style={{ display:"flex", alignItems:"center" }}>
                                            <div style={{width:"40px", height:"40px", borderRadius:"50%", background:"#dbeafe", display:"flex", alignItems:"center",justifyContent:"center",color:"#1d4ed8",fontWeight:"bold",marginRight:"15px"}}>
                                                {paciente.nombre?.charAt(0)}
                                                {paciente.apellido?.charAt(0)}
                                            </div>

                                            <Typography style={{ fontWeight:"700", fontSize:"18px" }}>
                                                {paciente.nombre} {paciente.apellido}
                                            </Typography>

                                        </div>
                                    <Typography style={{ fontSize: "13px", color: "#6b7280", background: "#f3f4f6", padding: "5px 10px", borderRadius: "10px",display: "inline-block" }}>
                                        Motivo: {paciente.motivo}
                                    </Typography>
                                </div>
                        {/* Botón */}
                        <div style={{ marginTop: "15px", textAlign: "center" }}>

                            <Button style={{background: "#1d4ed8",border: "none",borderRadius: "25px",padding: "8px 20px",fontWeight: "600"}}>
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