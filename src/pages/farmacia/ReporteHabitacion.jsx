import { useState, useEffect, useRef } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "../../components/farmacia/Sidebar";
import { useNavigate } from "react-router-dom";
import SlimSelect from 'slim-select';

const API_URL = import.meta.env.VITE_API_URL;

function ReporteHabitacion() {

  const [listaCuartos, setListaCuartos] = useState([]);
  const [listaInstrumentos, setListaInstrumentos] = useState([]);

  // Un const independiente para cada campo
  const [cuartoSeleccionado, setCuartoSeleccionado] = useState('');
  const [instrumentoSeleccionado, setInstrumentoSeleccionado] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [foto, setFoto] = useState(null);


  /*
  // Simulación de la base de datos
  useEffect(() => {
    const cuartosBD = [
      { id: 1, nombre: 'Estudio Principal' },
      { id: 2, nombre: 'Cabina de Grabación' },
      { id: 3, nombre: 'Sala de Ensayo A' }
    ];

    const instrumentosBD = [
      { id: 1, nombre: 'Guitarra Eléctrica' },
      { id: 2, nombre: 'Batería Acústica' },
      { id: 3, nombre: 'Teclado MIDI' }
    ];

    setListaCuartos(cuartosBD);
    setListaInstrumentos(instrumentosBD);
  }, []);

*/
  

  // 1. Declaras tus funciones asíncronas para traer los datos de la BD
const obtenerHabitaciones = async () => {
  try {
    const response = await Axios.get(`${API_URL}/habitaciones`);
    // Usamos el set que definiste para tus cuartos/habitaciones
    setListaCuartos(response.data || []); 
  } catch (error) {
    console.error("Error cargando habitaciones:", error);
  }
};

const obtenerInstrumentos = async () => {
  try {
    const response = await Axios.get(`${API_URL}/instrumentos`);
    // Usamos el set que definiste para tus instrumentos
    setListaInstrumentos(response.data || []);
  } catch (error) {
    console.error("Error cargando instrumentos:", error);
  }
};

// 2. Tu useEffect queda súper corto y limpio: solo las llama al iniciar
useEffect(() => {
  obtenerHabitaciones();
  obtenerInstrumentos();
}, []); // Arreglo vacío para que se ejecute solo una vez





  // La función ya no necesita el "e.preventDefault()" porque no hay un submit nativo que recargue la página
  const manejarEnvio = async () => {
    // Validamos a mano que no dejen campos vacíos (ya que no tenemos el "required" nativo del form)
    if (!cuartoSeleccionado || !instrumentoSeleccionado || !descripcion || !foto) {
      alert('Por favor, llena todos los campos antes de enviar.');
      return;
    }

    const datosFormulario = new FormData();
    datosFormulario.append('cuarto_id', cuartoSeleccionado);
    datosFormulario.append('instrumento_id', instrumentoSeleccionado);
    datosFormulario.append('descripcion', descripcion);
    datosFormulario.append('foto', foto);

    try {
      const respuesta = await Axios.post(`${API_URL}/reporte-habitacion`, datosFormulario, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Respuesta:', respuesta.data);
      alert('¡Guardado con éxito con Axios!');

      // Limpiar campos
      setCuartoSeleccionado('');
      setInstrumentoSeleccionado('');
      setDescripcion('');
      setFoto(null);

    } catch (error) {
      console.error('Error al enviar:', error);
      alert('Hubo un error al conectar con el servidor.');
    }
  };

    
    return (
      <div className="movimientos-layout" style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', display: 'flex' }}>
    <Sidebar />

    <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'flex-start', 
        alignItems: 'center', 
        padding: '40px 20px',
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" 
    }}>
        
        <div style={{ 
            backgroundColor: '#f3f0f0', 
            borderRadius: '16px', 
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)', 
            width: '100%', 
            maxWidth: '520px', 
            padding: '40px',
            boxSizing: 'border-box'
        }}>
            
            <h2 style={{ 
                textAlign: 'center', 
                color: '#0a1931', 
                fontSize: '26px', 
                fontWeight: '700',
                margin: '0 0 8px 0' 
            }}>Reportar Habitaciones</h2>
            
            <p style={{ 
                textAlign: 'center', 
                color: '#6c757d', 
                fontSize: '13.5px', 
                margin: '0 0 30px 0' 
            }}>Por favor, complete los detalles del estado de la habitación e instrumentos.</p>
            
            <div>
                {/* Selector de Cuartos */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#333333', fontSize: '13.5px', fontWeight: '500' }}>
                        Selecciona el Cuarto
                    </label>
                    <select 
                        value={cuartoSeleccionado} 
                        onChange={(e) => setCuartoSeleccionado(e.target.value)}
                        style={{ 
                            width: '100%', 
                            padding: '12px 14px', 
                            borderRadius: '8px', 
                            border: '1px solid #e2e8f0', 
                            backgroundColor: '#f8fafc',
                            color: '#4a5568',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                    >
                        <option value="">-- Selecciona un cuarto --</option>
                        {listaCuartos.map((cuarto) => (
                            <option key={cuarto.id} value={cuarto.id}>
                                Cuarto: {cuarto.id}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Selector de Instrumentos */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#333333', fontSize: '13.5px', fontWeight: '500' }}>
                        Selecciona el Instrumento
                    </label>
                    <select 
                        value={instrumentoSeleccionado} 
                        onChange={(e) => setInstrumentoSeleccionado(e.target.value)}
                        style={{ 
                            width: '100%', 
                            padding: '12px 14px', 
                            borderRadius: '8px', 
                            border: '1px solid #e2e8f0', 
                            backgroundColor: '#f8fafc',
                            color: '#4a5568',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                    >
                        <option value="">-- Selecciona un instrumento --</option>
                        {listaInstrumentos.map((ins) => (
                            <option key={ins.id} value={ins.id}>
                                {ins.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Campo de Descripción */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#333333', fontSize: '13.5px', fontWeight: '500' }}>
                        Descripción
                    </label>
                    <textarea 
                        value={descripcion} 
                        onChange={(e) => setDescripcion(e.target.value)}
                        style={{ 
                            width: '100%', 
                            padding: '12px 14px', 
                            minHeight: '100px', 
                            borderRadius: '8px', 
                            border: '1px solid #e2e8f0', 
                            backgroundColor: '#f8fafc',
                            color: '#333333',
                            fontSize: '14px',
                            outline: 'none',
                            resize: 'vertical',
                            boxSizing: 'border-box'
                        }}
                        placeholder="Escribe una breve descripción del reporte..."
                    />
                </div>

                {/* Campo de Foto (Estilizado como la zona de arrastrar archivo de la imagen) */}
                {/* Campo de Foto */}
      <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#333333', fontSize: '13.5px', fontWeight: '500' }}>
              Subir Foto
          </label>
          
          {/* Contenedor principal que reacciona a la selección */}
          <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              borderRadius: '8px',
              border: '1px dashed #cbd5e1',
              backgroundColor: foto ? '#ffffff' : '#f8fafc', // Fondo blanco si hay foto, claro si no
              textAlign: 'center',
              position: 'relative' // Para el botón de eliminar
          }}>

        {/* Zona de previsualización (cuando HAY una foto) */}
        {foto && (
            <div style={{
                position: 'relative',
                display: 'inline-block',
                maxWidth: '100%'
            }}>
                <img 
                    src={URL.createObjectURL(foto)} 
                    alt="Preview" 
                    style={{ 
                        display: 'block', 
                        maxHeight: '200px', 
                        maxWidth: '100%', 
                        borderRadius: '6px', 
                        objectFit: 'contain' 
                    }} 
                />
                
                {/* Botón de eliminar (pequeña 'X' roja en la esquina) */}
                <button 
                    type="button"
                    onClick={() => {
                        setFoto(null); // Limpia el estado de la foto
                    }}
                    style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        background: '#e11d48',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        transition: 'transform 0.2s',
                        zIndex: 1
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    &times; {/* Carácter de multiplicación para la 'X' */}
                </button>
            </div>
        )}

        {/* Zona de carga (cuando NO hay foto) */}
        {!foto && (
            <label style={{ 
                width: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer',
                padding: '8px'
            }}>
                <span style={{ fontSize: '24px', marginBottom: '8px', color: '#94a3b8' }}>📁</span>
                <span style={{ fontSize: '13.5px', color: '#1e3a8a', fontWeight: '600' }}>
                    Seleccionar archivo <span style={{ color: '#64748b', fontWeight: '400' }}>o arrastrar y soltar</span>
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>PNG, JPG hasta 10MB</span>
                
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setFoto(e.target.files[0])} 
                    onClick={(e) => (e.target.value = null)}
                    style={{ display: 'none' }}
                />
            </label>
              )}
              
          </div>
      </div>

                {/* Botón de Enviar */}
                <button 
                    type="button"
                    onClick={manejarEnvio}
                    style={{ 
                        width: '100%', 
                        padding: '14px', 
                        backgroundColor: '#1d4ed8', 
                        color: '#ffffff', 
                        border: 'none', 
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '15px',
                        fontWeight: '600',
                        transition: 'background-color 0.2s ease',
                        boxSizing: 'border-box'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                >
                    Enviar informe
                </button>
            </div>
        </div>
    </div>
</div>
    );
}

export default ReporteHabitacion;