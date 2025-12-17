import React from "react";

const Select = ({ label, name, value, onChange, options, error }) => {
  return (
    <div className="mb-3">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`form-select ${error ? "is-invalid" : ""}`}
      >
        <option value="">Select Role</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default Select;
