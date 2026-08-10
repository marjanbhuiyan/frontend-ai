import Select, {
  components,
  type OptionProps,
  type SingleValueProps,
  type DropdownIndicatorProps,
} from "react-select";
import { Store, Check, ChevronDown, Loader2 } from "lucide-react";
import type { StoreInfo } from "@/features/auth/types";
import type React from "react";
import { useMyStores } from "@/features/store/hooks/use-store";
import { useAuthStore } from "@/store/useAuthStore";

interface StoreOption {
  value: number;
  label: string;
  store: StoreInfo;
}

/**
 * Store objects come in two shapes: the fetched list uses `storeId`/
 * `storeName`, while the persisted session uses `id`/`name`. These helpers
 * resolve the numeric id / display name from either shape so the switcher can
 * always select and label the current store.
 */
type SessionStoreShape = {
  storeId?: number | null;
  id?: number | string | null;
  storeName?: string | null;
  name?: string | null;
  logo?: string | null;
};

function toStoreId(store: SessionStoreShape | null | undefined): number | null {
  const id = store?.storeId ?? store?.id;
  if (id == null) return null;
  const num = typeof id === "number" ? id : Number(id);
  return Number.isFinite(num) ? num : null;
}

function toStoreName(store: SessionStoreShape | null | undefined): string {
  return store?.storeName ?? store?.name ?? "";
}

function toStoreInfo(store: SessionStoreShape | null | undefined): StoreInfo {
  return {
    storeId: toStoreId(store) ?? 0,
    storeName: toStoreName(store),
    logo: store?.logo ?? null,
  };
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
  stores: storesProp,
  onChange,
  isLoading,
}: {
  stores: StoreInfo[] | null;
  currentStore: StoreInfo | null;
  onChange: (store: StoreInfo) => void;
  onOpen?: () => void;
  isLoading?: boolean;
}): React.JSX.Element {
  const myStoresQuery = useMyStores();
  const { stores: currentStores } = useAuthStore();

  console.log("currentStores", currentStores);

  // `stores` in the persisted session can be a single store object (legacy
  // data) or an array — normalize to a list before reading the active id.
  const rawStores = currentStores as unknown as SessionStoreShape | SessionStoreShape[];
  const currentStoresList: SessionStoreShape[] = Array.isArray(rawStores)
    ? rawStores
    : rawStores
      ? [rawStores]
      : [];

  const handleMenuOpen = () => {
    myStoresQuery.refetch();
  };

  const fetchedStores = myStoresQuery.data?.data ?? [];

  console.log("fetchedStores", fetchedStores);

  // The dropdown fetches fresh options on open (`useMyStores` is enabled on
  // demand), so until then fall back to the persisted session stores and then
  // the prop. Otherwise options are empty and `value` stays null even though
  // the user already has stores.
  const stores: SessionStoreShape[] = fetchedStores.length
    ? fetchedStores
    : currentStoresList.length
      ? currentStoresList
      : (storesProp ?? []);

  const options: StoreOption[] = stores.map((store) => {
    const info = toStoreInfo(store);
    return {
      value: info.storeId,
      label: info.storeName,
      store: info,
    };
  });

  const activeStoreId = toStoreId(currentStoresList[0]);

  const value = options.find((option) => option.value === activeStoreId) ?? null;

  console.log("value", value);

  return (
    <Select<StoreOption, false>
      instanceId="store-switcher"
      classNamePrefix="store-switcher"
      unstyled
      isSearchable
      isLoading={myStoresQuery.isFetching || isLoading}
      options={options}
      value={value}
      onChange={(option) => option && onChange(option.store)}
      onMenuOpen={handleMenuOpen}
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
