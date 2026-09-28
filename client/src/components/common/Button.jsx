import React from 'react';

const Button = React.forwardRef(
  (
    { variant = 'primary', type = 'button', className = '', children, ...props },
    ref
  ) => {
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      danger: 'btn-danger',
      dangerGhost: 'btn-danger-ghost',
      success: 'btn-success'
    };

    return (
      <button
        ref={ref}
        type={type}
        className={`${variants[variant] || variants.primary} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;