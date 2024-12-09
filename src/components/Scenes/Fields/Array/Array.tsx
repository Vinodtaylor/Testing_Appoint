import React, { useEffect } from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Plus, Trash } from "lucide-react";

interface ArrayFieldProps {
  name: string;
  label: string;
  placeholder: string;
}

const ArrayField: React.FC<ArrayFieldProps> = ({ name, label, placeholder }) => {
  const { control, setValue, getValues } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name, // Ensure this corresponds to the key in your form default values
  });

  const handleEdit = (index: number, value: string) => {
    setValue(`${name}[${index}].value`, value);
  };

  useEffect(() => {
    const formValues = getValues();
    console.log("Form Values:", formValues);
  }, [getValues, fields]);

  return (
    <div>
      <div className="flex justify-between items-center  mb-2">
        <label htmlFor={`${name}_inputField`} className="block text-sm font-medium">
          {label}
        </label>
        <Controller
          name={`${name}_inputField`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <button
              type="button"
              onClick={() => {
                const trimmedValue = field.value.trim();
                if (trimmedValue) {
                  append({ id: Date.now().toString(), value: trimmedValue });
                  field.onChange(""); // Clear input
                }
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
        control={control}
        defaultValue=""
        render={({ field }) => (
          <div className="flex gap-2 mb-4">
            <input
              {...field}
              id={`${name}_inputField`}
              placeholder={placeholder}
              className="w-full p-2 placeholder:text-sm placeholder:px-4 shadow-md border border-gray-300 rounded-md outline-none"
            />
          </div>
        )}
      />

      <ul className="mt-2 flex flex-wrap gap-4">
        {fields.map((field, index) => (
          <li key={field.id} className="flex justify-between items-center gap-2">
            <div className="relative flex items-center gap-2">
            <p
  className="px-4 bg-white drop-shadow-sm shadow-lg p-2 rounded-full text-xs cursor-pointer w-full truncate"
  onClick={() => handleEdit(index, (field as { id: string, value: string }).value || "")}
>
  {(field as { id: string, value: string }).value || ""}
</p>

              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-0 right-0 transform translate-x-2 -translate-y-1 flex justify-center items-center rounded-full text-red-500 hover:bg-gray-100 p-1 transition-all"
              >
                <Trash size={15} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArrayField;
