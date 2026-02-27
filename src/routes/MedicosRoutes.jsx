import { useState } from "react"; // 1. Importa useState
import Layout_Medicos from "../pages/Medicos/Layout_Medicos";
import Dashboard_medicos from "../pages/Medicos/Dashboard_medicos";
import Lista_paciente from "../pages/Medicos/lista_paciente";
import Recetas_medicas from "../pages/Medicos/recetas_medicas";
import Consulta from "../pages/Medicos/consulta";
import Alta_pacientes from "../pages/Medicos/alta_pacientes";
import { Routes, Route } from "react-router-dom";

export default function MedicosRoute(){
    const [pacientes, setPacientes] = useState([]);

    return(
        <Routes>
          <Route path="/angelito-cachondo" element={<Layout_Medicos />} />
          
          <Route path="/recetas_medicas" element={<Recetas_medicas data={pacientes} />} />
          
          <Route path="/lista_paciente" element={<Lista_paciente data={pacientes}/>} />
          <Route path="/Dashboard_medicos" element={<Dashboard_medicos />} />

          <Route path="/consulta" element={<Consulta data={pacientes} setData={setPacientes} />} />

           <Route path="/alta_pacientes" element={<Alta_pacientes data={pacientes} setData={setPacientes} />} />
        </Routes>
    )
}