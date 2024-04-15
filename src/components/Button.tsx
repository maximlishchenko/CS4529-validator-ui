import React from 'react';

// define interface for button props
interface ButtonProps {
  onClick: () => void; // callback function
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button className='validate-button' onClick={onClick}>{children}</button>
  );
};

// export component so it's accessible in App.tsx
export default Button;
