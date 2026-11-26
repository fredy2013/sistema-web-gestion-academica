import { useMemo, useState } from 'react';
import './People.css';

const PAGE_SIZE = 5;

const EMPTY_FORM = {
  documentType: 'CC',
  documentNumber: '',
  firstNames: '',
  lastNames: '',
  email: '',
  phone: '',
  personStatus: 'Activo',
  profileType: 'Estudiante',
  studentCode: '',
  entryDate: '',
  academicStatus: 'Activo',
  teacherCode: '',
  teacherStatus: 'Activo',
};

const INITIAL_PEOPLE = [
  {
    id: 1,
    documentType: 'CC',
    documentNumber: 'DEMO-001',
    firstNames: 'Ana María',
    lastNames: 'Ejemplo Gómez',
    email: 'ana.estudiante@demo.local',
    phone: '3000000001',
    personStatus: 'Activo',
    profileType: 'Estudiante',
    studentCode: 'EST-DEMO-001',
    entryDate: '2026-01-15',
    academicStatus: 'Activo',
    teacherCode: '',
    teacherStatus: 'Activo',
  },
  {
    id: 2,
    documentType: 'CC',
    documentNumber: 'DEMO-002',
    firstNames: 'Carlos Andrés',
    lastNames: 'Ejemplo Pérez',
    email: 'carlos.docente@demo.local',
    phone: '3000000002',
    personStatus: 'Activo',
    profileType: 'Docente',
    studentCode: '',
    entryDate: '',
    academicStatus: 'Activo',
    teacherCode: 'DOC-DEMO-001',
    teacherStatus: 'Activo',
  },
  {
    id: 3,
    documentType: 'TI',
    documentNumber: 'DEMO-003',
    firstNames: 'Laura Sofía',
    lastNames: 'Ejemplo Rodríguez',
    email: 'laura.estudiante@demo.local',
    phone: '',
    personStatus: 'Activo',
    profileType: 'Estudiante',
    studentCode: 'EST-DEMO-002',
    entryDate: '2026-02-01',
    academicStatus: 'Activo',
    teacherCode: '',
    teacherStatus: 'Activo',
  },
];

