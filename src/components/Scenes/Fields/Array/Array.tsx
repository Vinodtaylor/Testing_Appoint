"use client";

import { Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";

interface ArrayFieldProps {
  name: string;
  label: string;
  placeholder: string;
}

const ArrayField: React.FC<ArrayFieldProps> = ({ name, label, placeholder }) => {
  const { control, setValue, getValues } = useFormContext();
  const [items, setItems] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  useEffect(() => {
    const existingItems = getValues(name) || [];
    if (Array.isArray(existingItems)) {
      setItems(existingItems);
    }
  }, [name, getValues]);

  const handleCreateOrEdit = (value: string) => {
    if (editingIndex !== null) {
      if (editValue.trim() !== "") {
        const updatedItems = items.map((item, idx) =>
          idx === editingIndex ? editValue : item
        );
        setItems(updatedItems);
        setValue(name, updatedItems);
        setEditingIndex(null);
        setEditValue("");
      }
    } else if (value.trim() !== "") {
      const updatedItems = [...items, value];
      setItems(updatedItems);
      setValue(name, updatedItems);
    }
  };

  const handleRemove = (index: number) => {
    const updatedItems = items.filter((_, idx) => idx !== index);
    setItems(updatedItems);
    setValue(name, updatedItems);
  };

  return (
    <div>
      <div className="flex justify-between items-center lg:mb-2 mb-2">
        <label className="text-sm font-medium mb-2">{label}</label>
        <Controller
          name={`${name}_inputField`}
          defaultValue=""
          control={control}
          render={({ field }) => (
            <button
              type="button"
              onClick={() => {
                handleCreateOrEdit(field.value);
                field.onChange("");
              }}
              className="bg-blue-500 flex items-center gap-2 text-white rounded-md px-2 py-1 shadow-xl hover:shadow-2xl active:shadow-none active:scale-95 transition-all duration-200"
            >
              <Plus />
            </button>
          )}
        />
      </div>

      <Controller
        name={`${name}_inputField`}
        defaultValue=""
        control={control}
        render={({ field }) => (
          <div className="flex gap-2 mb-4">
            <input
              {...field}
              placeholder={placeholder}
              className="w-full p-2 placeholder:text-sm placeholder:px-4 shadow-md border border-gray-300 rounded-md outline-none"
            />
          </div>
        )}
      />

      <ul className="mt-2 flex flex-wrap gap-4">
        {items.map((item, index) => (
          <li key={index} className="flex justify-between items-center gap-2">
            <div className="relative lg:w-28 w-32 flex items-center gap-2">
              <p
                onClick={() => {
                  setEditingIndex(index);
                  setEditValue(item);
                }}
                className="px-4 bg-white drop-shadow-sm shadow-lg p-2 rounded-lg text-xs cursor-pointer w-full truncate"
              >
                {item}
              </p>

              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 transform translate-x-2 flex justify-center items-center text-red-500 p-1 transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArrayField;
