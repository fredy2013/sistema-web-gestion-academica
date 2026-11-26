import { useState } from 'react';
import './AcademicOffer.css';

const INITIAL_PERIODS = [
  {
    id: 1,
    code: '2026-1',
    name: 'Primer período académico 2026',
    startDate: '2026-01-19',
    endDate: '2026-06-12',
    enrollmentStart: '2026-01-12',
    enrollmentEnd: '2026-01-23',
    status: 'ACTIVO',
  },
  {
    id: 2,
    code: '2026-2',
    name: 'Segundo período académico 2026',
    startDate: '2026-07-13',
    endDate: '2026-11-27',
    enrollmentStart: '2026-07-06',
    enrollmentEnd: '2026-07-17',
    status: 'BORRADOR',
  },
  {
    id: 3,
    code: '2025-2',
    name: 'Segundo período académico 2025',
    startDate: '2025-07-14',
    endDate: '2025-11-28',
    enrollmentStart: '2025-07-07',
    enrollmentEnd: '2025-07-18',
    status: 'CERRADO',
  },
  {
    id: 4,
    code: '2025-1',
    name: 'Primer período académico 2025',
    startDate: '2025-01-20',
    endDate: '2025-06-13',
    enrollmentStart: '2025-01-13',
    enrollmentEnd: '2025-01-24',
    status: 'CERRADO',
  },
  {
    id: 5,
    code: '2024-2',
    name: 'Segundo período académico 2024',
    startDate: '2024-07-15',
    endDate: '2024-11-29',
    enrollmentStart: '2024-07-08',
    enrollmentEnd: '2024-07-19',
    status: 'CERRADO',
  },
  {
    id: 6,
    code: '2024-1',
    name: 'Primer período académico 2024',
    startDate: '2024-01-15',
    endDate: '2024-06-14',
    enrollmentStart: '2024-01-08',
    enrollmentEnd: '2024-01-19',
    status: 'CERRADO',
  },
];

const INITIAL_SUBJECTS = [
  {
    id: 1,
    code: 'MAT-101',
    name: 'Matemáticas básicas',
    description: 'Fundamentos de pensamiento matemático.',
    intensityHours: '4',
    status: 'ACTIVO',
  },
  {
    id: 2,
    code: 'LEN-101',
    name: 'Lengua castellana',
    description: 'Comunicación oral y escrita.',
    intensityHours: '4',
    status: 'ACTIVO',
  },
  {
    id: 3,
    code: 'TIC-101',
    name: 'Tecnología e informática',
    description: 'Fundamentos de tecnología y competencias digitales.',
    intensityHours: '3',
    status: 'ACTIVO',
  },
  {
    id: 4,
    code: 'CIE-101',
    name: 'Ciencias naturales',
    description: 'Introducción a las ciencias naturales.',
    intensityHours: '3',
    status: 'ACTIVO',
  },
  {
    id: 5,
    code: 'SOC-101',
    name: 'Ciencias sociales',
    description: 'Fundamentos de historia y sociedad.',
    intensityHours: '3',
    status: 'INACTIVO',
  },
  {
    id: 6,
    code: 'ING-101',
    name: 'Idioma extranjero',
    description: 'Fundamentos de lengua extranjera.',
    intensityHours: '2',
    status: 'ACTIVO',
  },
];

const EMPTY_PERIOD = {
  code: '',
  name: '',
  startDate: '',
  endDate: '',
  enrollmentStart: '',
  enrollmentEnd: '',
  status: 'BORRADOR',
};

const EMPTY_SUBJECT = {
  code: '',
  name: '',
  description: '',
  intensityHours: '1',
  status: 'ACTIVO',
};

const PAGE_SIZE = 5;

