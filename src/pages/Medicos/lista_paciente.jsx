import Layout_Medicos from "./Layout_Medicos"
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import SearchIcon from '@mui/icons-material/Search';
import Button from 'react-bootstrap/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Typography} from "@mui/material";
import "./Tablas.css";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Datagrid from "./Datagrid";
import { useNavigate } from "react-router-dom";



function lista_paciente({data=[]}) { 
      
    
    const buscarPaciente = () => {
    console.log("Buscando paciente")
  }


  const navigate = useNavigate();

  const verHistorial = (paciente) => {
   navigate("/Medicos/historial", { state: { paciente } });
};
    return (
        <div>
            <Layout_Medicos>
                <br />
                <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: "600" }}>Lista de pacientes</h1>
                <Typography className="medicine-name" style={{color:"gray"}}>Consulte y descargue las recetas médicas de sus pacientes.</Typography>
                <br />
                <br />










                    <div className="container mt-3">

                        <div className="bg-white p-4" style={{borderRadius:"20px",border:"1px solid #e5e7eb",boxShadow:"0 2px 10px rgba(0,0,0,0.05)"}}>

                                <div className="row justify-content-center">

                                    <div className="col-lg-10">

                                        <div style={{position:"relative"}}>

                                            <Form.Control type="text"placeholder="Buscar por nombre, DNI o expediente..."style={{height:"55px",borderRadius:"30px",background:"#f3f4f6",border:"none",paddingLeft:"20px",paddingRight:"60px"}}/>

                                            <SearchIcon onClick={buscarPaciente}style={{position:"absolute",right:"10px",top:"50%",transform:"translateY(-50%)",background:"#1d4ed8",color:"white",padding:"8px",borderRadius:"50%",cursor:"pointer",fontSize:"28px"}}/>

                                        </div>

                                    </div>

                                </div>

                                <div className="row mt-4 align-items-center">

                                        <div className="col-md-6">

                                            <Typography style={{fontSize:"12px",color:"#9ca3af",fontWeight:"600"}}>ULTIMA VISITA</Typography>

                                                <div style={{display:"flex",alignItems:"center",background:"#f3f4f6",borderRadius:"30px",padding:"10px 15px",width:"250px",marginTop:"5px"}}>

                                                    <CalendarMonthIcon style={{color:"#6b7280",marginRight:"10px"}}/>

                                                    <span style={{color:"#6b7280",fontSize:"14px"}}>Seleccionar fecha</span>

                                                </div>

                                        </div>


                            

                                        <div className="col-md-6 text-end">

                                            <Button style={{background:"#1d4ed8",border:"none",borderRadius:"30px",padding:"12px 25px",fontWeight:"600"}} as={Link} to="/Medicos/alta_pacientes">+ Nuevo Paciente</Button>

                                        </div>

                                 </div>


                        </div>

                    </div>

                <br />
                <br />
                

        <div style={{width:"1200px",margin:"0 auto",marginTop:"20px",background:"white",borderRadius:"20px",border:"1px solid #e5e7eb",boxShadow:"0 2px 10px rgba(0,0,0,0.05)",overflow:"hidden"}}>

            <Table borderless hover>

                    <thead style={{background:"#f3f4f6"}}>

                        <tr>

                            <th style={{padding:"20px",color:"#94a3b8",fontSize:"12px"}}>PACIENTE</th>

                            <th style={{padding:"20px",color:"#94a3b8",fontSize:"12px"}}>ULTIMA CITA</th>

                            <th style={{ padding:"20px",color:"#94a3b8",fontSize:"12px",textAlign:"right"}}>ACCIONES</th>

                        </tr>

                    </thead>


                    <tbody>

                        {data.map((paciente,index)=> (

                            <tr key={index} style={{borderTop:"1px solid #f1f5f9"}}>


                            <td style={{padding:"20px"}}>

                                <div style={{display:"flex",alignItems:"center"}}>


                                    <div style={{width:"40px",height:"40px",borderRadius:"50%",background:"#dbeafe",display:"flex",alignItems:"center",justifyContent:"center",color:"#1d4ed8",fontWeight:"bold",marginRight:"15px"}}>

                                        {paciente.nombre?.charAt(0)}
                                        {paciente.apellidoP?.charAt(0)}

                                    </div>


                                    <div>

                                        <div style={{fontWeight:"600"}}>{paciente.nombre} {paciente.apellidoP}</div>

                                        <div style={{fontSize:"12px",color:"#94a3b8" }}> Paciente registrado </div>

                                    </div>

                                </div>

                            </td>

                                <td style={{padding:"20px"}}> <span style={{color:"#475569"}}>Sin cita</span></td>


                                <td style={{padding:"20px",textAlign:"right"}}> 
                                    <Button style={{background:"#e0e7ff",color:"#eaeaea",border:"none",borderRadius:"20px",padding:"8px 18px",fontWeight:"500"}} onClick={() => verHistorial(paciente)}>
                                    Ver Expediente
                                    </Button>

                                </td>


                            </tr>

                        ))}

                    </tbody>
            </Table>
        </div>



            </Layout_Medicos>

            
        </div>
    )
}

export default lista_paciente;
