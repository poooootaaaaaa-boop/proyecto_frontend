import { useState } from "react";
import Consulta from "./consulta"; 
import Recetas_medicas from "./recetas_medicas";
import Alta_pacientes from "./alta_pacientes";
import Lista_paciente from "./lista_paciente";

function ClinicaApp() {
  const [data, setData] = useState([]); 
   const [dataPacientes, setDataPacientes] = useState([]);

  return (
    <>
      <Consulta data={data} setData={setData} /> 
      <Recetas_medicas data={data} /> 


      <Alta_pacientes data={dataPacientes} setData={setDataPacientes} />
      <Lista_paciente data={dataPacientes}/>

    </>
  );
}

export default ClinicaApp;