import { useState } from "react";
import Layout_Medicos from "./Layout_Medicos";
import {  CardContent, Typography,Chip} from "@mui/material";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Mensaje from "./mensaje";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { Link } from "react-router-dom";

function Consulta({data,setData, dataPacientes}){
    const [pacienteId, setPacienteId] = useState("");
    const[motivo, setMotivo]=useState("");
    const[sintomas, setSintomas]=useState("");
    const[examen, setExamen]=useState("");
    const [mostrarMensaje,setMostrarMensaje]=useState(false);
    const [notas, setNotas] = useState("");
    const [tratamientoLargo, setTratamientoLargo] = useState("");
    const [fechaTratamiento, setFechaTratamiento] = useState(null);

      const guardar = () => {
    // find patient info so we can include name in the stored record
    const selected = dataPacientes.find(p => String(p.id) === String(pacienteId));
    const nuevoPaciente = {
      id: Date.now(),
      pacienteId,
      motivo,
      sintomas,
      examen,
      notas,
      tratamientoLargo,
      fechaTratamiento:fechaTratamiento?.format("YYYY-MM-DD HH:mm"),
      progreso: 0,
      nombre: selected?.nombre || "",
      apellido: selected?.apellidoP || ""
    };
    if (typeof setData === "function") {
      setData(prev => [...prev, nuevoPaciente]);
      setMostrarMensaje(true);  
    } else {
      console.error("setData no es una función", setData);
    }
    setMotivo("");
    setSintomas("");
    setExamen("");
    setNotas("");
    setTratamientoLargo("");
    setFechaTratamiento("");
  };

  console.log(fechaTratamiento)


    return(
        <div>
            <Layout_Medicos>

                {mostrarMensaje ? (
                
                    <Mensaje
                        titulo="¡Consulta Registrada!"
                        descripcion="La consulta fue agregada correctamente."
                        botonPrincipal="Volver"
                        onPrincipal="/Medicos/recetas_medicas"
                    />
                
                            ) : (  

                        <div>
                             <div className="container mt-4" >
                                 <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: "600" }}>Formulario Clinico</h3>
                                 <Typography style={{fontSize: "17px",color: "gray"}}>Registra el Proceso de la Consulta Actual</Typography>
                                <div className="bg-white p-4 mb-4" style={{borderRadius:"20px",border:"1px solid #ddd",boxShadow:"0 2px 6px rgba(0,0,0,0.05)"}}>

                                        <Row className="mt-3">
                                            
                                            <br />
                                            <Col md={6}>
                                            <Form.Label className="text-dark fw-bold">Nombre del paciente</Form.Label>
                                            <Form.Select 
                                                    value={pacienteId}
                                                    onChange={(e)=>setPacienteId(e.target.value)}
                                                    >

                                                    <option value="">Seleccionar paciente</option>

                                                    {dataPacientes.map((paciente)=>(
                                                    <option key={paciente.id} value={paciente.id}>
                                                        {paciente.nombre} {paciente.apellidoP}
                                                    </option>
                                                    ))}

                                                    </Form.Select>
                                            </Col>

                                            <Col md={6}>
                                                <Form.Label className="text-dark fw-bold">Motivo de la consulta</Form.Label>

                                                <Form.Control value={motivo} onChange={(e)=>setMotivo(e.target.value)}/>
                                            </Col>

                                        </Row>
                                </div>

                                <div className="bg-white p-4 mb-4" style={{borderRadius:"20px",border:"1px solid #ddd",boxShadow:"0 2px 6px rgba(0,0,0,0.05)"}}>

                                    <Row>
                                        
                                         <Col md={8}>

                                            <Row>
                                                <Col md={12}> 

                                                    <Form.Label className="text-dark fw-bold"> Sintomas</Form.Label>

                                                    <Form.Control as="textarea"rows={4} value={sintomas} onChange={(e)=>setSintomas(e.target.value)}/>
                                                
                                                </Col>
                                            </Row>

                                             <Form.Label className="text-dark fw-bold mt-3">
                                                ¿Requiere tratamiento largo?
                                            </Form.Label>

                                            <Form.Select 
                                                value={tratamientoLargo}
                                                onChange={(e)=>setTratamientoLargo(e.target.value)}
                                            >
                                                <option value="">Seleccionar</option>
                                                <option value="si">Sí</option>
                                                <option value="no">No</option>
                                            </Form.Select>

                                            {tratamientoLargo === "si" && (
                                                <>
                                                    <Form.Label className="text-dark fw-bold mt-3">
                                                        Fecha de control
                                                    </Form.Label>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <StaticDateTimePicker
                                                        orientation="landscape"
                                                        value={fechaTratamiento}
                                                        onChange={(newValue)=>setFechaTratamiento(newValue)}
                                                        className="calendar-clean"
                                                        slotProps={{actionBar:{actions:[]}}}
                                                        />
                                                        </LocalizationProvider>
                                                </>
                                            )}


                                            <Row className="mt-3">

                                                 <Col md={12}>

                                                 <Form.Label className="fw-bold" style={{color:"#7c3aed"}}>
                                                    📝 Notas del médico
                                                </Form.Label>

                                             <Form.Control as="textarea"rows={8} placeholder="Escriba aquí observaciones adicionales, recomendaciones o notas importantes..." style={{background:"#faf5ff",border:"1px solid #e9d5ff",resize:"none"}}  value={notas} onChange={(e)=>setNotas(e.target.value)}/>
                                                 
                                                 
                                                 </Col>

                                            </Row>
                                               
                                         
                                        </Col>

                                           {/* LADO DERECHO */}

                                        {/* INPUT DE NOTAS */}
                                         <Col md={4}>
                                            <Form.Label className="text-dark fw-bold"> Examen físico</Form.Label>

                                            <Form.Control value={examen} onChange={(e)=>setExamen(e.target.value)} type="file"/> 

                                        </Col>






                                           

                                    </Row>



                                </div>


                                <br />

                            </div>


                            <Container>
                                <Row>
            

                                    <div className="text-end">
                                        <Button variant="danger" style={{width:"25%", marginRight: "10px" }}as={Link} to="/Medicos/recetas_medicas">Cancelar consulta</Button>

                                        <Button onClick={guardar} style={{width:"25%"}}> Finalizar Consulta</Button>
                                    
                                    </div>

                                </Row>

                            </Container>



                        </div>
                            )}
            </Layout_Medicos>

        </div>

    )
}
export default Consulta