function People() {
  const [people, setPeople] = useState(INITIAL_PEOPLE);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const filteredPeople = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return people;
    }

    return people.filter((person) => {
      const searchableValues = [
        person.documentType,
        person.documentNumber,
        person.firstNames,
        person.lastNames,
        person.email,
        person.studentCode,
        person.teacherCode,
        person.profileType,
        person.personStatus,
      ];

      return searchableValues.some((value) =>
        String(value || '')
          .toLowerCase()
          .includes(search)
      );
    });
  }, [people, searchTerm]);

  const pageCount = Math.max(1, Math.ceil(filteredPeople.length / PAGE_SIZE));

  const visiblePeople = filteredPeople.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const activePeople = people.filter((person) => person.personStatus === 'Activo').length;

  const studentProfiles = people.filter((person) => person.profileType === 'Estudiante').length;

  const teacherProfiles = people.filter((person) => person.profileType === 'Docente').length;

  function openCreateModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  }

  function openEditModal(person) {
    setEditingId(person.id);
    setForm({
      documentType: person.documentType,
      documentNumber: person.documentNumber,
      firstNames: person.firstNames,
      lastNames: person.lastNames,
      email: person.email,
      phone: person.phone,
      personStatus: person.personStatus,
      profileType: person.profileType,
      studentCode: person.studentCode,
      entryDate: person.entryDate,
      academicStatus: person.academicStatus,
      teacherCode: person.teacherCode,
      teacherStatus: person.teacherStatus,
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const documentNumber = form.documentNumber.trim();
    const studentCode = form.studentCode.trim();
    const teacherCode = form.teacherCode.trim();

    if (
      form.profileType === 'Estudiante' &&
      form.entryDate &&
      Number.isNaN(Date.parse(form.entryDate))
    ) {
      window.alert('La fecha de ingreso no es válida.');
      return;
    }

    const duplicateDocument = people.some(
      (person) =>
        person.id !== editingId &&
        person.documentType === form.documentType &&
        person.documentNumber.toLowerCase() === documentNumber.toLowerCase()
    );

    if (duplicateDocument) {
      window.alert('Ya existe una persona registrada con este tipo y número de documento.');
      return;
    }

    if (form.profileType === 'Estudiante' && studentCode) {
      const duplicateStudentCode = people.some(
        (person) =>
          person.id !== editingId && person.studentCode.toLowerCase() === studentCode.toLowerCase()
      );

      if (duplicateStudentCode) {
        window.alert('El código estudiantil ya está registrado.');
        return;
      }
    }

    if (form.profileType === 'Docente' && teacherCode) {
      const duplicateTeacherCode = people.some(
        (person) =>
          person.id !== editingId && person.teacherCode.toLowerCase() === teacherCode.toLowerCase()
      );

      if (duplicateTeacherCode) {
        window.alert('El código docente ya está registrado.');
        return;
      }
    }

    const personData = {
      ...form,
      documentNumber,
      firstNames: form.firstNames.trim(),
      lastNames: form.lastNames.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      studentCode: form.profileType === 'Estudiante' ? studentCode : '',
      teacherCode: form.profileType === 'Docente' ? teacherCode : '',
    };

    const message =
      editingId !== null
        ? '¿Confirma la actualización de los datos y el perfil de esta persona?'
        : '¿Confirma el registro de esta persona y su perfil?';

    if (!window.confirm(message)) {
      return;
    }

    if (editingId !== null) {
      setPeople((previousPeople) =>
        previousPeople.map((person) =>
          person.id === editingId ? { ...person, ...personData } : person
        )
      );
    } else {
      setPeople((previousPeople) => [
        {
          id: Date.now(),
          ...personData,
        },
        ...previousPeople,
      ]);

      setCurrentPage(1);
    }

    closeModal();
  }

  function togglePersonStatus(person) {
    const newStatus = person.personStatus === 'Activo' ? 'Inactivo' : 'Activo';

    const confirmed = window.confirm(
      `¿Confirma cambiar el estado de ${person.firstNames} ${person.lastNames} a ${newStatus}?`
    );

    if (!confirmed) {
      return;
    }

    setPeople((previousPeople) =>
      previousPeople.map((item) =>
        item.id === person.id ? { ...item, personStatus: newStatus } : item
      )
    );
  }

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  }

  return (
    <main className="people-page">
      <header className="people-header">
        <div>
          <span className="people-breadcrumb">ADMINISTRACIÓN / INFORMACIÓN ACADÉMICA</span>

          <h1>Personas y perfiles</h1>

          <p>
            Registra, consulta y actualiza los datos personales y los perfiles académicos de
            estudiantes y docentes.
          </p>
        </div>

        <button type="button" className="people-primary-button" onClick={openCreateModal}>
          + Nueva persona
        </button>
      </header>

      <div className="people-demo-notice">
        <strong>Vista de demostración:</strong> los registros y cambios se almacenan temporalmente
        en React. La integración con el backend y PostgreSQL está pendiente.
      </div>

      <section className="people-statistics">
        <article className="people-stat-card">
          <span>Total de personas</span>
          <strong>{people.length}</strong>
        </article>

        <article className="people-stat-card">
          <span>Personas activas</span>
          <strong>{activePeople}</strong>
        </article>

        <article className="people-stat-card">
          <span>Perfiles de estudiantes</span>
          <strong>{studentProfiles}</strong>
        </article>

        <article className="people-stat-card">
          <span>Perfiles de docentes</span>
          <strong>{teacherProfiles}</strong>
        </article>
      </section>

      <section className="people-table-section">
        <div className="people-section-heading">
          <div>
            <h2>Listado de personas</h2>
            <p>Busca por documento, código, nombre o tipo de perfil.</p>
          </div>
        </div>

        <div className="people-toolbar">
          <label htmlFor="people-search">Buscar persona</label>

          <input
            id="people-search"
            type="search"
            placeholder="Documento, código, nombre o perfil..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="people-table-container">
          <table className="people-table">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Nombre completo</th>
                <th>Correo electrónico</th>
                <th>Perfil</th>
                <th>Código académico</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {visiblePeople.map((person) => {
                const academicCode =
                  person.profileType === 'Estudiante' ? person.studentCode : person.teacherCode;

                return (
                  <tr key={person.id}>
                    <td className="people-document-cell">
                      <strong>{person.documentType}</strong>
                      <span>{person.documentNumber}</span>
                    </td>

                    <td>
                      {person.firstNames} {person.lastNames}
                    </td>

                    <td>{person.email || 'No registrado'}</td>

                    <td>
                      <span className="people-profile-tag">{person.profileType}</span>
                    </td>

                    <td>{academicCode || 'No asignado'}</td>

                    <td>
                      <span
                        className={`people-status ${
                          person.personStatus === 'Activo'
                            ? 'people-status-active'
                            : 'people-status-inactive'
                        }`}
                      >
                        {person.personStatus}
                      </span>
                    </td>

                    <td>
                      <div className="people-actions">
                        <button
                          type="button"
                          className="people-edit-button"
                          onClick={() => openEditModal(person)}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className="people-status-button"
                          onClick={() => togglePersonStatus(person)}
                        >
                          {person.personStatus === 'Activo' ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {visiblePeople.length === 0 && (
                <tr>
                  <td colSpan="7" className="people-empty-state">
                    No se encontraron personas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="people-pagination">
          <span>{filteredPeople.length} registro(s) encontrado(s)</span>

          <div className="people-pagination-controls">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
            >
              Anterior
            </button>

            <span>
              Página {currentPage} de {pageCount}
            </span>

            <button
              type="button"
              disabled={currentPage === pageCount}
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              Siguiente
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="people-modal-overlay">
          <section
            className="people-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="people-modal-title"
          >
            <header className="people-modal-header">
              <div>
                <span>GESTIÓN DE PERSONAS</span>

                <h2 id="people-modal-title">
                  {editingId !== null ? 'Editar persona y perfil' : 'Registrar persona y perfil'}
                </h2>
              </div>

              <button
                type="button"
                className="people-close-button"
                onClick={closeModal}
                aria-label="Cerrar formulario"
              >
                ×
              </button>
            </header>

            <form onSubmit={handleSubmit}>
              <section className="people-form-section">
                <h3>Datos personales</h3>

                <div className="people-form-grid">
                  <label>
                    Tipo de documento *
                    <select
                      name="documentType"
                      value={form.documentType}
                      onChange={handleChange}
                      required
                    >
                      <option value="CC">Cédula de ciudadanía</option>
                      <option value="TI">Tarjeta de identidad</option>
                      <option value="CE">Cédula de extranjería</option>
                      <option value="Pasaporte">Pasaporte</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </label>

                  <label>
                    Número de documento *
                    <input
                      type="text"
                      name="documentNumber"
                      value={form.documentNumber}
                      onChange={handleChange}
                      placeholder="Número de identificación"
                      required
                    />
                  </label>

                  <label>
                    Nombres *
                    <input
                      type="text"
                      name="firstNames"
                      value={form.firstNames}
                      onChange={handleChange}
                      placeholder="Nombres"
                      required
                    />
                  </label>

                  <label>
                    Apellidos *
                    <input
                      type="text"
                      name="lastNames"
                      value={form.lastNames}
                      onChange={handleChange}
                      placeholder="Apellidos"
                      required
                    />
                  </label>

                  <label>
                    Correo electrónico
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="persona@institucion.edu"
                    />
                  </label>

                  <label>
                    Teléfono
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Número de contacto"
                    />
                  </label>
                </div>
              </section>

              <section className="people-form-section">
                <h3>Perfil académico</h3>

                <label className="people-profile-select">
                  Tipo de perfil *
                  <select
                    name="profileType"
                    value={form.profileType}
                    onChange={handleChange}
                    required
                  >
                    <option value="Estudiante">Estudiante</option>
                    <option value="Docente">Docente</option>
                  </select>
                </label>

                {form.profileType === 'Estudiante' && (
                  <div className="people-profile-fields">
                    <div className="people-profile-description">
                      Información correspondiente al perfil académico del estudiante.
                    </div>

                    <div className="people-form-grid">
                      <label>
                        Código estudiantil (si aplica)
                        <input
                          type="text"
                          name="studentCode"
                          value={form.studentCode}
                          onChange={handleChange}
                          placeholder="Código del estudiante"
                        />
                      </label>

                      <label>
                        Fecha de ingreso
                        <input
                          type="date"
                          name="entryDate"
                          value={form.entryDate}
                          onChange={handleChange}
                        />
                      </label>

                      <label>
                        Estado académico
                        <select
                          name="academicStatus"
                          value={form.academicStatus}
                          onChange={handleChange}
                        >
                          <option value="Activo">Activo</option>
                          <option value="Inactivo">Inactivo</option>
                        </select>
                      </label>
                    </div>
                  </div>
                )}

                {form.profileType === 'Docente' && (
                  <div className="people-profile-fields">
                    <div className="people-profile-description">
                      Información correspondiente al perfil académico del docente.
                    </div>

                    <div className="people-form-grid">
                      <label>
                        Código docente (opcional)
                        <input
                          type="text"
                          name="teacherCode"
                          value={form.teacherCode}
                          onChange={handleChange}
                          placeholder="Código del docente"
                        />
                      </label>

                      <label>
                        Estado del docente
                        <select
                          name="teacherStatus"
                          value={form.teacherStatus}
                          onChange={handleChange}
                        >
                          <option value="Activo">Activo</option>
                          <option value="Inactivo">Inactivo</option>
                        </select>
                      </label>
                    </div>
                  </div>
                )}
              </section>

              <section className="people-form-section">
                <h3>Estado de la persona</h3>

                <label className="people-person-status-select">
                  Estado del registro
                  <select name="personStatus" value={form.personStatus} onChange={handleChange}>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </label>
              </section>

              <footer className="people-modal-actions">
                <button type="button" className="people-cancel-button" onClick={closeModal}>
                  Cancelar
                </button>

                <button type="submit" className="people-primary-button">
                  {editingId !== null ? 'Guardar cambios' : 'Registrar persona'}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default People;
