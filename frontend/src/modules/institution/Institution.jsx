import { useState } from 'react';
import './Institution.css';

const INITIAL_CONFIGURATION = {
  legalName: 'Institución Educativa de Demostración',
  commercialName: 'Institución Demo',
  identification: 'DEMO-INST-001',
  contactEmail: 'contacto@institucion.demo',
  phone: '6040000000',
  timeZone: 'America/Bogota',
  minimumGrade: '0',
  maximumGrade: '5',
  passingGrade: '3',
  gradeDecimals: '2',
  roundingPolicy: 'matematico',
};

function Institution() {
  const [configuration, setConfiguration] = useState(INITIAL_CONFIGURATION);

  const [form, setForm] = useState(INITIAL_CONFIGURATION);
  const [history, setHistory] = useState([]);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setShowSavedMessage(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const minimum = Number(form.minimumGrade);
    const maximum = Number(form.maximumGrade);
    const passing = Number(form.passingGrade);
    const decimals = Number(form.gradeDecimals);

    if (!Number.isFinite(minimum) || !Number.isFinite(maximum) || !Number.isFinite(passing)) {
      window.alert('Introduce valores numéricos válidos para la escala.');
      return;
    }

    if (minimum >= maximum) {
      window.alert('La nota mínima debe ser inferior a la nota máxima.');
      return;
    }

    if (passing < minimum || passing > maximum) {
      window.alert('La nota aprobatoria debe estar dentro del rango de calificación.');
      return;
    }

    if (!Number.isInteger(decimals) || decimals < 0) {
      window.alert('La cantidad de decimales debe ser un número entero no negativo.');
      return;
    }

    try {
      new Intl.DateTimeFormat('es-CO', {
        timeZone: form.timeZone,
      }).format(new Date());
    } catch {
      window.alert('La zona horaria indicada no es válida.');
      return;
    }

    if (!form.legalName.trim() || !form.identification.trim()) {
      window.alert('El nombre legal y la identificación institucional son obligatorios.');
      return;
    }

    const confirmed = window.confirm('¿Confirma guardar la nueva configuración institucional?');

    if (!confirmed) {
      return;
    }

    const updatedConfiguration = {
      ...form,
      legalName: form.legalName.trim(),
      commercialName: form.commercialName.trim(),
      identification: form.identification.trim(),
      contactEmail: form.contactEmail.trim(),
      phone: form.phone.trim(),
    };

    setConfiguration(updatedConfiguration);

    setHistory((previousHistory) => [
      {
        id: Date.now(),
        date: new Date().toLocaleString('es-CO'),
        description: 'Actualización de configuración institucional',
        actor: 'Sesión de demostración',
      },
      ...previousHistory,
    ]);

    setForm(updatedConfiguration);
    setShowSavedMessage(true);
  }

  function restoreConfiguration() {
    const confirmed = window.confirm('¿Deseas restaurar los valores iniciales de demostración?');

    if (!confirmed) {
      return;
    }

    setForm(configuration);
    setShowSavedMessage(false);
  }

  return (
    <main className="institution-page">
      <header className="institution-header">
        <div>
          <span className="institution-breadcrumb">ADMINISTRACIÓN / PARÁMETROS GENERALES</span>

          <h1>Configuración institucional</h1>

          <p>
            Administra la identidad institucional y los parámetros generales de evaluación
            académica.
          </p>
        </div>
      </header>

      <div className="institution-demo-notice">
        <strong>Vista de demostración:</strong> los datos iniciales son ficticios. Los cambios se
        conservan temporalmente en React. La integración con el backend y PostgreSQL está pendiente.
      </div>

      {showSavedMessage && (
        <div className="institution-success-message" role="status">
          La configuración se actualizó correctamente en esta sesión de demostración.
        </div>
      )}

      <form className="institution-form" onSubmit={handleSubmit}>
        <section className="institution-section">
          <div className="institution-section-header">
            <div>
              <span className="institution-section-number">01</span>
              <h2>Identidad institucional</h2>
              <p>Información que identifica oficialmente a la institución.</p>
            </div>
          </div>

          <div className="institution-fields-grid">
            <label className="institution-field">
              Nombre legal *
              <input
                type="text"
                name="legalName"
                value={form.legalName}
                onChange={handleChange}
                placeholder="Nombre legal de la institución"
                required
              />
            </label>

            <label className="institution-field">
              Nombre comercial
              <input
                type="text"
                name="commercialName"
                value={form.commercialName}
                onChange={handleChange}
                placeholder="Nombre comercial"
              />
            </label>

            <label className="institution-field institution-field-full">
              Identificación institucional *
              <input
                type="text"
                name="identification"
                value={form.identification}
                onChange={handleChange}
                placeholder="Identificación institucional o tributaria"
                required
              />
            </label>
          </div>
        </section>

        <section className="institution-section">
          <div className="institution-section-header">
            <div>
              <span className="institution-section-number">02</span>
              <h2>Información de contacto</h2>
              <p>Canales de comunicación y configuración regional.</p>
            </div>
          </div>

          <div className="institution-fields-grid">
            <label className="institution-field">
              Correo electrónico de contacto
              <input
                type="email"
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleChange}
                placeholder="contacto@institucion.edu"
              />
            </label>

            <label className="institution-field">
              Teléfono institucional
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Teléfono de contacto"
              />
            </label>

            <label className="institution-field institution-field-full">
              Zona horaria institucional *
              <input
                type="text"
                name="timeZone"
                value={form.timeZone}
                onChange={handleChange}
                placeholder="America/Bogota"
                required
              />
              <span className="institution-field-help">
                Utiliza una zona horaria IANA. Ejemplo: America/Bogota.
              </span>
            </label>
          </div>
        </section>

        <section className="institution-section">
          <div className="institution-section-header">
            <div>
              <span className="institution-section-number">03</span>
              <h2>Escala de calificación</h2>
              <p>Define los límites y el umbral de aprobación académica.</p>
            </div>
          </div>

          <div className="institution-fields-grid institution-grades-grid">
            <label className="institution-field">
              Nota mínima *
              <input
                type="number"
                name="minimumGrade"
                value={form.minimumGrade}
                onChange={handleChange}
                step="any"
                required
              />
            </label>

            <label className="institution-field">
              Nota máxima *
              <input
                type="number"
                name="maximumGrade"
                value={form.maximumGrade}
                onChange={handleChange}
                step="any"
                required
              />
            </label>

            <label className="institution-field">
              Nota aprobatoria *
              <input
                type="number"
                name="passingGrade"
                value={form.passingGrade}
                onChange={handleChange}
                step="any"
                required
              />
            </label>
          </div>

          <div className="institution-scale-preview">
            <span>Vista previa de la escala</span>

            <strong>
              {form.minimumGrade || '—'} a {form.maximumGrade || '—'}
            </strong>

            <p>Nota aprobatoria: {form.passingGrade || '—'}</p>
          </div>
        </section>

        <section className="institution-section">
          <div className="institution-section-header">
            <div>
              <span className="institution-section-number">04</span>
              <h2>Precisión y política de redondeo</h2>
              <p>Establece cómo se representarán las notas académicas.</p>
            </div>
          </div>

          <div className="institution-fields-grid">
            <label className="institution-field">
              Cantidad de decimales *
              <input
                type="number"
                name="gradeDecimals"
                value={form.gradeDecimals}
                onChange={handleChange}
                min="0"
                step="1"
                required
              />
              <span className="institution-field-help">Debe ser un número entero no negativo.</span>
            </label>

            <label className="institution-field">
              Política de redondeo *
              <select
                name="roundingPolicy"
                value={form.roundingPolicy}
                onChange={handleChange}
                required
              >
                <option value="matematico">Redondeo matemático</option>

                <option value="par">Redondeo al par</option>

                <option value="truncamiento">Truncamiento</option>
              </select>
            </label>
          </div>

          <div className="institution-policy-notice">
            <strong>Importante:</strong> las opciones de redondeo son alternativas de demostración.
            La institución debe aprobar la política que se utilizará oficialmente. El cálculo
            definitivo de resultados deberá realizarse en el backend.
          </div>
        </section>

        <footer className="institution-form-actions">
          <button
            type="button"
            className="institution-secondary-button"
            onClick={restoreConfiguration}
          >
            Restaurar valores guardados
          </button>

          <button type="submit" className="institution-primary-button">
            Guardar configuración
          </button>
        </footer>
      </form>

      <section className="institution-history-section">
        <div>
          <h2>Historial de modificaciones</h2>
          <p>Cambios realizados durante la sesión de demostración.</p>
        </div>

        {history.length === 0 ? (
          <div className="institution-history-empty">
            No hay modificaciones registradas en esta sesión.
          </div>
        ) : (
          <div className="institution-history-table-container">
            <table className="institution-history-table">
              <thead>
                <tr>
                  <th>Fecha y hora</th>
                  <th>Descripción</th>
                  <th>Actor</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>{item.description}</td>
                    <td>{item.actor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Institution;
