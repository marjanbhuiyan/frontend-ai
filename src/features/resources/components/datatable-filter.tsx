import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { filterSchema, type FilterFormValues } from "@/features/resources/schemas/filter.schema";
import { zodResolver } from "@hookform/resolvers/zod";

interface DataTableFilterProps {
  search?: string;
  placeholder?: string;
  onSearch: (search: string) => void;
}

const DataTableFilter = ({ search, placeholder = "Search...", onSearch }: DataTableFilterProps) => {
    const form = useForm<FilterFormValues>({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            search: search ?? "",
        },
    });

    function onSubmit(values: FilterFormValues): void {
        onSearch(values.search ?? "");
    }

    function clearSearch(): void {
        form.reset({ search: "" });
        onSearch("");
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-2">
                <FormField
                    control={form.control}
                    name="search"
                    render={({ field }) => (
                        <FormItem className="w-full max-w-xs">
                            <FormLabel>Search</FormLabel>
                            <FormControl>
                                <Input
                                    type="search"
                                    placeholder={placeholder}
                                    className="h-9"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" variant="default" size="sm" className="h-9 gap-1">
                    <Search className="size-4" />
                    Search
                </Button>
                {search && (
                    <Button type="button" variant="ghost" size="sm" className="h-9 gap-1" onClick={clearSearch}>
                        <X className="size-4" />
                        Clear
                    </Button>
                )}
            </form>
        </Form>
    );
};

export default DataTableFilter;
