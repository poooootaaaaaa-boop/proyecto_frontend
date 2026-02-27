import { Card, Table, Badge } from "react-bootstrap";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";

export default function Inventario() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, background: "#f7f7f7", minHeight: "100vh" }}>
        <Topbar />

        <div style={{ padding: "30px" }}>
          <h4 className="mb-4">Inventario</h4>

          {/* ====== CARDS ====== */}
          <div className="d-flex gap-3 mb-4">
            <Card className="p-3 flex-fill rounded-4 border-0">
              <h6>Total Items</h6>
              <h2>1,240</h2>
              <small className="text-success">2.4% from last month</small>
            </Card>

            <Card className="p-3 flex-fill rounded-4 border-0">
              <div className="d-flex justify-content-between">
                <h6>Low Stock</h6>
                <Badge bg="success">+12%</Badge>
              </div>
              <h2>12</h2>
              <small className="text-danger">6 pendientes para la tarde</small>
            </Card>

            <Card className="p-3 flex-fill rounded-4 border-0">
              <h6>Expired</h6>
              <h2>2</h2>
              <small className="text-danger">6 pendientes para la tarde</small>
            </Card>
          </div>

          {/* ====== TABLE ====== */}
          <Card className="p-4 rounded-4 border-0">
            <Table responsive borderless>
              <thead>
                <tr className="text-muted">
                  <th>MEDICATION NAME & CATEGORY</th>
                  <th>TOTAL STOCK</th>
                  <th>LOTES Y CADUCIDAD</th>
                  <th>STATUS</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td><strong>Amoxicilin 500 mg</strong></td>
                  <td>
                    400 units <br />
                    <small className="text-success">optimal level</small>
                  </td>
                  <td>oct 2025</td>
                  <td><Badge bg="success">in stock</Badge></td>
                  <td>⋮</td>
                </tr>

                <tr>
                  <td><strong>Amoxicilin 500 mg</strong></td>
                  <td>
                    200 units <br />
                    <small className="text-danger">optimal level</small>
                  </td>
                  <td>oct 2025</td>
                  <td><Badge bg="danger">in stock</Badge></td>
                  <td>⋮</td>
                </tr>

                <tr>
                  <td><strong>Amoxicilin 500 mg</strong></td>
                  <td>
                    200 units <br />
                    <small className="text-danger">optimal level</small>
                  </td>
                  <td>oct 2025</td>
                  <td><Badge bg="danger">in stock</Badge></td>
                  <td>⋮</td>
                </tr>

                <tr>
                  <td><strong>Amoxicilin 500 mg</strong></td>
                  <td>
                    200 units <br />
                    <small className="text-success">optimal level</small>
                  </td>
                  <td>oct 2025</td>
                  <td><Badge bg="success">in stock</Badge></td>
                  <td>⋮</td>
                </tr>
              </tbody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}