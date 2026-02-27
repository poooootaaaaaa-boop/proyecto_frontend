
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import { Button, Table, Badge, Card } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function Medicamentos() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, background: "#f7f7f7", minHeight: "100vh" }}>
        <Topbar />

        <div style={{ padding: "30px" }}>
          {/* HEADER */}
          <div
            className="d-flex justify-content-between align-items-center mb-4"
          >
            <h4>Medicamentos</h4>

            <Button
              as={NavLink}
              to="/farmacia/AgregarMedicamento"
              variant="primary"
            >
              Agregar medicamento
            </Button>
          </div>
            {/*===== Tbale =====*/}
            <Card className="p-4 rounded-4 border-0">
            <Table responsive borderless>
              <thead>
                <tr className="text-muted">
                  <th>IMAGEN</th>
                  <th>NOMBRE</th>
                  <th>CATEGORIA</th>
                  <th>PRESENTACION</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td><strong></strong></td>
                  <td>
                   Amoxicilin  <br />
                    <small className="text-success">500g</small>
                  </td>
                  <td>oct 2025</td>
                  <td><Badge bg="success">Tableta</Badge></td>
                  <td>⋮</td>
                </tr>

                <tr>
                  <td><strong></strong></td>
                  <td>
                    200 units <br />
                    <small className="text-danger">optimal level</small>
                  </td>
                  <td>oct 2025</td>
                  <td><Badge bg="success">Tableta</Badge></td>
                  <td>⋮</td>
                </tr>

                <tr>
                  <td><strong></strong></td>
                  <td>
                    200 units <br />
                    <small className="text-danger">optimal level</small>
                  </td>
                  <td>oct 2025</td>
                  <td><Badge bg="danger">in stock</Badge></td>
                  <td>⋮</td>
                </tr>

                <tr>
                  <td><strong></strong></td>
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
    )

}