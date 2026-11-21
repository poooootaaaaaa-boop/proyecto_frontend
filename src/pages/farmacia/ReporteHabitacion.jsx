import { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/farmacia/Sidebar";

const API_URL = import.meta.env.VITE_API_URL;

function ReporteHabitacion() {
    const navigate = useNavigate();

    // Estados para catálogos
    const [listaCuartos, setListaCuartos] = useState([]);
    const [listaInstrumentos, setListaInstrumentos] = useState([]);
    const [listaDoctores, setListaDoctores] = useState([]);
    const [listaReportes, setListaReportes] = useState([]);

    // Estados del formulario individual
    const [cuartoSeleccionado, setCuartoSeleccionado] = useState('');
    const [doctorSeleccionado, setDoctorSeleccionado] = useState('');
    const [instrumentoSeleccionado, setInstrumentoSeleccionado] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [foto, setFoto] = useState(null);
    const [fechaRegistro, setFechaRegistro] = useState('');
    const [costo, setCosto] = useState('');
    const [prioridad, setPrioridad] = useState('');

    // Reportes agregados localmente antes de enviar en lote
    const [reportesLocales, setReportesLocales] = useState([]);

    // Carga inicial de datos
    useEffect(() => {
        const cargarDatosIniciales = async () => {
            try {
                const [resHabitaciones, resInstrumentos, resDoctores, resReportes] = await Promise.all([
                    Axios.get(`${API_URL}/habitaciones`),
                    Axios.get(`${API_URL}/instrumentos`),
                    Axios.get(`${API_URL}/doctores-completo`),
                    Axios.get(`${API_URL}/reportes-completo`)
                ]);

                setListaCuartos(resHabitaciones.data || []);
                setListaInstrumentos(resInstrumentos.data || []);
                setListaDoctores(resDoctores.data || []);
                setListaReportes(resReportes.data || []);
            } catch (error) {
                console.error("Error cargando datos iniciales:", error);
            }
        };

        cargarDatosIniciales();
    }, []);

    const obtenerReportes = async () => {
        try {
            const response = await Axios.get(`${API_URL}/reportes-completo`);
            setListaReportes(response.data || []);
        } catch (error) {
            console.error("Error cargando reportes:", error);
        }
    };

    const cambiarStatus = async (id) => {
        try {
            await Axios.put(`${API_URL}/reporte-habitacion/${id}/status`, { status: "aprobado" });

            setListaReportes((reportesActuales) =>
                reportesActuales.map((reporte) =>
                    reporte.id === id ? { ...reporte, status: "aprobado" } : reporte
                )
            );

            alert("Reporte aprobado correctamente");
            await obtenerReportes();
        } catch (error) {
            console.error("Error actualizando el estado:", error);
            alert(error.response?.data?.mensaje || "No se pudo actualizar el estado");
        }
    };

    const verReporte = (reporte) => {
        const instrumento = listaInstrumentos.find((ins) => String(ins.id) === String(reporte.instrumento_id));
        const doctor = listaDoctores.find((doc) => String(doc.id) === String(reporte.doctor_id));

        const reporteCompleto = {
            ...reporte,
            instrumento_nombre: reporte.instrumento?.nombre || reporte.instrumento_nombre || instrumento?.nombre || `Instrumento #${reporte.instrumento_id}`,
            doctor_nombre: reporte.doctor_nombre || reporte.doctor?.usuario?.nombre || doctor?.usuario?.nombre || doctor?.nombre || "Doctor no identificado",
        };

        navigate("/farmacia/documento-reporte", {
            state: { reporte: reporteCompleto, reportes: [reporteCompleto] },
        });
    };

    const limpiarFormulario = () => {
        setCuartoSeleccionado('');
        setDoctorSeleccionado('');
        setInstrumentoSeleccionado('');
        setDescripcion('');
        setFoto(null);
        setFechaRegistro('');
        setCosto('');
        setPrioridad('');
    };

    const agregarReporteLocal = () => {
        if (!cuartoSeleccionado || !doctorSeleccionado || !instrumentoSeleccionado || !descripcion || !foto || !fechaRegistro || !costo || !prioridad) {
            alert('Por favor, llena todos los campos antes de agregar el reporte.');
            return;
        }

        const doctorObj = listaDoctores.find((d) => String(d.id) === String(doctorSeleccionado));
        const instrumentoObj = listaInstrumentos.find((i) => String(i.id) === String(instrumentoSeleccionado));

        const nuevoReporte = {
            cuarto_id: cuartoSeleccionado,
            doctor_id: doctorSeleccionado,
            doctor_nombre: doctorObj?.usuario?.nombre || "",
            instrumento_id: instrumentoSeleccionado,
            instrumento_nombre: instrumentoObj?.nombre || `Instrumento #${instrumentoSeleccionado}`,
            descripcion,
            foto,
            fecha_registro: fechaRegistro,
            costo,
            prioridad
        };

        setReportesLocales([...reportesLocales, nuevoReporte]);
        limpiarFormulario();
        alert('Reporte agregado a la lista temporal.');
    };

    const eliminarReporteLocal = (indice) => {
        setReportesLocales(reportesLocales.filter((_, index) => index !== indice));
    };

    const manejarEnvioGeneral = async () => {
        const reportesParaEnviar = [...reportesLocales];

        // Si hay datos sueltos en el formulario actual sin agregar, los incluimos
        if (cuartoSeleccionado && doctorSeleccionado && instrumentoSeleccionado && descripcion && foto && fechaRegistro && costo && prioridad) {
            const doctorObj = listaDoctores.find((d) => String(d.id) === String(doctorSeleccionado));
            const instrumentoObj = listaInstrumentos.find((i) => String(i.id) === String(instrumentoSeleccionado));

            reportesParaEnviar.push({
                cuarto_id: cuartoSeleccionado,
                doctor_id: doctorSeleccionado,
                doctor_nombre: doctorObj?.usuario?.nombre || "",
                instrumento_id: instrumentoSeleccionado,
                instrumento_nombre: instrumentoObj?.nombre || `Instrumento #${instrumentoSeleccionado}`,
                descripcion,
                foto,
                fecha_registro: fechaRegistro,
                costo,
                prioridad
            });
        }

        if (reportesParaEnviar.length === 0) {
            alert('Primero completa el formulario o agrega al menos un reporte.');
            return;
        }

        try {
            const reportesGuardados = [];

            for (const reporte of reportesParaEnviar) {
                const datosFormulario = new FormData();
                datosFormulario.append('doctor_id', reporte.doctor_id);
                datosFormulario.append('cuarto_id', reporte.cuarto_id);
                datosFormulario.append('instrumento_id', reporte.instrumento_id);
                datosFormulario.append('descripcion', reporte.descripcion);
                datosFormulario.append('foto', reporte.foto);
                datosFormulario.append('fecha_registro', reporte.fecha_registro);
                datosFormulario.append('costo', reporte.costo);
                datosFormulario.append('prioridad', reporte.prioridad);

                await Axios.post(`${API_URL}/reporte-habitacion`, datosFormulario, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                reportesGuardados.push(reporte);
            }

            alert('¡Reportes guardados con éxito!');
            navigate('/farmacia/documento-reporte', {
                state: { reporte: reportesGuardados[0], reportes: reportesGuardados }
            });

        } catch (error) {
            console.error('Error al enviar:', error);
            alert('Hubo un error al guardar los reportes.');
        }
    };

    return (
        <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', display: 'flex' }}>
            <Sidebar />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', width: '100%', maxWidth: '600px', padding: '40px', boxSizing: 'border-box' }}>
                    
                    <h2 style={{ textAlign: 'center', color: '#0a1931', fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
                        Reportar Habitaciones e Instrumentos
                    </h2>
                    <p style={{ textAlign: 'center', color: '#6c757d', fontSize: '13.5px', marginBottom: '30px' }}>
                        Complete los detalles del estado de la habitación o registre múltiples incidencias.
                    </p>

                    {/* Selector de Cuartos */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '13.5px', fontWeight: '500' }}>Selecciona el Cuarto</label>
                        <select value={cuartoSeleccionado} onChange={(e) => setCuartoSeleccionado(e.target.value)} style={selectStyle}>
                            <option value="">-- Selecciona un cuarto --</option>
                            {listaCuartos.map((cuarto) => (
                                <option key={cuarto.id} value={cuarto.id}>Cuarto: {cuarto.id}</option>
                            ))}
                        </select>
                    </div>

                    {/* Selector de Doctor */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '13.5px', fontWeight: '500' }}>Selecciona el Doctor</label>
                        <select value={doctorSeleccionado} onChange={(e) => setDoctorSeleccionado(e.target.value)} style={selectStyle}>
                            <option value="">-- Selecciona un doctor --</option>
                            {listaDoctores.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>{doctor.usuario?.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Selector de Instrumentos */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '13.5px', fontWeight: '500' }}>Selecciona el Instrumento</label>
                        <select value={instrumentoSeleccionado} onChange={(e) => setInstrumentoSeleccionado(e.target.value)} style={selectStyle}>
                            <option value="">-- Selecciona un instrumento --</option>
                            {listaInstrumentos.map((ins) => (
                                <option key={ins.id} value={ins.id}>{ins.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Descripción */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '13.5px', fontWeight: '500' }}>Descripción</label>
                        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Escribe una breve descripción..." style={{ ...selectStyle, minHeight: '90px', resize: 'vertical' }} />
                    </div>

                    {/* Fecha de Registro */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '13.5px', fontWeight: '500' }}>Fecha de registro</label>
                        <input type="date" value={fechaRegistro} onChange={(e) => setFechaRegistro(e.target.value)} style={selectStyle} />
                    </div>

                    {/* Costo */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '13.5px', fontWeight: '500' }}>Costo</label>
                        <input type="number" min="0" step="0.01" value={costo} onChange={(e) => setCosto(e.target.value)} placeholder="Ingresa el costo" style={selectStyle} />
                    </div>

                    {/* Prioridad */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '13.5px', fontWeight: '500' }}>Prioridad</label>
                        <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)} style={selectStyle}>
                            <option value="">-- Selecciona una prioridad --</option>
                            <option value="alta">Alta</option>
                            <option value="media">Media</option>
                            <option value="baja">Baja</option>
                        </select>
                    </div>

                    {/* Subir Foto */}
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '13.5px', fontWeight: '500' }}>Subir Foto</label>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', borderRadius: '8px', border: '1px dashed #cbd5e1', backgroundColor: foto ? '#fff' : '#f8fafc', position: 'relative' }}>
                            {foto ? (
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <img src={URL.createObjectURL(foto)} alt="Preview" style={{ maxHeight: '180px', maxWidth: '100%', borderRadius: '6px', objectFit: 'contain' }} />
                                    <button type="button" onClick={() => setFoto(null)} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#e11d48', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                                </div>
                            ) : (
                                <label style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                                    <span style={{ fontSize: '22px', marginBottom: '6px', color: '#94a3b8' }}>📁</span>
                                    <span style={{ fontSize: '13.5px', color: '#1e3a8a', fontWeight: '600' }}>Seleccionar archivo <span style={{ color: '#64748b', fontWeight: '400' }}>o arrastrar</span></span>
                                    <input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files[0])} style={{ display: 'none' }} />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Botones de acción del formulario */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                        <button type="button" onClick={agregarReporteLocal} style={{ flex: 1, backgroundColor: '#475569', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer', fontWeight: '600' }}>
                            + Agregar a lista
                        </button>
                        <button type="button" onClick={manejarEnvioGeneral} style={{ flex: 1, backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer', fontWeight: '600' }}>
                            Enviar Reportes
                        </button>
                    </div>

                    {/* Lista temporal de reportes agregados */}
                    {reportesLocales.length > 0 && (
                        <div style={{ marginBottom: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                            <h3 style={{ fontSize: '15px', color: '#0a1931', marginBottom: '12px' }}>Reportes en espera de envío ({reportesLocales.length}):</h3>
                            {reportesLocales.map((rep, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '6px', marginBottom: '8px', border: '1px solid #e2e8f0' }}>
                                    <span style={{ fontSize: '13px', color: '#333' }}>Cuarto #{rep.cuarto_id} - {rep.instrumento_nombre}</span>
                                    <button type="button" onClick={() => eliminarReporteLocal(idx)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px' }}>Quitar</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Historial de reportes existentes en base de datos */}
                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                        <h3 style={{ fontSize: '16px', color: '#0a1931', marginBottom: '15px' }}>Reportes Registrados en el Sistema</h3>
                        <ul style={{ padding: 0, margin: 0 }}>
                            {listaReportes.map((reporte) => (
                                <li key={reporte.id} style={{ listStyle: 'none', backgroundColor: '#fdfdfd', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', marginBottom: '12px' }}>
                                    <p style={{ margin: '0 0 6px 0', fontSize: '13.5px' }}><strong>Descripción:</strong> {reporte.descripcion}</p>
                                    <p style={{ margin: '0 0 6px 0', fontSize: '13.5px' }}><strong>Estado:</strong> {reporte.status || "Sin estado"}</p>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                        {reporte.status === "pendiente" && (
                                            <button type="button" onClick={() => cambiarStatus(reporte.id)} style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px' }}>Aprobar</button>
                                        )}
                                        <button type="button" onClick={() => verReporte(reporte)} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '13px' }}>Ver reporte</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Estilo común reutilizable para inputs y selects
const selectStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    color: '#4a5568',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
};

export default ReporteHabitacion;