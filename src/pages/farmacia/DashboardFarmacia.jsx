import { Container, Row, Col, Table, Badge } from "react-bootstrap";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import StatCard from "../../components/farmacia/StatCard";
export default function DashboardFarmacia() {
  return (
    <div style={{ display: "flex", background: "#f7f7f7" }}>
      <Sidebar />

      <Container fluid className="p-4">
        <Topbar />

        <h4 className="mb-4">Dashboard de Farmacia</h4>

        {/* Cards */}
        <Row className="mb-4">
          <Col md={4}>
            <StatCard
              title="Ventas del día"
              value="1,240"
              badge="2.4% vs mes pasado"
              badgeColor="success"
            />
          </Col>
          <Col md={4}>
            <StatCard
              title="Transacciones"
              value="12"
              badge="+12%"
              badgeColor="success"
            />
          </Col>
          <Col md={4}>
            <StatCard
              title="Recetas pendientes"
              value="2"
              badge="8 pendientes para la tarde"
              badgeColor="warning"
            />
          </Col>
        </Row>

        {/* Tabla */}
        <h5 className="mb-3">Recetas Pendientes</h5>

        <Table hover responsive className="bg-white rounded shadow-sm">
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
              <td>Juan Pérez</td>
              <td>Amoxicilina 500 mg</td>
              <td>10:30</td>
              <td>
                <Badge bg="secondary">Normal</Badge>
              </td>
              <td>⋮</td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </div>
  );
}
