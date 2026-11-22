"use client";

import { useEffect, useRef, useState } from "react";
import { Listbox } from "@/components/ui/Listbox";

type Option = {
  label: string;
  value: string;
};

type AdminSelectProps = {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  options: Option[];
};

/**
 * Form select for the admin. UI comes from the shared Listbox; the hidden input
 * posts the value and fires input/change so form dirty-tracking keeps working.
 */
export function AdminSelect({ name, label, defaultValue = "", required = false, options }: AdminSelectProps) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const updateValue = (nextValue: string) => {
    setValue(nextValue);
    if (inputRef.current) {
      inputRef.current.value = nextValue;
      inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
      inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  const placeholder = `Select ${label.toLowerCase()}`;

  return (
    <>
      <input ref={inputRef} type="hidden" name={name} value={value} required={required} readOnly />
      <Listbox
        label={label}
        value={value}
        onChange={updateValue}
        placeholder={placeholder}
        options={[{ label: placeholder, value: "" }, ...options]}
      />
    </>
  );
}
