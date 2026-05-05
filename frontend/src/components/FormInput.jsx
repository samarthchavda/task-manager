import React from 'react';

// Reusable form input component with validation
const FormInput = ({ label, type = 'text', value, onChange, error, placeholder, required = false, rows }) => {
  const isTextarea = type === 'textarea';

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {isTextarea ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 4}
          className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FormInput;
