import React from "react";

const InputField = ({
  label,
  name,
  type,
  value,
  onChange,
  error,
  rightElement,
  placeholder, 
}) => {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
        </label>
      )}

      <div className="input-group">
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`form-control ${error ? "is-invalid" : ""}`}
        />

        {rightElement && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            tabIndex="-1"
          >
            {rightElement}
          </button>
        )}
      </div>

      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default InputField;
