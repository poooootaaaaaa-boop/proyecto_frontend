import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";

export default function Recetas() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, background: "#f7f7f7", minHeight: "100vh" }}>
        <Topbar />

        <div style={{ padding: "30px" }}>
          <h4>Recetas Recibidas</h4>

          {/* Aquí va TODO el contenido que se ve en la imagen */}
          {/* tablas, tabs, cards, etc */}
        </div>
      </div>
    </div>
  );
}