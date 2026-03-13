interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, className = '', ...props }: ButtonProps) => {
  const baseButton = `
    w-full py-4 bg-blue-600 text-white rounded-xl
    font-bold text-lg hover:bg-blue-700
    active:scale-[0.98] transition-all shadow-lg shadow-blue-100
  `;

  return (
    <button {...props} className={`${baseButton} ${className}`}>
      {children}
    </button>
  );
};