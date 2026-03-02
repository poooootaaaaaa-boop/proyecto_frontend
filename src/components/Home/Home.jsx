// LandingPage.jsx
import React, { useEffect, useState } from "react";
import "./Home.css";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1580281657527-47e49b2b0f32?q=80&w=1600",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=1600",
  "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1600",
  "https://images.unsplash.com/photo-1600959907703-125ba1374a12?q=80&w=1600",
  "https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=1600",
];

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="logo">+ MediSmart AI</div>
        <nav className="nav-links">
          <a>Características</a>
          <a>Especialidades</a>
          <a>Planes</a>
        </nav>
        <div className="nav-actions">
          <button className="btn-primary">Comenzar</button>
          <button className="btn-outline">Ingresar</button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        {/* BACKGROUND CAROUSEL */}
        <div className="hero-bg">
          {HERO_IMAGES.map((img, i) => (
            <div
              key={i}
              className={`hero-slide ${i === index ? "active" : ""}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="hero-overlay" />
        </div>

        <div className="hero-left">
          <span className="badge">+ NUEVA ERA EN SALUD DIGITAL</span>
          <h1>
            Revoluciona tu <br /> Práctica Médica <br /> con IA
          </h1>
          <p>
            Optimiza tu flujo de trabajo con nuestra plataforma inteligente:
            agenda automatizada, expedientes digitales y recetas asistidas por
            IA con control de errores.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary large shine-btn">
              Comenzar Gratis
            </button>
            <button className="btn-light large">Ver Demo</button>
          </div>
          <div className="social-proof">
            + 2,000 médicos ya confían en nosotros
          </div>
        </div>

        <div className="hero-right">
          <div className="phone-mock" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <span className="section-label">CARACTERÍSTICAS ELITE</span>
        <h2>Soluciones Inteligentes para la Salud</h2>
        <p className="section-desc">
          Diseñado para eliminar la carga administrativa y permitirte enfocar
          en lo que importa: tus pacientes.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="icon" />
            <h3>Agenda Inteligente</h3>
            <p>
              Gestión dinámica de citas con recordatorios automáticos vía
              WhatsApp y SMS.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon" />
            <h3>Expediente Clínico Digital</h3>
            <p>
              Historial médico completo, encriptado y accesible desde cualquier
              dispositivo.
            </p>
          </div>

          <div className="feature-card active">
            <div className="icon" />
            <h3>Recetas con IA</h3>
            <p>
              Generación de recetas asistida por IA que verifica automáticamente
              el stock.
            </p>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="experience">
        <h2>Experiencias Personalizadas</h2>
        <p className="section-desc">
          Módulos específicos adaptados a cada rol del ecosistema de salud.
        </p>

        <div className="experience-grid">
          <div className="exp-card">
            <div className="exp-img" />
            <h3>Para Doctores</h3>
            <ul>
              <li>Dashboard de rendimiento diario</li>
              <li>Integración con laboratorios externos</li>
            </ul>
          </div>

          <div className="exp-card">
            <div className="exp-img" />
            <h3>Para Pacientes</h3>
            <ul>
              <li>Telemedicina integrada en un clic</li>
              <li>Chat directo con soporte clínico</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing">
        <h2>Planes diseñados para crecer</h2>
        <p className="section-desc">
          Escoge la solución perfecta para tu tamaño y necesidades.
        </p>

        <div className="pricing-grid">
          <div className="price-card">
            <h3>Plan Básico</h3>
            <div className="price">$19 <span>/mes</span></div>
            <ul>
              <li>Agenda Digital</li>
              <li>Hasta 100 pacientes</li>
              <li>Recetas Básicas</li>
            </ul>
            <button className="btn-light full shine-btn">Seleccionar</button>
          </div>

          <div className="price-card popular">
            <div className="popular-badge">MÁS POPULAR</div>
            <h3>Plan Pro</h3>
            <div className="price">$49 <span>/mes</span></div>
            <ul>
              <li>Todo en el Plan Básico</li>
              <li>Asistente IA Ilimitado</li>
              <li>Telemedicina HD</li>
              <li>Reportes Avanzados</li>
            </ul>
            <button className="btn-primary full shine-btn">
              Probar 14 días Gratis
            </button>
          </div>

          <div className="price-card">
            <h3>Clínicas & Farmacias</h3>
            <div className="price">$99 <span>/mes</span></div>
            <ul>
              <li>Todo en el Plan Pro</li>
              <li>Gestión de Inventarios</li>
              <li>Múltiples Especialistas</li>
              <li>API para integración</li>
            </ul>
            <button className="btn-light full shine-btn">
              Contactar Ventas
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-brand">MediSmart AI</div>
        <p>© 2024 MediSmart AI. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}