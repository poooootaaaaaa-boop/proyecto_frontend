import { useState } from "react";
import Consulta from "./consulta"; 
import Recetas_medicas from "./recetas_medicas";
import Alta_pacientes from "./alta_pacientes";
import Lista_paciente from "./lista_paciente";

function ClinicaApp() {
  const [data, setData] = useState([]); 

  return (
    <>
      <Consulta data={data} setData={setData} /> 
      <Recetas_medicas data={data} /> 


      <Alta_pacientes data={data} setData={setData} />
      <Lista_paciente data={data}/>

    </>
  );
}

export default ClinicaApp;