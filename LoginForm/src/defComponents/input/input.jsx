import React, { useState, forwardRef } from 'react';
import { BiHide, BiShow } from "react-icons/bi";
import './Input.css';

const Input = forwardRef(({ label, type = 'text', value, onChange, error, placeholder, className, onKeyPress, onKeyDown }, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="input-container">
      {label && <label>{label}</label>}
      <div className="input-wrapper">
        <input
          ref={ref}
          type={isPasswordVisible ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={className}
          onKeyPress={onKeyPress}
          onKeyDown={onKeyDown}  // добавлен пропс onKeyDown
        />
        {type === 'password' && (
          <span className="toggle-icon" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
            {isPasswordVisible ? <BiHide /> : <BiShow />}
          </span>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
});

export default Input;
