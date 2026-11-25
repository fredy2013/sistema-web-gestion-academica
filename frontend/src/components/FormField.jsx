function FormField({
  id,
  label,
  name,
  type = 'text',
  placeholder,
  autoComplete,
  required = false,
}) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>

      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
      />
    </div>
  );
}

export default FormField;
