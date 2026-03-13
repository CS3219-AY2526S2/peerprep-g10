import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  type?: string;
  isPassword?: boolean;
}

export const Input = ({ label, id, type = "text",isPassword = false, className = "", ...props}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        {label}
      </label>

      <div className="relative">
        <input
          {...props}
          id={id}
          type={inputType}
          className={`w-full p-4 border border-gray-200 rounded-xl bg-gray-50 
          focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all
          ${className}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff size = {20} /> : <Eye size ={20} />}
          </button>
        )}
      </div>
    </div>
  );
};