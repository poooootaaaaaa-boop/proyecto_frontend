import { Container, Row, Col, Table, Badge } from "react-bootstrap";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import StatCard from "../../components/farmacia/StatCard";
import Chart from "react-apexcharts";

export default function DashboardFarmacia() {
  // 🔹 Top productos
  const topProductos = {
    series: [
      {
        name: "Solicitudes",
        data: [45, 38, 30, 22, 18],
      },
    ],
    options: {
      chart: { type: "bar" },
      title: { text: "Top Productos" },
      xaxis: {
        categories: [
          "Paracetamol",
          "Ibuprofeno",
          "Amoxicilina",
          "Vitamina C",
          "Aspirina",
        ],
      },
    },
  };

  // 🔹 Top distribuidores
  const topDistribuidores = {
    series: [40, 30, 20, 10],
    options: {
      chart: { type: "pie" },
      title: { text: "Top Distribuidores" },
      labels: [
        "Distribuidor A",
        "Distribuidor B",
        "Distribuidor C",
        "Distribuidor D",
      ],
    },
  };

  return (
    <div style={{ display: "flex", background: "#f7f7f7" }}>
      <Sidebar />

      <Container fluid className="p-4">
        <Topbar />

        <h4 className="mb-4">Dashboard de Farmacia</h4>

        {/* 🔹 CARDS */}
        <Row className="mb-4">
          <Col md={3}>
            <StatCard
              title="Recetas del día"
              value="14"
              badge="Hoy"
              badgeColor="primary"
            />
          </Col>

          <Col md={3}>
            <StatCard
              title="Recetas pendientes"
              value="6"
              badge="Pendientes"
              badgeColor="warning"
            />
          </Col>

          <Col md={3}>
            <StatCard
              title="Productos por caducar"
              value="4"
              badge="Atención"
              badgeColor="danger"
            />
          </Col>

          <Col md={3}>
            <StatCard
              title="Total de productos"
              value="248"
              badge="Inventario"
              badgeColor="success"
            />
          </Col>
        </Row>

        {/* 🔹 TABLA */}
        <h5 className="mb-3">Recetas Pendientes</h5>

        <Table hover responsive className="bg-white rounded shadow-sm mb-5">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Medicamento</th>
              <th>Hora</th>
              <th>Prioridad</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Juan Pérez</td>
              <td>Amoxicilina 500 mg</td>
              <td>10:30</td>
              <td>
                <Badge bg="danger">Urgente</Badge>
              </td>
              <td>⋮</td>
            </tr>
            <tr>
              <td>Ana López</td>
              <td>Paracetamol 750 mg</td>
              <td>11:15</td>
              <td>
                <Badge bg="secondary">Normal</Badge>
              </td>
              <td>⋮</td>
            </tr>
          </tbody>
        </Table>

        {/* 🔹 GRÁFICAS */}
        <Row>
          <Col md={6}>
            <div className="bg-white p-3 rounded shadow-sm">
              <Chart
                options={topProductos.options}
                series={topProductos.series}
                type="bar"
                height={300}
              />
            </div>
          </Col>

          <Col md={6}>
            <div className="bg-white p-3 rounded shadow-sm">
              <Chart
                options={topDistribuidores.options}
                series={topDistribuidores.series}
                type="pie"
                height={300}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}