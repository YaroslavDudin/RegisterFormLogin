import React from 'react';
import { BiHide, BiShow } from "react-icons/bi";

function PasswordToggle({ isVisible, onToggle }) {
  return (
    <span className="toggle-icon" onClick={onToggle} style={{ cursor: 'pointer' }}>
      {isVisible ? <BiHide /> : <BiShow />}
    </span>
  );
}

export default PasswordToggle;
