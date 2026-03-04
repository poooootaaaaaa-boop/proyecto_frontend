import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import "./dashboardFarmacia.css";
import Chart from "react-apexcharts";

export default function DashboardFarmacia() {
  // 🔹 Top productos (Bar moderna)
  const topProductos = {
    series: [
      {
        name: "Solicitudes",
        data: [45, 38, 30, 22, 18],
      },
    ],
    options: {
      chart: {
        type: "bar",
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: "45%",
        },
      },
      dataLabels: { enabled: false },
      colors: ["#2563eb"],
      xaxis: {
        categories: [
          "Paracetamol",
          "Ibuprofeno",
          "Amoxicilina",
          "Vitamina C",
          "Aspirina",
        ],
        labels: { style: { colors: "#64748b" } },
      },
      yaxis: {
        labels: { style: { colors: "#64748b" } },
      },
      grid: {
        borderColor: "#e2e8f0",
        strokeDashArray: 4,
      },
    },
  };

  // 🔹 Top distribuidores (Donut moderna)
  const topDistribuidores = {
    series: [40, 30, 20, 10],
    options: {
      chart: {
        type: "donut",
      },
      labels: [
        "Distribuidor A",
        "Distribuidor B",
        "Distribuidor C",
        "Distribuidor D",
      ],
      colors: ["#2563eb", "#1e40af", "#60a5fa", "#93c5fd"],
      legend: {
        position: "bottom",
      },
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
          },
        },
      },
    },
  };

  return (
    <div className="home-layout">
      <Sidebar />

      <div className="home-content-modern">
        <Topbar />

        <h2 className="main-title">Dashboard de Farmacia</h2>

        {/* 🔹 CARDS */}
        <div className="stats-grid">
          <div className="stat-card-modern">
            <small>Recetas del día</small>
            <h3>14</h3>
            <span className="stat-badge primary">Hoy</span>
          </div>

          <div className="stat-card-modern">
            <small>Recetas pendientes</small>
            <h3>6</h3>
            <span className="stat-badge warning">Pendientes</span>
          </div>

          <div className="stat-card-modern">
            <small>Productos por caducar</small>
            <h3>4</h3>
            <span className="stat-badge danger">Atención</span>
          </div>

          <div className="stat-card-modern">
            <small>Total de productos</small>
            <h3>248</h3>
            <span className="stat-badge success">Inventario</span>
          </div>
        </div>

        {/* 🔹 TABLA MODERNA */}
        <div className="card-modern table-card">
          <h5 className="section-title">Recetas Pendientes</h5>

          <div className="table-modern">
            <div className="table-header-modern">
              <span>Paciente</span>
              <span>Medicamento</span>
              <span>Hora</span>
              <span>Prioridad</span>
              <span></span>
            </div>

            <div className="table-row-modern">
              <div>Juan Pérez</div>
              <div>Amoxicilina 500 mg</div>
              <div>10:30</div>
              <div>
                <span className="status-badge urgent">Urgente</span>
              </div>
              <div className="row-action">⋮</div>
            </div>

            <div className="table-row-modern">
              <div>Ana López</div>
              <div>Paracetamol 750 mg</div>
              <div>11:15</div>
              <div>
                <span className="status-badge normal">Normal</span>
              </div>
              <div className="row-action">⋮</div>
            </div>
          </div>
        </div>

        {/* 🔹 GRÁFICAS MODERNAS */}
        <div className="charts-grid">
          <div className="card-modern">
            <h5 className="section-title">Top Productos</h5>
            <Chart
              options={topProductos.options}
              series={topProductos.series}
              type="bar"
              height={320}
            />
          </div>

          <div className="card-modern">
            <h5 className="section-title">Top Distribuidores</h5>
            <Chart
              options={topDistribuidores.options}
              series={topDistribuidores.series}
              type="donut"
              height={320}
            />
          </div>
        </div>
      </div>
    </div>
  );
}