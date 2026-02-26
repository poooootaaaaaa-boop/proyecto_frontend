import { useState } from "react";
import Alta_pacientes from "./alta_pacientes"; 
import Recetas_medicas from "./recetas_medicas";

function ClinicaApp() {
  const [data, setData] = useState([]); 

  return (
    <>
      <Alta_pacientes data={data} setData={setData} /> 
      <Recetas_medicas data={data} /> 
    </>
  );
}

export default ClinicaApp;