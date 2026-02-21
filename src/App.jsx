import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Treatments from "./pages/Treatments";

export default function App() {

  return (

    <Routes>

      <Route path="/" element={<Dashboard />} />

      <Route path="/citas" element={<Appointments />} />

      <Route path="/tratamientos" element={<Treatments />} />

    </Routes>

  );

}