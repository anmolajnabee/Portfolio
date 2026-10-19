import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="block text-xs font-medium text-[#929292]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-[#121214] text-[#F5F5F5] placeholder-[#555] border border-white/[0.08] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#668CFF]/60 focus:ring-1 focus:ring-[#668CFF]/60 transition-colors ${
            error ? 'border-red-500/50' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="block text-xs font-medium text-[#929292]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full bg-[#121214] text-[#F5F5F5] placeholder-[#555] border border-white/[0.08] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#668CFF]/60 focus:ring-1 focus:ring-[#668CFF]/60 transition-colors ${
            error ? 'border-red-500/50' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
