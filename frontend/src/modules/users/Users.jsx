import { useMemo, useState } from 'react';
import './Users.css';

const PAGE_SIZE = 5;

const PERMISSION_OPTIONS = [
  'Consultar usuarios',
  'Crear y editar usuarios',
  'Gestionar roles',
  'Gestionar permisos',
  'Consultar auditoría',
];

const INITIAL_USERS = [
  {
    id: 1,
    name: 'Administrador de demostración',
    username: 'admin.demo',
    email: 'admin@demo.local',
    role: 'Administrador',
    status: 'Activo',
    permissions: [...PERMISSION_OPTIONS],
  },
  {
    id: 2,
    name: 'Docente de demostración',
    username: 'docente.demo',
    email: 'docente@demo.local',
    role: 'Docente',
    status: 'Activo',
    permissions: ['Consultar usuarios'],
  },
  {
    id: 3,
    name: 'Estudiante de demostración',
    username: 'estudiante.demo',
    email: 'estudiante@demo.local',
    role: 'Estudiante',
    status: 'Inactivo',
    permissions: [],
  },
];

const EMPTY_FORM = {
  name: '',
  username: '',
  email: '',
  role: 'Estudiante',
};

function Users() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const filteredUsers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return users;
    }

    return users.filter((user) =>
      [user.name, user.username, user.email, user.role, user.status].some((value) =>
        value.toLowerCase().includes(search)
      )
    );
  }, [users, searchTerm]);

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

  const visibleUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const activeUsers = users.filter((user) => user.status === 'Activo').length;

  const inactiveUsers = users.filter((user) => user.status === 'Inactivo').length;

  function openCreateModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSelectedPermissions([]);
    setIsModalOpen(true);
  }

  function openEditModal(user) {
    setEditingId(user.id);

    setForm({
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    setSelectedPermissions(user.permissions);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSelectedPermissions([]);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  function togglePermission(permission) {
    setSelectedPermissions((previousPermissions) =>
      previousPermissions.includes(permission)
        ? previousPermissions.filter((item) => item !== permission)
        : [...previousPermissions, permission]
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    const userData = {
      ...form,
      name: form.name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      permissions: selectedPermissions,
    };

    const confirmationMessage = editingId
      ? '¿Confirma los cambios realizados en este usuario y sus permisos?'
      : '¿Confirma el registro de este nuevo usuario?';

    if (!window.confirm(confirmationMessage)) {
      return;
    }

    if (editingId !== null) {
      setUsers((previousUsers) =>
        previousUsers.map((user) => (user.id === editingId ? { ...user, ...userData } : user))
      );
    } else {
      setUsers((previousUsers) => [
        {
          id: Date.now(),
          ...userData,
          status: 'Activo',
        },
        ...previousUsers,
      ]);

      setCurrentPage(1);
    }

    closeModal();
  }

  function toggleUserStatus(user) {
    const newStatus = user.status === 'Activo' ? 'Inactivo' : 'Activo';

    const confirmed = window.confirm(`¿Confirma cambiar el estado de ${user.name} a ${newStatus}?`);

    if (!confirmed) {
      return;
    }

    setUsers((previousUsers) =>
      previousUsers.map((item) => (item.id === user.id ? { ...item, status: newStatus } : item))
    );
  }

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  }

  return (
    <main className="users-page">
      <header className="users-header">
        <div>
          <span className="users-breadcrumb">ADMINISTRACIÓN / SEGURIDAD</span>

          <h1>Usuarios y permisos</h1>

          <p>Administra las cuentas, los roles y los permisos de acceso al sistema.</p>
        </div>

        <button type="button" className="users-primary-button" onClick={openCreateModal}>
          + Nuevo usuario
        </button>
      </header>

      <div className="users-demo-notice">
        <strong>Vista de demostración:</strong> los registros y cambios se almacenan temporalmente
        en el navegador. La integración con el backend está pendiente.
      </div>

      <section className="users-statistics">
        <article className="users-stat-card">
          <span>Total de usuarios</span>
          <strong>{users.length}</strong>
        </article>

        <article className="users-stat-card">
          <span>Cuentas activas</span>
          <strong>{activeUsers}</strong>
        </article>

        <article className="users-stat-card">
          <span>Cuentas inactivas</span>
          <strong>{inactiveUsers}</strong>
        </article>
      </section>

      <section className="users-table-section">
        <div className="users-section-heading">
          <div>
            <h2>Listado de usuarios</h2>
            <p>Consulta y administra las cuentas registradas.</p>
          </div>
        </div>

        <div className="users-toolbar">
          <label htmlFor="user-search">Buscar usuario</label>

          <input
            id="user-search"
            type="search"
            placeholder="Nombre, usuario, correo o rol..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Correo electrónico</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {visibleUsers.map((user) => (
                <tr key={user.id}>
                  <td className="username-cell">{user.username}</td>

                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>
                    <span className="user-role">{user.role}</span>
                  </td>

                  <td>
                    <span
                      className={`user-status ${
                        user.status === 'Activo' ? 'status-active' : 'status-inactive'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td>
                    <div className="user-actions">
                      <button
                        type="button"
                        className="user-edit-button"
                        onClick={() => openEditModal(user)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="user-status-button"
                        onClick={() => toggleUserStatus(user)}
                      >
                        {user.status === 'Activo' ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {visibleUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="users-empty-state">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="users-pagination">
          <span>{filteredUsers.length} registro(s) encontrado(s)</span>

          <div className="pagination-controls">
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
        <div className="users-modal-overlay">
          <section
            className="users-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="users-modal-title"
          >
            <header className="users-modal-header">
              <div>
                <span>GESTIÓN DE CUENTAS</span>

                <h2 id="users-modal-title">
                  {editingId !== null ? 'Editar usuario' : 'Registrar usuario'}
                </h2>
              </div>

              <button
                type="button"
                className="users-close-button"
                onClick={closeModal}
                aria-label="Cerrar formulario"
              >
                ×
              </button>
            </header>

            <form onSubmit={handleSubmit}>
              <div className="users-form-grid">
                <label>
                  Nombre completo
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="Nombre del usuario"
                    required
                  />
                </label>

                <label>
                  Nombre de usuario
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleFormChange}
                    placeholder="Nombre de acceso"
                    required
                  />
                </label>

                <label>
                  Correo electrónico
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    placeholder="usuario@institucion.edu"
                    required
                  />
                </label>

                <label>
                  Rol del usuario
                  <select name="role" value={form.role} onChange={handleFormChange}>
                    <option value="Administrador">Administrador</option>

                    <option value="Docente">Docente</option>

                    <option value="Estudiante">Estudiante</option>

                    <option value="Soporte autorizado">Soporte autorizado</option>
                  </select>
                </label>
              </div>

              <fieldset className="users-permissions-fieldset">
                <legend>Permisos de acceso</legend>

                <p>Selecciona los permisos que tendrá esta cuenta.</p>

                <div className="users-permissions-list">
                  {PERMISSION_OPTIONS.map((permission) => (
                    <label className="permission-option" key={permission}>
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(permission)}
                        onChange={() => togglePermission(permission)}
                      />

                      {permission}
                    </label>
                  ))}
                </div>
              </fieldset>

              <footer className="users-modal-actions">
                <button type="button" className="users-cancel-button" onClick={closeModal}>
                  Cancelar
                </button>

                <button type="submit" className="users-primary-button">
                  {editingId !== null ? 'Guardar cambios' : 'Registrar usuario'}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default Users;
