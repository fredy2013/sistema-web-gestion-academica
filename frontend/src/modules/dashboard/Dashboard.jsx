import './Dashboard.css';
function Dashboard() {
  const summaryCards = [
    {
      title: 'Períodos activos',
      value: '—',
      description: 'Información pendiente de integración',
      icon: '📅',
    },
    {
      title: 'Grupos académicos',
      value: '—',
      description: 'Información pendiente de integración',
      icon: '📚',
    },
    {
      title: 'Matrículas',
      value: '—',
      description: 'Información pendiente de integración',
      icon: '🎓',
    },
  ];

  const quickAccess = [
    {
      title: 'Usuarios y permisos',
      description: 'Administración de cuentas y roles.',
      icon: '👥',
      status: 'En desarrollo',
    },
    {
      title: 'Personas y perfiles',
      description: 'Gestión de estudiantes y docentes.',
      icon: '🪪',
      status: 'En desarrollo',
    },
    {
      title: 'Períodos y asignaturas',
      description: 'Configuración de la oferta académica.',
      icon: '📖',
      status: 'En desarrollo',
    },
    {
      title: 'Grupos académicos',
      description: 'Organización de grupos y docentes.',
      icon: '🏫',
      status: 'En desarrollo',
    },
    {
      title: 'Matrículas',
      description: 'Administración de matrículas estudiantiles.',
      icon: '📝',
      status: 'En desarrollo',
    },
  ];

  return (
    <main className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <div className="dashboard-logo">GA</div>

          <div>
            <strong>Gestión Académica</strong>
            <span>Sistema institucional</span>
          </div>
        </div>

        <nav className="dashboard-navigation" aria-label="Navegación principal">
          <p className="navigation-heading">MENÚ PRINCIPAL</p>

          <div className="navigation-item active">
            <span aria-hidden="true">▦</span>
            Panel de administración
          </div>

          <p className="navigation-heading">GESTIÓN ACADÉMICA</p>

          {quickAccess.map((item) => (
            <div className="navigation-item" key={item.title}>
              <span aria-hidden="true">{item.icon}</span>
              {item.title}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span>Versión inicial</span>
          <strong>Gestión Académica</strong>
        </div>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-topbar">
          <div>
            <span className="topbar-label">ADMINISTRACIÓN</span>
            <h1>Panel de administración</h1>
          </div>

          <div className="administrator-profile">
            <div className="profile-avatar">A</div>

            <div>
              <strong>Administrador</strong>
              <span>Perfil administrativo</span>
            </div>
          </div>
        </header>

        <div className="dashboard-main">
          <div className="dashboard-welcome">
            <h2>Resumen académico</h2>
            <p>Consulta la información general y accede a los módulos de gestión académica.</p>
          </div>

          <section className="summary-section">
            <h3>Indicadores generales</h3>

            <div className="summary-grid">
              {summaryCards.map((card) => (
                <article className="summary-card" key={card.title}>
                  <div className="summary-card-header">
                    <span>{card.title}</span>
                    <span className="summary-icon" aria-hidden="true">
                      {card.icon}
                    </span>
                  </div>

                  <strong className="summary-value">{card.value}</strong>

                  <p>{card.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="quick-access-section">
            <div className="section-heading">
              <h3>Accesos rápidos</h3>
              <span>Opciones de administración</span>
            </div>

            <div className="quick-access-grid">
              {quickAccess.map((item) => (
                <article className="quick-access-card" key={item.title}>
                  <div className="quick-access-icon" aria-hidden="true">
                    {item.icon}
                  </div>

                  <h4>{item.title}</h4>

                  <p>{item.description}</p>

                  <span className="module-status">{item.status}</span>
                </article>
              ))}
            </div>
          </section>

          <footer className="dashboard-footer">
            Sistema Web Configurable para la Gestión Académica
          </footer>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
