import { Form, FormControl } from "react-bootstrap";

export default function Topbar() {
  return (
    <div className="mb-4">
      <Form>
        <FormControl
          type="search"
          placeholder="Buscar"
          style={{ maxWidth: "400px", borderRadius: "20px" }}
        />
      </Form>
    </div>
  );
}