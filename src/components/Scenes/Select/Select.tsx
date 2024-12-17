import React, { useState } from 'react';
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

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const [CustomIconDown, CustomIconUp] = icon && Array.isArray(icon)
    ? icon
    : [
        <IoMdArrowDropdown key="down-icon"  size={20} />,
        <IoMdArrowDropup key="up-icon" size={20} />,
      ];

  return (
    <div className={`relative  ${containerClassName || ''}`}>
      {label && (
        <label
          htmlFor={id}
          className={`block  font-medium  ${labelClassName || ''}`}
        >
          {label}
        </label>
      )}
      <div
        onClick={toggleDropdown}
        className={`mt-1 cursor-pointer border px-3 py-2 flex justify-between items-center ${inputClassName || ''}`}
        id={id}
      >
        <span className=' whitespace-nowrap px-4'>{value || placeholder || 'Select an option'}</span>
        {isOpen ? CustomIconUp : CustomIconDown}
      </div>
      {isOpen && (
        <div
          className={`absolute z-10 w-full  max-h-[200px] overflow-scroll  mt-1 bg-white border border-gray-300 rounded-lg shadow-lg ${dropdownClassName || ''}`}
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
