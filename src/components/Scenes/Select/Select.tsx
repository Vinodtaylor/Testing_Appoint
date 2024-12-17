import React, { useState, useEffect, useRef } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';

interface SelectDropDownProps {
  options: string[];
  label?: string;
  onChange: (option: string) => void;
  value: string;
  placeholder?: string;
  id: string;
  icon?: [React.ReactNode, React.ReactNode];
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  dropdownClassName?: string;
}

const SelectDropDown: React.FC<SelectDropDownProps> = ({
  options,
  label,
  onChange,
  value,
  placeholder,
  id,
  icon,
  containerClassName,
  labelClassName,
  inputClassName,
  dropdownClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const [CustomIconDown, CustomIconUp] = icon && Array.isArray(icon)
    ? icon
    : [
        <IoMdArrowDropdown key="down-icon" size={20} />,
        <IoMdArrowDropup key="up-icon" size={20} />,
      ];

  return (
    <div className={`relative ${containerClassName || ''}`} ref={dropdownRef}>
      {label && (
        <label
          htmlFor={id}
          className={`block font-medium ${labelClassName || ''}`}
        >
          {label}
        </label>
      )}
      <div
        onClick={toggleDropdown}
        className={`mt-1 cursor-pointer border px-3 py-2 flex justify-between items-center ${inputClassName || ''}`}
        id={id}
      >
        <span className="whitespace-nowrap px-4">
          {value || placeholder || 'Select an option'}
        </span>
        {isOpen ? CustomIconUp : CustomIconDown}
      </div>
      {isOpen && (
        <div
          className={`absolute z-50 w-full max-h-[200px] overflow-auto mt-1 bg-white border border-gray-300 rounded-lg shadow-lg ${dropdownClassName || ''}`}
        >
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleOptionClick(option)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectDropDown;
