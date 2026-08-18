import { useId } from "react";
import { Input } from "@/components/ui/input";

interface Props extends React.ComponentProps<typeof Input> {
  label: string;
  error?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export const InputField = ({ label, error, ref, ...props }: Props) => {
  const id = useId();

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium"
      >
        {label}
      </label>

      <Input ref={ref} id={id} {...props} />

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};

InputField.displayName = "InputField";
