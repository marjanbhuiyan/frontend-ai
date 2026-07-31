import { useController } from "react-hook-form";
import type { Control } from "react-hook-form";
import { useRef, useState } from "react";

export interface ImageUploadRenderProps {
  preview: string | null;
  remove: () => void;
  openFileDialog: () => void;
  dragging: boolean;
}

export interface ImageUploadProps {
  control?: Control<any>;
  name?: string;
  label?: string;
  required?: boolean;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
  accept?: string[];
  className?: string;
  value?: File | File[] | null;
  onChange?: (value: File | File[] | null) => void;
  children?: ((props: ImageUploadRenderProps) => React.ReactNode);
}

function ImageUploadLegacy({
  control,
  name,
  label,
  required,
  multiple,
  maxFiles,
  maxSize,
  disabled,
  accept,
  className,
}: ImageUploadProps) {
  const { field, fieldState } = useController({ control: control!, name: name! });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (multiple) {
      const existing = Array.isArray(field.value) ? field.value : [];
      const incoming = Array.from(files);

      if (maxSize) {
        const oversized = incoming.some((f) => f.size > maxSize * 1024 * 1024);
        if (oversized) return;
      }

      if (maxFiles) {
        const total = existing.length + incoming.length;
        if (total > maxFiles) return;
      }

      if (accept) {
        const invalid = incoming.some((f) => !accept.includes(f.type));
        if (invalid) return;
      }

      field.onChange([...existing, ...incoming]);
    } else {
      const file = files[0];

      if (maxSize && file.size > maxSize * 1024 * 1024) return;

      if (accept && !accept.includes(file.type)) return;

      field.onChange(file);
    }
  };

  const removeFile = (index: number) => {
    if (!multiple || !Array.isArray(field.value)) return;
    const updated = field.value.filter((_: File, i: number) => i !== index);
    field.onChange(updated.length > 0 ? updated : null);
  };

  return (
    <div className={className}>

      {label && (
        <label className="mb-1 block text-sm font-medium">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <input
        type="file"
        accept={accept?.join(",")}
        multiple={multiple}
        disabled={disabled}
        onChange={handleChange}
      />

      {!multiple && field.value instanceof File && (
        <img
          src={URL.createObjectURL(field.value)}
          className="mt-2 h-32 w-32 rounded-md object-cover"
        />
      )}

      {multiple && Array.isArray(field.value) && field.value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {field.value.map((file: File, index: number) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                className="h-20 w-20 rounded-md object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}

      {fieldState.error && (
        <p className="mt-1 text-sm text-red-500">
          {fieldState.error.message}
        </p>
      )}

    </div>
  );
}

function ImageUploadRenderProp({
  value,
  onChange,
  multiple,
  maxFiles,
  maxSize,
  disabled,
  accept,
  className,
  children,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const currentValue = value ?? (multiple ? [] : null);

  const preview = !currentValue
    ? null
    : currentValue instanceof File
      ? URL.createObjectURL(currentValue)
      : Array.isArray(currentValue) && currentValue.length > 0 && currentValue[0] instanceof File
        ? URL.createObjectURL(currentValue[0])
        : null;

  const validateFiles = (files: File[]) => {
    if (maxSize) {
      if (files.some((f) => f.size > maxSize * 1024 * 1024)) return null;
    }
    if (accept) {
      if (files.some((f) => !accept.includes(f.type))) return null;
    }
    return files;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const incoming = Array.from(files);
    const validFiles = validateFiles(incoming);
    if (!validFiles) return;

    if (multiple) {
      const existing = Array.isArray(currentValue) ? currentValue : [];
      if (maxFiles && existing.length + incoming.length > maxFiles) return;
      onChange?.([...existing, ...validFiles]);
    } else {
      onChange?.(validFiles[0]);
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = () => {
    onChange?.(multiple ? [] : null);
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const incoming = Array.from(files);
    const validFiles = validateFiles(incoming);
    if (!validFiles) return;

    if (multiple) {
      const existing = Array.isArray(currentValue) ? currentValue : [];
      if (maxFiles && existing.length + incoming.length > maxFiles) return;
      onChange?.([...existing, ...validFiles]);
    } else {
      onChange?.(validFiles[0]);
    }
  };

  return (
    <div
      className={className}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept?.join(",")}
        multiple={multiple}
        disabled={disabled}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      {typeof children === "function" && children({ preview, remove, openFileDialog, dragging })}
    </div>
  );
}

export default function ImageUpload(props: ImageUploadProps) {
  if (typeof props.children === "function") {
    return <ImageUploadRenderProp {...props} />;
  }
  return <ImageUploadLegacy {...props} />;
}
