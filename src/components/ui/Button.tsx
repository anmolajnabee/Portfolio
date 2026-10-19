import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#668CFF]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
    md: 'text-sm px-4 py-2 rounded-md gap-2',
    lg: 'text-sm px-5 py-2.5 rounded-lg gap-2',
  };

  const variantStyles = {
    primary:
      'bg-[#F5F5F5] text-[#0B0B0C] hover:bg-white hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)] active:scale-[0.99]',
    secondary:
      'bg-[#141416] text-[#F5F5F5] border border-white/[0.08] hover:border-white/[0.18] hover:bg-[#1A1A1E] active:scale-[0.99]',
    ghost:
      'text-[#929292] hover:text-[#F5F5F5] hover:bg-white/[0.04]',
    danger:
      'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 active:scale-[0.99]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
