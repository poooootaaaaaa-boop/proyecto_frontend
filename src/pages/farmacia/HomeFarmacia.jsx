import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import StatCard from "../../components/farmacia/StatCard";
import { Container, Row, Col, Card, Table } from "react-bootstrap";

export default function HomeFarmacia() {
  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1 bg-light min-vh-100 p-4">
        <Topbar />

        <h4 className="mt-3">Próximas recetas</h4>

        <Row className="mt-3">
          <Col md={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Paciente</th>
                      <th>Hora</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Juan Pérez</td>
                      <td>10:30</td>
                      <td><span className="badge bg-danger">Urgente</span></td>
                      <td>⋮</td>
                    </tr>
                    <tr>
                      <td>Juan Pérez</td>
                      <td>10:30</td>
                      <td><span className="badge bg-primary">Normal</span></td>
                      <td>⋮</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <StatCard title="Ventas" value="1500" subtitle="2.4% from last month" />
            <br />
            <StatCard title="Recetas por validar" value="12" />
            <br />
            <StatCard title="Alerta de Stock" value="5" />
          </Col>
        </Row>
      </div>
    </div>
  );
}