import { useState } from "react"; // 1. Importa useState
import Layout_Medicos from "../pages/Medicos/Layout_Medicos";
import Dashboard_medicos from "../pages/Medicos/Dashboard_medicos";
import Lista_paciente from "../pages/Medicos/lista_paciente";
import Recetas_medicas from "../pages/Medicos/recetas_medicas";
import Consulta from "../pages/Medicos/consulta";
import Alta_pacientes from "../pages/Medicos/alta_pacientes";
import Historial from "../pages/Medicos/historial";
import { Routes, Route,BrowserRouter } from "react-router-dom";
import Citas from "../pages/Medicos/citas";
import Agenda from "../pages/Medicos/agenda";
import Tratamientos_largos from "../pages/Medicos/tratamientos_largos";

import { useLocation } from "react-router-dom";

export default function MedicosRoute(){
    const [pacientes, setPacientes] = useState([]);
    const [consultas, setConsultas] = useState([]);
    const [dataPacientes, setDataPacientes] = useState([]);
    const [dataCitas, setDataCitas] = useState([]);
    const [data, setData] = useState([]); 


    return(
        <Routes>
          <Route path="/angelito-cachondo" element={<Layout_Medicos />} />
           
          
         
         
         
          <Route path="/recetas_medicas" element={<Recetas_medicas data={pacientes} />} />
          <Route path="/consulta" element={<Consulta data={pacientes} setData={setPacientes} dataPacientes={dataPacientes} />} />{/* solo agregue esto dataPacientes={dataPacientes} */}
          <Route path="/historial" element={<Historial data={pacientes} />} />
           

    
        <Route path="/alta_pacientes" element={<Alta_pacientes data={dataPacientes} setData={setDataPacientes} />} />
    

        <Route path="/lista_paciente" element={<Lista_paciente data={dataPacientes}/>} />






        <Route path="/citas" element={<Citas data={dataCitas} setData={setDataCitas} />} />
        <Route path="/agendar-cita" element={<Agenda data={dataCitas} />} />
        
        <Route path="/Dashboard_medicos" element={
            <Dashboard_medicos 
            citas={dataCitas}
            consultas={pacientes}/>} />



        
    
        <Route path="/Medicos/citas" element={<Citas/>} />
        <Route path="/Medicos/consulta" element={<Consulta/>} />
        <Route path="/Medicos/alta_pacientes" element={<Alta_pacientes/>} />



        <Route path="/tratamientos_largos" element={<Tratamientos_largos/>} />
        



        
        
       
        
       

        
        
    





        </Routes>
    )
}