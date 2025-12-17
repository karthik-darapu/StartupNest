import React from "react";

const ButtonComponent = ({ text, type = "button", onClick }) => {
  return (
    <button
      type={type}
      className="btn btn-primary w-100"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default ButtonComponent;
