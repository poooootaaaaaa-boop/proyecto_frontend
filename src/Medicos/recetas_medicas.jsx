import Layout_Medicos from "./Layout_Medicos"
import {  CardContent, Typography,Chip, Card} from "@mui/material";
import Form from 'react-bootstrap/Form';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import Button from 'react-bootstrap/Button';
import DownloadIcon from '@mui/icons-material/Download';

function recetas_medicas(){
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
        <br />




        <div className="container mt-3">

            <div className="bg-white p-4" style={{ borderRadius: "20px",border: "1px solid #ddd",boxShadow: "0 2px 6px rgba(0,0,0,0.05)"}}>

                {/* Buscador centrado */}
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 position-relative">

                        <Form>
                            <Form.Group>

                                <Form.Control type="text" placeholder="Nombre del paciente" style={{ paddingRight: "50px" }}/>
                                <SearchIcon onClick={buscarPaciente} style={{ position: "absolute",right: "20px",top: "50%",transform: "translateY(-50%)",color: "gray",cursor: "pointer"}}/>

                            </Form.Group>
                        </Form>

                    </div>
                </div>


            </div>

        </div>


         <br />
         <br />


            <div className="container">
                <div className="row g-4">

                    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <Card className="treatment-card">
                            <CardContent>

                                <div>
                                    <Typography className="medicine-name">Carlos Acencio Diaz</Typography>

                                    <Typography style={{fontSize: "13px",color: "gray"}}>Emitida: 25/02/2026</Typography>
                                </div>

                                <div style={{ textAlign:"center", marginTop:"10px" }}>
                                    <Button variant="primary"><DownloadIcon/> Pdf</Button>
                                </div>

                            </CardContent>
                        </Card>

                    </div>



                     <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <Card className="treatment-card">
                            <CardContent>

                                <div>
                                    <Typography className="medicine-name">Carlos Acencio Diaz</Typography>

                                    <Typography style={{fontSize: "13px",color: "gray"}}>Emitida: 25/02/2026</Typography>
                                </div>

                                <div style={{ textAlign:"center", marginTop:"10px" }}>
                                    <Button variant="primary"><DownloadIcon/> Pdf</Button>
                                </div>

                            </CardContent>
                        </Card>

                    </div>




                     <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <Card className="treatment-card">
                            <CardContent>

                                <div>
                                    <Typography className="medicine-name">Carlos Acencio Diaz</Typography>

                                    <Typography style={{fontSize: "13px",color: "gray"}}>Emitida: 25/02/2026</Typography>
                                </div>

                                <div style={{ textAlign:"center", marginTop:"10px" }}>
                                    <Button variant="primary"><DownloadIcon/> Pdf</Button>
                                </div>

                            </CardContent>
                        </Card>

                    </div>




                     <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <Card className="treatment-card">
                            <CardContent>

                                <div>
                                    <Typography className="medicine-name">Carlos Acencio Diaz</Typography>

                                    <Typography style={{fontSize: "13px",color: "gray"}}>Emitida: 25/02/2026</Typography>
                                </div>

                                <div style={{ textAlign:"center", marginTop:"10px" }}>
                                    <Button variant="primary"><DownloadIcon/> Pdf</Button>
                                </div>

                            </CardContent>
                        </Card>

                    </div>




                     <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <Card className="treatment-card">
                            <CardContent>

                                <div>
                                    <Typography className="medicine-name">Carlos Acencio Diaz</Typography>

                                    <Typography style={{fontSize: "13px",color: "gray"}}>Emitida: 25/02/2026</Typography>
                                </div>

                                <div style={{ textAlign:"center", marginTop:"10px" }}>
                                    <Button variant="primary"><DownloadIcon/> Pdf</Button>
                                </div>

                            </CardContent>
                        </Card>

                    </div>

                </div>
            </div>


    </Layout_Medicos>


    )

    

}

export default recetas_medicas