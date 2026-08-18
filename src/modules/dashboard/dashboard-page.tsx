// import { useAppBootstrap } from "@/app/bootstrap/use-app-bootstrap";

export function DashboardPage() {
  // const { data } = useAppBootstrap();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Dashboard
        </h1>

        {/* <p className="text-muted-foreground">
          Welcome back,{" "}
          {data?.user.firstName}.
        </p> */}
      </div>

      {/* <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Account"
          value={
            data?.accountType ??
            "-"
          }
        />

        <DashboardCard
          title="Role"
          value={
            data?.accountType ===
            "store"
              ? data.storeRole
                  ?.name ?? "-"
              : data?.globalRole
                  ?.name ?? "-"
          }
        />

        <DashboardCard
          title="Store"
          value={
            data?.activeStore
              ?.name ?? "Global"
          }
        />

        <DashboardCard
          title="Permissions"
          value={String(
            data?.permissions
              .length ?? 0,
          )}
        />
      </div> */}
    </div>
  );
}

// function DashboardCard({
//   title,
//   value,
// }: {
//   title: string;
//   value: string;
// }) {
//   return (
//     <div className="rounded-lg border bg-card p-5">
//       <p className="text-sm text-muted-foreground">
//         {title}
//       </p>

//       <p className="mt-2 text-2xl font-semibold">
//         {value}
//       </p>
//     </div>
//   );
// }