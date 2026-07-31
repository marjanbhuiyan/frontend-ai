import { useDistricts } from "@/hooks/use-location";
import Select from "react-select";

interface DistrictSelectProps {
  divisionId?: string | number;
  value?: string | number;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
}

export default function DistrictSelect({ divisionId, value, onChange, onBlur, invalid }: DistrictSelectProps) {
  const { data, isLoading } = useDistricts(Number(divisionId));
  const districts: { id: number; name: string }[] = Array.isArray(data) ? data : (data as any)?.data ?? [];
  const options = districts.map((d) => ({ value: String(d.id), label: d.name }));

  return (
    <Select
      inputId="city"
      options={options}
      value={options.find((o) => o.value === String(value)) ?? null}
      onChange={(option) => onChange?.(option?.value ?? "")}
      onBlur={onBlur}
      isLoading={isLoading}
      isDisabled={!divisionId}
      placeholder={divisionId ? "Select city" : "Select a state first"}
      classNames={{
        control: () =>
          invalid
            ? "!ring-red-500 !shadow-[0_0_0_1px_#ef4444] rounded-none"
            : "!border-gray-200 !rounded-none",
      }}
    />
  );
}
