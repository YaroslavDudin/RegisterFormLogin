import React, { forwardRef } from 'react';

const Input = forwardRef(({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  onKeyPress,
  onKeyDown,
  ...props
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      onKeyPress={onKeyPress}
      onKeyDown={onKeyDown}
      {...props}
    />
  );
});

export default Input;
