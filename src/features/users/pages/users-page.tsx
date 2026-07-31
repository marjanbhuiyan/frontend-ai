import { DataTable } from "@/components/data-table";
import { usersTableConfig } from "../users.table";

export default function UsersPage(): React.JSX.Element {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Users</h1>
      <DataTable config={usersTableConfig} />
    </div>
  );
}
