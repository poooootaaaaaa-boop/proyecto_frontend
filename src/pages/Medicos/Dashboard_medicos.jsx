import { Link } from "react-router-dom";
import Layout_Medicos from "./Layout_Medicos";
import { colors } from "@mui/material";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {  CardContent, Typography,Chip} from "@mui/material";
import ArticleIcon from '@mui/icons-material/Article';
import "./Tablas.css";
function Dashboard_medicos() {
  return (
    <div>
      <Layout_Medicos>

          <div style={{display:"flex"}}>
            <h1>Hola Dr.Garcia</h1>
            <Button variant="primary" style={{ marginLeft: "700px"}}>Nueva Consulta</Button>
          </div>


          <h5>Bienvenido aqui estamos de nuevo Angelito cachondo</h5>
          <br />


          <div className="treatment-cards" style={{width:"800px", display:"flex"}}>
              <Card className="treatment-card">
              <CardContent>
                <div className="card-header">
                  <div>
                    <Typography className="medicine-name">
                      Citas del dia
                    </Typography>
                  </div>
                
                </div>

                <div className="card-info">

                  <div className="info-box" style={{textAlign:"center"}}>
                    <Typography variant="h3">18</Typography>
                  </div>
                </div>
              </CardContent>
            </Card>

              <Card className="treatment-card">
              <CardContent>
                <div className="card-header">
                  <div>
                    <Typography className="medicine-name">
                      Citas del dia
                    </Typography>
                  </div>
      
                </div>

                <div className="card-info">

                  <div className="info-box" style={{textAlign:"center"}}>
                    <Typography variant="h3">18</Typography>
                  </div>
                </div>
              </CardContent>
            </Card>


              <Card className="treatment-card">
              <CardContent>
                <div className="card-header">
                  <div>
                    <Typography className="medicine-name">
                      Citas del dia
                    </Typography>
                  </div>
                </div>

                <div className="card-info">

                  <div className="info-box" style={{textAlign:"center"}}>
                    <Typography variant="h3">18</Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          
        

          </div>

          <br />

          <h2>Pacientes en espera</h2>

          <div style={{display:"flex"}}>
              <div>
                hola
              </div>



              <div style={{ marginLeft: '870px', backgroundColor: '#F0F2F5',  borderRadius: '10px', padding: '10px', width: '300px', height: '170px', textAlign: 'center',  alignItems: 'center'}}>
                <h4>Acceso Rapidos</h4>
                <br />
                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                  <div  style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <PersonAddAlt1Icon style={{ fontSize: '40px', color: 'blue' }} />
                    <h5>Alta paciente</h5>
                  </div>

                  <div  style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <AccessTimeIcon style={{ fontSize: '40px', color: 'blue' }} />
                    <h5>Ver historial</h5>
                  </div>

                </div>

              </div>



          </div>
          <br />





          <h2>Citas del dia</h2>
          <br />

          <div style={{display:"flex"}}>
            <div style={{ width: '750px', marginLeft: '130px', marginTop: '10px'}}>
              <Table  className="agenda-table">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Paciente</th>
                    <th>Motivo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>14:30</td>
                    <td>Angelito</td>
                    <td>Consulta Medica</td>
                    <td>En espera</td>
                  </tr>

                  <tr>
                    <td>14:30</td>
                    <td>Erick</td>
                    <td>Consulta Medica</td>
                    <td>En espera</td>
                  </tr>
                </tbody>
              </Table>
            </div>



            <div style={{ marginLeft: '100px' }}>
              <h4>Ultimas Recetas</h4>

                <div className="info-box" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <ArticleIcon style={{ backgroundColor: "#6bb3ffef", color: "white", borderRadius: "10%", padding: "8px", fontSize: "35px" }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography className="info-value">
                      DRA. Elena Vargas
                    </Typography>
                    <Typography className="info-sub">
                      Medicina 10mg -30 días
                    </Typography>
                  </div>
                </div>

                  
                  <div className="info-box" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <ArticleIcon style={{ backgroundColor: "#6bb3ffef", color: "white", borderRadius: "10%", padding: "8px", fontSize: "35px" }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography className="info-value">
                        DRA. Juan Pérez
                      </Typography>
                      <Typography className="info-sub">
                        Medicina 5mg -15 días
                      </Typography>
                    </div>
                  </div>
              
            </div>
            

          </div>




        
      </Layout_Medicos>
    </div>

  );
}

export default Dashboard_medicos;   








