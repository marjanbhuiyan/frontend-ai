import Select, {
  components,
  type OptionProps,
  type SingleValueProps,
  type DropdownIndicatorProps,
} from "react-select";
import { Store, Check, ChevronDown, Loader2 } from "lucide-react";
import type { StoreInfo } from "@/features/auth/types";
import type React from "react";

interface StoreOption {
  value: number;
  label: string;
  store: StoreInfo;
}

function PlanBadge(): React.JSX.Element {
  return (
    <span className="flex-shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[0.65rem] font-medium text-gray-500">
      Free
    </span>
  );
}

function SingleValue({ children, ...props }: SingleValueProps<StoreOption, false>): React.JSX.Element {
  return (
    <components.SingleValue {...props}>
      <span className="flex items-center gap-2">
        <Store className="h-3.5 w-3.5 flex-shrink-0 text-amber-600" />
        <span className="max-w-[130px] truncate">{children}</span>
        <PlanBadge />
      </span>
    </components.SingleValue>
  );
}

function Option(props: OptionProps<StoreOption, false>): React.JSX.Element {
  return (
    <components.Option {...props}>
      <span className="flex w-full items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2">
          <Store className="h-3.5 w-3.5 flex-shrink-0 text-amber-600" />
          <span className="truncate">{props.data.label}</span>
          <span className="flex-shrink-0 text-[0.65rem] text-gray-400">#{props.data.value}</span>
        </span>
        {props.isSelected && <Check className="h-3.5 w-3.5 flex-shrink-0 text-blue-600" />}
      </span>
    </components.Option>
  );
}

function DropdownIndicator(props: DropdownIndicatorProps<StoreOption, false>): React.JSX.Element {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
    </components.DropdownIndicator>
  );
}

function StoreSwitcher({
  stores,
  currentStore,
  onChange,
  isLoading,
}: {
  stores: StoreInfo[];
  currentStore: StoreInfo | null;
  onChange: (store: StoreInfo) => void;
  isLoading?: boolean;
}): React.JSX.Element{
  if (stores.length === 0) return null;

  const options: StoreOption[] = stores.map((store) => ({
    value: store.storeId,
    label: store.storeName,
    store,
  }));

  const value = options.find((option) => option.value === currentStore?.storeId) ?? null;

  return (
    <Select<StoreOption, false>
      instanceId="store-switcher"
      classNamePrefix="store-switcher"
      unstyled
      isSearchable
      isLoading={isLoading}
      isDisabled={isLoading}
      options={options}
      value={value}
      onChange={(option) => option && onChange(option.store)}
      placeholder="Select store"
      noOptionsMessage={() => "No stores found"}
      aria-label="Select store"
      components={{
        SingleValue,
        Option,
        DropdownIndicator,
        IndicatorSeparator: () => null,
        LoadingIndicator: () => <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />,
      }}
      classNames={{
        control: () =>
          "flex h-8 min-w-[180px] items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50",
        valueContainer: () => "flex-1 truncate",
        input: () => "text-xs text-gray-700",
        placeholder: () => "text-xs text-gray-400",
        indicatorsContainer: () => "flex items-center gap-1",
        menu: () => "z-50 mt-1 min-w-[220px] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-lg",
        menuList: () => "max-h-64 overflow-y-auto",
        option: ({ isFocused, isSelected }) =>
          `mt-0.5 flex cursor-pointer items-center rounded-md px-2 py-1.5 text-xs first:mt-0 ${
            isSelected
              ? "bg-blue-50 font-medium text-blue-600"
              : isFocused
                ? "bg-gray-50 text-gray-800"
                : "text-gray-600"
          }`,
        noOptionsMessage: () => "px-2 py-1.5 text-xs text-gray-400",
      }}
    />
  );
}

export default StoreSwitcher;
