import React, { useState } from 'react';
import '../seguro/Registro.css'; // Asegúrate de tener tus estilos

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    curp: '',
    cedulaProfesional: '',
    especialidad: '',
    rfc: '',
    razonSocial: '',
    registroSanitario: '',
    licenciaSanitaria: '',
    password: '',
    confirmPassword: '',
    tipoUsuario: 'paciente', // paciente, medico, clinica, farmacia
    aceptaTerminos: false,
    aceptaPrivacidad: false,
    aceptaConfidencialidad: false,
    aceptaContrato: false
  });

  const [showTerminos, setShowTerminos] = useState(false);
  const [showPrivacidad, setShowPrivacidad] = useState(false);
  const [showContrato, setShowContrato] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.aceptaTerminos) {
      alert('Debes aceptar los Términos y Condiciones para continuar.');
      return;
    }
    
    if (!formData.aceptaPrivacidad) {
      alert('Debes aceptar el Aviso de Privacidad para continuar.');
      return;
    }

    // Validaciones específicas por tipo de usuario
    if (formData.tipoUsuario === 'medico' && !formData.aceptaConfidencialidad) {
      alert('Debes aceptar el compromiso de confidencialidad médica.');
      return;
    }

    if ((formData.tipoUsuario === 'clinica' || formData.tipoUsuario === 'farmacia') && !formData.aceptaContrato) {
      alert('Debes aceptar el Contrato de Servicio.');
      return;
    }

    console.log('Datos del registro:', formData);
    alert('¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.');
  };

  // Texto de Términos y Condiciones (resumido para el checkbox)
  const terminosTexto = `Al crear mi cuenta como ${formData.tipoUsuario === 'paciente' ? 'PACIENTE' : 
    formData.tipoUsuario === 'medico' ? 'MÉDICO' : 
    formData.tipoUsuario === 'clinica' ? 'CLÍNICA' : 'FARMACIA'}, acepto que:

• He leído y comprendo los Términos y Condiciones de Cliniservis.
• Acepto las reglas de uso de la plataforma.
• Soy responsable de la información que proporciono.
• Acepto las políticas de pago, cancelación y reembolso.
• El mal uso de la plataforma resultará en la suspensión de mi cuenta.
• Cliniservis puede modificar estos términos con previo aviso.`;

  // Componente Modal para mostrar documentos completos
  const ModalDocumento = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;
    
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{title}</h2>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <pre>{content}</pre>
          </div>
          <div className="modal-footer">
            <button onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <div className="registro-header">
          <h1>CLINISERVIS</h1>
          <p>Crea tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tipo de usuario */}
          <div className="form-group">
            <label>Tipo de usuario *</label>
            <select 
              name="tipoUsuario" 
              value={formData.tipoUsuario} 
              onChange={handleChange}
              className="form-control"
            >
              <option value="paciente">Paciente</option>
              <option value="medico">Médico</option>
              <option value="clinica">Clínica</option>
              <option value="farmacia">Farmacia</option>
            </select>
          </div>

          {/* Campos comunes */}
          <div className="form-group">
            <label>Nombre completo *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez Gómez"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Correo electrónico *</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono *</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="55 1234 5678"
              className="form-control"
              required
            />
          </div>

          {/* Campos específicos por tipo de usuario */}
          
          {/* Paciente */}
          {formData.tipoUsuario === 'paciente' && (
            <div className="form-group">
              <label>CURP</label>
              <input
                type="text"
                name="curp"
                value={formData.curp}
                onChange={handleChange}
                placeholder="PERE800101HDFRRL09"
                className="form-control"
              />
            </div>
          )}

          {/* Médico */}
          {formData.tipoUsuario === 'medico' && (
            <>
              <div className="form-group">
                <label>Cédula profesional *</label>
                <input
                  type="text"
                  name="cedulaProfesional"
                  value={formData.cedulaProfesional}
                  onChange={handleChange}
                  placeholder="12345678"
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Especialidad</label>
                <input
                  type="text"
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                  placeholder="Cardiología, Pediatría, etc."
                  className="form-control"
                />
              </div>
            </>
          )}

          {/* Clínica */}
          {formData.tipoUsuario === 'clinica' && (
            <>
              <div className="form-group">
                <label>RFC *</label>
                <input
                  type="text"
                  name="rfc"
                  value={formData.rfc}
                  onChange={handleChange}
                  placeholder="XAXX010101000"
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Razón social</label>
                <input
                  type="text"
                  name="razonSocial"
                  value={formData.razonSocial}
                  onChange={handleChange}
                  placeholder="Servicios Médicos, S.A. de C.V."
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Registro sanitario *</label>
                <input
                  type="text"
                  name="registroSanitario"
                  value={formData.registroSanitario}
                  onChange={handleChange}
                  placeholder="1234567890"
                  className="form-control"
                  required
                />
              </div>
            </>
          )}

          {/* Farmacia */}
          {formData.tipoUsuario === 'farmacia' && (
            <>
              <div className="form-group">
                <label>RFC *</label>
                <input
                  type="text"
                  name="rfc"
                  value={formData.rfc}
                  onChange={handleChange}
                  placeholder="XAXX010101000"
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Razón social</label>
                <input
                  type="text"
                  name="razonSocial"
                  value={formData.razonSocial}
                  onChange={handleChange}
                  placeholder="Farmacias, S.A. de C.V."
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Licencia sanitaria *</label>
                <input
                  type="text"
                  name="licenciaSanitaria"
                  value={formData.licenciaSanitaria}
                  onChange={handleChange}
                  placeholder="1234567890"
                  className="form-control"
                  required
                />
              </div>
            </>
          )}

          {/* Contraseña */}
          <div className="form-group">
            <label>Contraseña *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirmar contraseña *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              className="form-control"
              required
            />
          </div>

          {/* CHECKBOX DE TÉRMINOS Y CONDICIONES */}
          <div className="checkbox-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                name="aceptaTerminos"
                checked={formData.aceptaTerminos}
                onChange={handleChange}
                id="aceptaTerminos"
                required
              />
              <label htmlFor="aceptaTerminos">
                <strong>Acepto los Términos y Condiciones de uso de Cliniservis</strong>
                <button 
                  type="button" 
                  className="link-button"
                  onClick={() => setShowTerminos(true)}
                >
                  [Ver Términos y Condiciones completos]
                </button>
              </label>
            </div>
            <div className="checkbox-details">
              <p>{terminosTexto}</p>
            </div>
          </div>

          {/* CHECKBOX DE AVISO DE PRIVACIDAD */}
          <div className="checkbox-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                name="aceptaPrivacidad"
                checked={formData.aceptaPrivacidad}
                onChange={handleChange}
                id="aceptaPrivacidad"
                required
              />
              <label htmlFor="aceptaPrivacidad">
                <strong>Acepto el Aviso de Privacidad de Cliniservis</strong>
                <button 
                  type="button" 
                  className="link-button"
                  onClick={() => setShowPrivacidad(true)}
                >
                  [Ver Aviso de Privacidad completo]
                </button>
              </label>
            </div>
            <div className="checkbox-details">
              <p>Al crear mi cuenta, acepto que mis datos personales serán tratados conforme a la LFPDPPP y que puedo ejercer mis Derechos ARCO en cualquier momento.</p>
            </div>
          </div>

          {/* CHECKBOX DE CONFIDENCIALIDAD (solo médico) */}
          {formData.tipoUsuario === 'medico' && (
            <div className="checkbox-group">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  name="aceptaConfidencialidad"
                  checked={formData.aceptaConfidencialidad}
                  onChange={handleChange}
                  id="aceptaConfidencialidad"
                  required
                />
                <label htmlFor="aceptaConfidencialidad">
                  <strong>Acepto el compromiso de confidencialidad médica</strong>
                </label>
              </div>
              <div className="checkbox-details">
                <p>Me comprometo a mantener la confidencialidad de todos los expedientes y datos médicos de mis pacientes.</p>
              </div>
            </div>
          )}

          {/* CHECKBOX DE CONTRATO DE SERVICIO (solo clínica y farmacia) */}
          {(formData.tipoUsuario === 'clinica' || formData.tipoUsuario === 'farmacia') && (
            <div className="checkbox-group">
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  name="aceptaContrato"
                  checked={formData.aceptaContrato}
                  onChange={handleChange}
                  id="aceptaContrato"
                  required
                />
                <label htmlFor="aceptaContrato">
                  <strong>Acepto el Contrato de Servicio de Cliniservis</strong>
                  <button 
                    type="button" 
                    className="link-button"
                    onClick={() => setShowContrato(true)}
                  >
                    [Ver Contrato de Servicio completo]
                  </button>
                </label>
              </div>
              <div className="checkbox-details">
                <p>Acepto los planes, precios y condiciones de pago. Puedo cancelar mi suscripción en cualquier momento.</p>
              </div>
            </div>
          )}

          {/* Botón de registro */}
          <button type="submit" className="btn-registro">
            Crear cuenta
          </button>
        </form>

        <div className="registro-footer">
          <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a></p>
        </div>
      </div>

      {/* MODAL DE TÉRMINOS Y CONDICIONES */}
      <ModalDocumento
        isOpen={showTerminos}
        onClose={() => setShowTerminos(false)}
        title="Términos y Condiciones - Cliniservis"
        content={`
TÉRMINOS Y CONDICIONES DE USO - CLINISERVIS
Última actualización: [Fecha]

1. IDENTIFICACIÓN DEL PROVEEDOR
Nombre: Equipo desarrollador de Cliniservis
Correo: contacto@cliniservis.com
Domicilio: [Dirección]
Plataforma: https://www.cliniservis.com

2. DEFINICIONES
- Plataforma: Sitio web y sistema Cliniservis
- Usuario: Persona registrada en la Plataforma
- Paciente: Usuario que recibe atención médica
- Médico: Profesional de la salud registrado
- Clínica: Establecimiento de salud registrado
- Farmacia: Establecimiento registrado para surtir recetas
- Receta Electrónica: Documento digital emitido por un médico
- Datos Personales: Información de una persona física

3. OBJETO DEL SERVICIO
Cliniservis es una plataforma SaaS para:
- Clínicas: Digitalización de administración, gestión de médicos, control de inventario, facturación
- Médicos: Agenda digital, expediente clínico, recetas electrónicas, notificaciones
- Pacientes: Autogestión de citas, recetas digitales, historial clínico, recordatorios
- Farmacias: Recepción y validación de recetas, gestión de inventario, surtido

4. REGISTRO Y USO DE CUENTA
- El usuario debe proporcionar información veraz, completa y actualizada.
- El usuario es responsable de su cuenta y contraseña.
- Prohibido compartir cuentas.

5. PLANES, PRECIOS Y PAGOS
- Freemium: $0 MXN (Agenda, hasta 100 pacientes, 100 recetas)
- Pro Salud: $1,499 MXN/mes (Hasta 5,000 pacientes, integración con farmacia)
- Enterprise: $3,499 MXN/mes (Portal del paciente, soporte prioritario)
- Pagos mensuales con renovación automática.
- Cliniservis NO almacena datos de tarjetas.

6. CANCELACIONES Y REEMBOLSOS
- El usuario puede cancelar en cualquier momento.
- No hay penalización por cancelación anticipada.
- No se realizan reembolsos por meses no utilizados.

7. USO PROHIBIDO
- Compartir cuentas de usuario.
- Acceder a datos de otros usuarios sin autorización.
- Utilizar la plataforma para fines fraudulentos o ilegales.
- Falsificar recetas electrónicas.

8. PROPIEDAD INTELECTUAL
- El código, diseño, logotipo y marca son propiedad de Cliniservis.
- El usuario es dueño de la información que ingresa.

9. PRIVACIDAD Y DATOS PERSONALES
- El tratamiento de datos se realiza conforme al Aviso de Privacidad.
- Se cumple con la LFPDPPP.
- El usuario puede ejercer Derechos ARCO en: privacidad@cliniservis.com

10. LIMITACIÓN DE RESPONSABILIDAD
- Cliniservis no es responsable por daños indirectos.
- Responsabilidad limitada al monto total pagado en los últimos 6 meses.
- No es responsable por la práctica médica de los médicos.

11. JURISDICCIÓN APLICABLE
- Los términos se rigen por las leyes de los Estados Unidos Mexicanos.
- Controversias se someten a los tribunales de la Ciudad de México.

Contacto: contacto@cliniservis.com
        `}
      />

      {/* MODAL DE AVISO DE PRIVACIDAD */}
      <ModalDocumento
        isOpen={showPrivacidad}
        onClose={() => setShowPrivacidad(false)}
        title="Aviso de Privacidad - Cliniservis"
        content={`
AVISO DE PRIVACIDAD - CLINISERVIS
Última actualización: [Fecha]

1. IDENTIDAD DEL RESPONSABLE
Nombre: Equipo desarrollador de Cliniservis
Correo: privacidad@cliniservis.com
Domicilio: [Dirección]

2. DATOS PERSONALES RECOPILADOS
Pacientes: Nombre, correo, teléfono, CURP, diagnóstico, historial clínico
Médicos: Nombre, correo, teléfono, cédula profesional, especialidad
Clínicas: Nombre, dirección, RFC, registro sanitario, inventario
Farmacias: Nombre, dirección, RFC, licencia sanitaria, inventario

3. FINALIDADES PRIMARIAS
- Gestión de expedientes clínicos
- Agendamiento de citas médicas
- Emisión de recetas electrónicas
- Seguimiento de tratamientos
- Surtido de recetas en farmacia
- Facturación y cobro del servicio

4. FINALIDADES SECUNDARIAS (requieren consentimiento)
- Envío de boletines informativos
- Encuestas de satisfacción
- Análisis de datos para mejorar el servicio

5. TRANSFERENCIAS DE DATOS
- Paciente → Médico tratante (expediente completo)
- Paciente → Farmacia (recetas electrónicas)
- Médico → Clínica (resumen de consultas)

6. DERECHOS ARCO
El usuario puede ejercer: Acceso, Rectificación, Cancelación y Oposición
Correo: privacidad@cliniservis.com
Plazo de respuesta: 20 días hábiles

7. CONSERVACIÓN DE DATOS
- Se conservan mientras la cuenta esté activa + 5 años (Ley General de Salud)

Contacto: privacidad@cliniservis.com
        `}
      />

      {/* MODAL DE CONTRATO DE SERVICIO */}
      <ModalDocumento
        isOpen={showContrato}
        onClose={() => setShowContrato(false)}
        title="Contrato de Servicio - Cliniservis"
        content={`
CONTRATO DE SERVICIO - CLINISERVIS

1. OBJETO
Cliniservis proporciona una plataforma SaaS para la gestión de clínicas, médicos, pacientes y farmacias.

2. PLANES Y PRECIOS
- Freemium: $0 MXN
- Pro Salud: $1,499 MXN/mes
- Enterprise: $3,499 MXN/mes

3. PAGOS
- Periodicidad: Mensual
- Renovación automática
- Forma de pago: Tarjeta de crédito/débito vía pasarela segura

4. CANCELACIÓN
- El usuario puede cancelar en cualquier momento.
- No hay penalización por cancelación anticipada.
- No se realizan reembolsos por meses no utilizados.

5. FACTURACIÓN
- Se emite CFDI por cada pago.
- El usuario debe proporcionar datos fiscales (RFC, razón social).

6. RESPONSABILIDADES DEL USUARIO
- Proporcionar información veraz.
- Mantener la confidencialidad de su cuenta.
- Cumplir con las leyes aplicables.

7. RESPONSABILIDADES DE CLINISERVIS
- Mantener la plataforma disponible (99.9%).
- Proporcionar soporte técnico.
- Proteger los datos de los usuarios.

Contacto: contacto@cliniservis.com
        `}
      />
    </div>
  );
};

export default Registro;