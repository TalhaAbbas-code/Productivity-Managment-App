import React from "react";

const FormInput = ({
  label,
  name,
  register,
  required,
  errors,
  type = "text",
  validation = {},
  ...rest
}) => (
  <div>
    <label className="block text-secondary  font-semibold">
      {label}
      {required && " *"}
    </label>
    <input
      type={type}
      {...register(name, { required, ...validation })}
      className="w-full border text-black rounded p-2"
      {...rest}
    />
    {errors[name] && (
      <div className="text-red-500 text-sm">{errors[name].message}</div>
    )}
  </div>
);

export default FormInput;