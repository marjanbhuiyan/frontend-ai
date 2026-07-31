import { DataTable } from "@/components/data-table";
import { usersTableConfig } from "@/features/users/users.table";
import { mockUsers } from "@/features/users/users.mock";

export default function UsersPage(): React.JSX.Element {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">LIST</h1>
      <DataTable config={usersTableConfig} data={mockUsers} />
    </div>
  );
}