function AcademicOffer() {
  const [activeTab, setActiveTab] = useState('periods');

  const [periods, setPeriods] = useState(INITIAL_PERIODS);
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);

  const [periodForm, setPeriodForm] = useState(EMPTY_PERIOD);
  const [subjectForm, setSubjectForm] = useState(EMPTY_SUBJECT);

  const [showPeriodForm, setShowPeriodForm] = useState(false);
  const [showSubjectForm, setShowSubjectForm] = useState(false);

  const [editingPeriodId, setEditingPeriodId] = useState(null);
  const [editingSubjectId, setEditingSubjectId] = useState(null);

  const [periodSearch, setPeriodSearch] = useState('');
  const [subjectSearch, setSubjectSearch] = useState('');

  const [periodPage, setPeriodPage] = useState(1);
  const [subjectPage, setSubjectPage] = useState(1);

  const [message, setMessage] = useState('');

  // =========================================
  // FUNCIONES AUXILIARES
  // =========================================

  function formatDate(date) {
    if (!date) return '—';

    const [year, month, day] = date.split('-');

    return `${day}/${month}/${year}`;
  }

  function getStatusClass(status) {
    return status.toLowerCase().replaceAll('_', '-');
  }

  // =========================================
  // PERÍODOS ACADÉMICOS
  // =========================================

  function updatePeriodField(event) {
    const { name, value } = event.target;

    setPeriodForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function openNewPeriodForm() {
    setPeriodForm({ ...EMPTY_PERIOD });
    setEditingPeriodId(null);
    setShowPeriodForm(true);
    setMessage('');
  }

  function openEditPeriodForm(period) {
    setPeriodForm({
      code: period.code,
      name: period.name,
      startDate: period.startDate,
      endDate: period.endDate,
      enrollmentStart: period.enrollmentStart,
      enrollmentEnd: period.enrollmentEnd,
      status: period.status,
    });

    setEditingPeriodId(period.id);
    setShowPeriodForm(true);
    setMessage('');
  }

  function closePeriodForm() {
    setShowPeriodForm(false);
    setEditingPeriodId(null);
    setPeriodForm({ ...EMPTY_PERIOD });
  }

  function handlePeriodSubmit(event) {
    event.preventDefault();

    const code = periodForm.code.trim().toUpperCase();
    const name = periodForm.name.trim();

    if (!code || !name) {
      window.alert('El código y la denominación son obligatorios.');
      return;
    }

    const duplicatedCode = periods.some(
      (period) => period.code.toUpperCase() === code && period.id !== editingPeriodId
    );

    if (duplicatedCode) {
      window.alert('Ya existe un período académico con ese código.');
      return;
    }

    if (periodForm.startDate >= periodForm.endDate) {
      window.alert('La fecha de inicio debe ser anterior a la fecha de finalización.');
      return;
    }

    if (periodForm.enrollmentStart > periodForm.enrollmentEnd) {
      window.alert('La fecha inicial de matrícula debe ser anterior o igual a la fecha final.');
      return;
    }

    if (!periodForm.enrollmentStart || !periodForm.enrollmentEnd) {
      window.alert('Las fechas de matrícula son obligatorias.');
      return;
    }

    const updatedPeriod = {
      ...periodForm,
      code,
      name,
    };

    if (editingPeriodId !== null) {
      setPeriods((previous) =>
        previous.map((period) =>
          period.id === editingPeriodId ? { ...period, ...updatedPeriod } : period
        )
      );

      setMessage('El período académico se actualizó correctamente.');
    } else {
      setPeriods((previous) => [{ ...updatedPeriod, id: Date.now() }, ...previous]);

      setMessage('El período académico se registró correctamente.');
    }

    closePeriodForm();
    setPeriodSearch('');
    setPeriodPage(1);
  }

  function changePeriodStatus(period, newStatus) {
    if (period.status === newStatus) return;

    const confirmed = window.confirm(
      `¿Confirma cambiar el estado del período ${period.code} a ${newStatus}?`
    );

    if (!confirmed) return;

    setPeriods((previous) =>
      previous.map((item) => (item.id === period.id ? { ...item, status: newStatus } : item))
    );

    setMessage(`El estado del período ${period.code} fue actualizado.`);
  }

  // =========================================
  // ASIGNATURAS
  // =========================================

  function updateSubjectField(event) {
    const { name, value } = event.target;

    setSubjectForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function openNewSubjectForm() {
    setSubjectForm({ ...EMPTY_SUBJECT });
    setEditingSubjectId(null);
    setShowSubjectForm(true);
    setMessage('');
  }

  function openEditSubjectForm(subject) {
    setSubjectForm({
      code: subject.code,
      name: subject.name,
      description: subject.description,
      intensityHours: subject.intensityHours,
      status: subject.status,
    });

    setEditingSubjectId(subject.id);
    setShowSubjectForm(true);
    setMessage('');
  }

  function closeSubjectForm() {
    setShowSubjectForm(false);
    setEditingSubjectId(null);
    setSubjectForm({ ...EMPTY_SUBJECT });
  }

  function handleSubjectSubmit(event) {
    event.preventDefault();

    const code = subjectForm.code.trim().toUpperCase();
    const name = subjectForm.name.trim();
    const hours = Number(subjectForm.intensityHours);

    if (!code || !name) {
      window.alert('El código y el nombre de la asignatura son obligatorios.');
      return;
    }

    const duplicatedCode = subjects.some(
      (subject) => subject.code.toUpperCase() === code && subject.id !== editingSubjectId
    );

    if (duplicatedCode) {
      window.alert('Ya existe una asignatura registrada con ese código.');
      return;
    }

    if (!Number.isInteger(hours) || hours < 1) {
      window.alert('La intensidad horaria debe ser un número entero mayor que cero.');
      return;
    }

    const updatedSubject = {
      ...subjectForm,
      code,
      name,
      description: subjectForm.description.trim(),
      intensityHours: String(hours),
    };

    if (editingSubjectId !== null) {
      setSubjects((previous) =>
        previous.map((subject) =>
          subject.id === editingSubjectId ? { ...subject, ...updatedSubject } : subject
        )
      );

      setMessage('La asignatura se actualizó correctamente.');
    } else {
      setSubjects((previous) => [{ ...updatedSubject, id: Date.now() }, ...previous]);

      setMessage('La asignatura se registró correctamente.');
    }

    closeSubjectForm();
    setSubjectSearch('');
    setSubjectPage(1);
  }

  function changeSubjectStatus(subject, newStatus) {
    if (subject.status === newStatus) return;

    const confirmed = window.confirm(
      `¿Confirma cambiar el estado de ${subject.name} a ${newStatus}?`
    );

    if (!confirmed) return;

    setSubjects((previous) =>
      previous.map((item) => (item.id === subject.id ? { ...item, status: newStatus } : item))
    );

    setMessage(`El estado de ${subject.name} fue actualizado.`);
  }

  // =========================================
  // BÚSQUEDAS Y PAGINACIÓN
  // =========================================

  const filteredPeriods = periods.filter((period) => {
    const query = periodSearch.trim().toLowerCase();

    return period.code.toLowerCase().includes(query) || period.name.toLowerCase().includes(query);
  });

  const filteredSubjects = subjects.filter((subject) => {
    const query = subjectSearch.trim().toLowerCase();

    return (
      subject.code.toLowerCase().includes(query) ||
      subject.name.toLowerCase().includes(query) ||
      subject.description.toLowerCase().includes(query)
    );
  });

  const totalPeriodPages = Math.max(1, Math.ceil(filteredPeriods.length / PAGE_SIZE));

  const totalSubjectPages = Math.max(1, Math.ceil(filteredSubjects.length / PAGE_SIZE));

  const visiblePeriods = filteredPeriods.slice(
    (periodPage - 1) * PAGE_SIZE,
    periodPage * PAGE_SIZE
  );

  const visibleSubjects = filteredSubjects.slice(
    (subjectPage - 1) * PAGE_SIZE,
    subjectPage * PAGE_SIZE
  );

  const activePeriods = periods.filter((period) => period.status === 'ACTIVO').length;

  const draftPeriods = periods.filter((period) => period.status === 'BORRADOR').length;

  const activeSubjects = subjects.filter((subject) => subject.status === 'ACTIVO').length;

  // =========================================
  // RENDERIZADO
  // =========================================

  return (
    <main className="academic-offer-page">
      <header className="academic-offer-header">
        <div>
          <span className="academic-offer-breadcrumb">ADMINISTRACIÓN / GESTIÓN ACADÉMICA</span>

          <h1>Períodos y asignaturas</h1>

          <p>Administra los períodos académicos y el catálogo de asignaturas de la institución.</p>
        </div>
      </header>

      <div className="academic-offer-demo-notice">
        <strong>Vista de demostración:</strong> los registros son ficticios y los cambios se
        conservan temporalmente en React. La integración con el backend y PostgreSQL está pendiente.
      </div>

      {message && (
        <div className="academic-offer-success-message" role="status">
          {message}
        </div>
      )}

      {/* =====================================
          RESUMEN GENERAL
      ===================================== */}

      <section className="academic-offer-stats">
        <article className="academic-offer-stat-card">
          <span>Períodos registrados</span>
          <strong>{periods.length}</strong>
        </article>

        <article className="academic-offer-stat-card">
          <span>Períodos activos</span>
          <strong>{activePeriods}</strong>
        </article>

        <article className="academic-offer-stat-card">
          <span>Períodos en borrador</span>
          <strong>{draftPeriods}</strong>
        </article>

        <article className="academic-offer-stat-card">
          <span>Asignaturas activas</span>
          <strong>{activeSubjects}</strong>
        </article>
      </section>

      {/* =====================================
          NAVEGACIÓN ENTRE ÁREAS
      ===================================== */}

      <nav className="academic-offer-tabs">
        <button
          type="button"
          className={activeTab === 'periods' ? 'active' : ''}
          onClick={() => {
            setActiveTab('periods');
            setMessage('');
          }}
        >
          Períodos académicos
        </button>

        <button
          type="button"
          className={activeTab === 'subjects' ? 'active' : ''}
          onClick={() => {
            setActiveTab('subjects');
            setMessage('');
          }}
        >
          Asignaturas
        </button>
      </nav>

      {/* =====================================
          ÁREA DE PERÍODOS
      ===================================== */}

      {activeTab === 'periods' && (
        <section className="academic-offer-section">
          <div className="academic-offer-section-header">
            <div>
              <h2>Gestión de períodos académicos</h2>
              <p>Crea, consulta, actualiza y administra los estados de los períodos académicos.</p>
            </div>

            <button
              type="button"
              className="academic-offer-primary-button"
              onClick={openNewPeriodForm}
            >
              + Nuevo período
            </button>
          </div>

          {showPeriodForm && (
            <form className="academic-offer-form" onSubmit={handlePeriodSubmit}>
              <h3>
                {editingPeriodId !== null
                  ? 'Editar período académico'
                  : 'Registrar período académico'}
              </h3>

              <div className="academic-offer-form-grid">
                <label className="academic-offer-field">
                  Código del período *
                  <input
                    name="code"
                    value={periodForm.code}
                    onChange={updatePeriodField}
                    placeholder="Ej. 2027-1"
                    required
                  />
                </label>

                <label className="academic-offer-field">
                  Denominación *
                  <input
                    name="name"
                    value={periodForm.name}
                    onChange={updatePeriodField}
                    placeholder="Nombre del período académico"
                    required
                  />
                </label>

                <label className="academic-offer-field">
                  Fecha de inicio *
                  <input
                    type="date"
                    name="startDate"
                    value={periodForm.startDate}
                    onChange={updatePeriodField}
                    required
                  />
                </label>

                <label className="academic-offer-field">
                  Fecha de finalización *
                  <input
                    type="date"
                    name="endDate"
                    value={periodForm.endDate}
                    onChange={updatePeriodField}
                    min={periodForm.startDate || undefined}
                    required
                  />
                </label>

                <label className="academic-offer-field">
                  Inicio de matrículas *
                  <input
                    type="date"
                    name="enrollmentStart"
                    value={periodForm.enrollmentStart}
                    onChange={updatePeriodField}
                    required
                  />
                </label>

                <label className="academic-offer-field">
                  Finalización de matrículas *
                  <input
                    type="date"
                    name="enrollmentEnd"
                    value={periodForm.enrollmentEnd}
                    onChange={updatePeriodField}
                    min={periodForm.enrollmentStart || undefined}
                    required
                  />
                </label>

                <label className="academic-offer-field">
                  Estado del período *
                  <select
                    name="status"
                    value={periodForm.status}
                    onChange={updatePeriodField}
                    required
                  >
                    <option value="BORRADOR">Borrador</option>
                    <option value="ACTIVO">Activo</option>
                    <option value="CERRADO">Cerrado</option>
                  </select>
                </label>
              </div>

              <div className="academic-offer-form-actions">
                <button
                  type="button"
                  className="academic-offer-secondary-button"
                  onClick={closePeriodForm}
                >
                  Cancelar
                </button>

                <button type="submit" className="academic-offer-primary-button">
                  {editingPeriodId !== null ? 'Guardar cambios' : 'Registrar período'}
                </button>
              </div>
            </form>
          )}

          <div className="academic-offer-search-row">
            <input
              type="search"
              value={periodSearch}
              onChange={(event) => {
                setPeriodSearch(event.target.value);
                setPeriodPage(1);
              }}
              placeholder="Buscar por código o denominación..."
              aria-label="Buscar período académico"
            />

            <span>{filteredPeriods.length} registro(s) encontrado(s)</span>
          </div>

          <div className="academic-offer-table-container">
            <table className="academic-offer-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Período académico</th>
                  <th>Inicio</th>
                  <th>Finalización</th>
                  <th>Matrículas</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {visiblePeriods.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="academic-offer-empty">
                      No se encontraron períodos académicos.
                    </td>
                  </tr>
                ) : (
                  visiblePeriods.map((period) => (
                    <tr key={period.id}>
                      <td>
                        <strong>{period.code}</strong>
                      </td>

                      <td>{period.name}</td>

                      <td>{formatDate(period.startDate)}</td>

                      <td>{formatDate(period.endDate)}</td>

                      <td>
                        {formatDate(period.enrollmentStart)}
                        <span className="academic-offer-date-separator">{' a '}</span>
                        {formatDate(period.enrollmentEnd)}
                      </td>

                      <td>
                        <span className={`academic-offer-status ${getStatusClass(period.status)}`}>
                          {period.status}
                        </span>
                      </td>

                      <td>
                        <div className="academic-offer-row-actions">
                          <button type="button" onClick={() => openEditPeriodForm(period)}>
                            Editar
                          </button>

                          <select
                            aria-label={`Cambiar estado de ${period.code}`}
                            value={period.status}
                            onChange={(event) => changePeriodStatus(period, event.target.value)}
                          >
                            <option value="BORRADOR">Borrador</option>
                            <option value="ACTIVO">Activo</option>
                            <option value="CERRADO">Cerrado</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="academic-offer-pagination">
            <span>
              Página {periodPage} de {totalPeriodPages}
            </span>

            <div>
              <button
                type="button"
                disabled={periodPage === 1}
                onClick={() => setPeriodPage((page) => page - 1)}
              >
                Anterior
              </button>

              <button
                type="button"
                disabled={periodPage >= totalPeriodPages}
                onClick={() => setPeriodPage((page) => page + 1)}
              >
                Siguiente
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =====================================
          ÁREA DE ASIGNATURAS
      ===================================== */}

      {activeTab === 'subjects' && (
        <section className="academic-offer-section">
          <div className="academic-offer-section-header">
            <div>
              <h2>Gestión de asignaturas</h2>
              <p>Administra el catálogo de asignaturas y su información académica.</p>
            </div>

            <button
              type="button"
              className="academic-offer-primary-button"
              onClick={openNewSubjectForm}
            >
              + Nueva asignatura
            </button>
          </div>

          {showSubjectForm && (
            <form className="academic-offer-form" onSubmit={handleSubjectSubmit}>
              <h3>{editingSubjectId !== null ? 'Editar asignatura' : 'Registrar asignatura'}</h3>

              <div className="academic-offer-form-grid">
                <label className="academic-offer-field">
                  Código de asignatura *
                  <input
                    name="code"
                    value={subjectForm.code}
                    onChange={updateSubjectField}
                    placeholder="Ej. MAT-102"
                    required
                  />
                </label>

                <label className="academic-offer-field">
                  Nombre de la asignatura *
                  <input
                    name="name"
                    value={subjectForm.name}
                    onChange={updateSubjectField}
                    placeholder="Nombre de la asignatura"
                    required
                  />
                </label>

                <label className="academic-offer-field">
                  Intensidad horaria *
                  <input
                    type="number"
                    name="intensityHours"
                    value={subjectForm.intensityHours}
                    onChange={updateSubjectField}
                    min="1"
                    step="1"
                    required
                  />
                </label>

                <label className="academic-offer-field">
                  Estado de la asignatura *
                  <select
                    name="status"
                    value={subjectForm.status}
                    onChange={updateSubjectField}
                    required
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="INACTIVO">Inactivo</option>
                  </select>
                </label>

                <label className="academic-offer-field academic-offer-field-full">
                  Descripción
                  <textarea
                    name="description"
                    value={subjectForm.description}
                    onChange={updateSubjectField}
                    placeholder="Descripción de la asignatura"
                    rows="3"
                  />
                </label>
              </div>

              <div className="academic-offer-form-actions">
                <button
                  type="button"
                  className="academic-offer-secondary-button"
                  onClick={closeSubjectForm}
                >
                  Cancelar
                </button>

                <button type="submit" className="academic-offer-primary-button">
                  {editingSubjectId !== null ? 'Guardar cambios' : 'Registrar asignatura'}
                </button>
              </div>
            </form>
          )}

          <div className="academic-offer-search-row">
            <input
              type="search"
              value={subjectSearch}
              onChange={(event) => {
                setSubjectSearch(event.target.value);
                setSubjectPage(1);
              }}
              placeholder="Buscar por código, nombre o descripción..."
              aria-label="Buscar asignatura"
            />

            <span>{filteredSubjects.length} registro(s) encontrado(s)</span>
          </div>

          <div className="academic-offer-table-container">
            <table className="academic-offer-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Asignatura</th>
                  <th>Descripción</th>
                  <th>Intensidad horaria</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {visibleSubjects.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="academic-offer-empty">
                      No se encontraron asignaturas.
                    </td>
                  </tr>
                ) : (
                  visibleSubjects.map((subject) => (
                    <tr key={subject.id}>
                      <td>
                        <strong>{subject.code}</strong>
                      </td>

                      <td>{subject.name}</td>

                      <td>{subject.description || 'Sin descripción'}</td>

                      <td>{subject.intensityHours} horas</td>

                      <td>
                        <span className={`academic-offer-status ${getStatusClass(subject.status)}`}>
                          {subject.status}
                        </span>
                      </td>

                      <td>
                        <div className="academic-offer-row-actions">
                          <button type="button" onClick={() => openEditSubjectForm(subject)}>
                            Editar
                          </button>

                          <select
                            aria-label={`Cambiar estado de ${subject.code}`}
                            value={subject.status}
                            onChange={(event) => changeSubjectStatus(subject, event.target.value)}
                          >
                            <option value="ACTIVO">Activo</option>
                            <option value="INACTIVO">Inactivo</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="academic-offer-pagination">
            <span>
              Página {subjectPage} de {totalSubjectPages}
            </span>

            <div>
              <button
                type="button"
                disabled={subjectPage === 1}
                onClick={() => setSubjectPage((page) => page - 1)}
              >
                Anterior
              </button>

              <button
                type="button"
                disabled={subjectPage >= totalSubjectPages}
                onClick={() => setSubjectPage((page) => page + 1)}
              >
                Siguiente
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default AcademicOffer;
