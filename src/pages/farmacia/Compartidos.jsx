import { useEffect, useState } from "react";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";

/** Mensaje flotante de éxito / error (usar con useAviso). */
export function Aviso({ aviso, onClose }) {
  if (!aviso) return null;
  return (
    <Alert variant={aviso.tipo} dismissible onClose={onClose} className="gp-aviso">
      {aviso.mensaje}
    </Alert>
  );
}

export function Cargando() {
  return (
    <div className="gp-empty">
      <Spinner animation="border" size="sm" /> <span className="ms-2">Cargando…</span>
    </div>
  );
}

export function Vacio({ icono = "bi-inbox", texto }) {
  return (
    <div className="gp-empty">
      <i className={`bi ${icono}`}></i>
      <p>{texto}</p>
    </div>
  );
}

const CONFIG_RESOLVER = {
  aprobado: { titulo: "Aprobar solicitud", variante: "success", boton: "Aprobar", obligatorio: false },
  rechazado: { titulo: "Rechazar solicitud", variante: "danger", boton: "Rechazar", obligatorio: true },
  cancelado: { titulo: "Cancelar solicitud", variante: "secondary", boton: "Cancelar solicitud", obligatorio: false },
};

/** Confirmación para aprobar / rechazar / cancelar un permiso o vacaciones. */
export function ResolverModal({ show, accion, resumen, busy, onConfirm, onHide }) {
  const [obs, setObs] = useState("");

  useEffect(() => {
    if (show) setObs("");
  }, [show]);

  const cfg = CONFIG_RESOLVER[accion] || CONFIG_RESOLVER.aprobado;
  const faltaObs = cfg.obligatorio && !obs.trim();

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{cfg.titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-3">{resumen}</p>
        <Form.Group>
          <Form.Label>Observaciones {cfg.obligatorio ? "(obligatorio)" : "(opcional)"}</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            maxLength={255}
            value={obs}
            onChange={(e) => setObs(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide} disabled={busy}>
          Volver
        </Button>
        <Button variant={cfg.variante} disabled={busy || faltaObs} onClick={() => onConfirm(obs.trim())}>
          {busy ? <Spinner size="sm" /> : cfg.boton}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}