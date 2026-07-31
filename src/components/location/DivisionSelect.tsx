import { useDivisions } from "@/hooks/use-location";
import Select from "react-select";

interface DivisionSelectProps {
  value?: string | number;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
}

export default function DivisionSelect({ value, onChange, onBlur, invalid }: DivisionSelectProps) {
  const { data, isLoading } = useDivisions();
  const divisions: { id: number; name: string }[] = Array.isArray(data) ? data : (data as any)?.data ?? [];
  const options = divisions.map((d) => ({ value: String(d.id), label: d.name }));

  return (
    <Select
      inputId="state"
      options={options}
      value={options.find((o) => o.value === String(value)) ?? null}
      onChange={(option) => onChange?.(option?.value ?? "")}
      onBlur={onBlur}
      isLoading={isLoading}
      placeholder="Select state"
      classNames={{
        control: () =>
          invalid
            ? "!ring-red-500 !shadow-[0_0_0_1px_#ef4444] rounded-none"
            : "!border-gray-200 !rounded-none",
      }}
    />
  );
}
