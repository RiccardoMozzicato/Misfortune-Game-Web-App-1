import React from "react";

function ButtonChoice({ title, className, disable, onClick }) {
  return (
    <i
      title={title}
      className={className}
      onClick={disable != null ? undefined : onClick}
      style={{
        pointerEvents: disable != null ? "none" : "auto",
        opacity: disable != null ? 0.5 : 1,
        cursor: disable != null ? "not-allowed" : "pointer",
      }}
      aria-disabled={disable}
      tabIndex={disable ? -1 : 0}
    ></i>
  );
}
export default ButtonChoice;
