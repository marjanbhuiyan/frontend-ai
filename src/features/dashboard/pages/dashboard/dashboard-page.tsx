import { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Download,
  ChevronDown,
  Target,
  Check,
  X,
  Clock,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import type React from "react";

/* ------------------------------------------------------------------ */
/* Mock data                                                          */
/* ------------------------------------------------------------------ */

const _totalUsersChart = [42, 48, 40, 55, 50, 62, 58, 66, 60, 70, 64, 74, 68, 78, 72, 82, 76, 86].map(
  (v, x) => ({ x, v }),
);

const _totalOrderChart = [
  95, 85, 78, 88, 70, 60, 52, 45, 40, 34, 30, 28, 26, 24, 22, 21, 20, 19,
].map((v, x) => ({ x, v }));

const _totalSalesChart = [30, 55, 40, 70, 45, 65, 50, 80, 42, 60, 38, 72, 48, 66, 34, 58, 44, 62].map(
  (v, x) => ({ x, v }),
);

const _totalMarketingChart = [
  40, 35, 50, 44, 60, 52, 48, 66, 58, 70, 62, 80, 70, 86, 76, 90,
].map((v, x) => ({ x, v }));

const incomeData = [
  { day: "Mon", v: 100 },
  { day: "Tue", v: 22 },
  { day: "Wed", v: 60 },
  { day: "Thu", v: 20 },
  { day: "Fri", v: 20 },
  { day: "Sat", v: 82 },
  { day: "Sun", v: 20 },
];

const analyticsReportData = [
  { m: "Jun", v: 90 },
  { m: "Jul", v: 30 },
  { m: "Aug", v: 70 },
  { m: "Sep", v: 25 },
  { m: "Oct", v: 60 },
  { m: "Nov", v: 88 },
  { m: "Dec", v: 55 },
];

const salesReportData = [
  { date: "07.06", income: 170, cost: 110 },
  { date: "08.06", income: 90, cost: 40 },
  { date: "09.06", income: 130, cost: 145 },
  { date: "10.06", income: 110, cost: 150 },
  { date: "11.06", income: 120, cost: 165 },
  { date: "12.06", income: 195, cost: 140 },
  { date: "13.06", income: 130, cost: 95 },
];

const acquisitionData = [
  { m: "Jan", direct: 30, referral: 20, social: 15 },
  { m: "Feb", direct: 35, referral: 25, social: 18 },
  { m: "Mar", direct: 40, referral: 22, social: 20 },
  { m: "Apr", direct: 45, referral: 28, social: 22 },
  { m: "May", direct: 50, referral: 30, social: 18 },
  { m: "Jun", direct: 42, referral: 26, social: 24 },
  { m: "Jul", direct: 55, referral: 32, social: 20 },
  { m: "Aug", direct: 48, referral: 28, social: 26 },
  { m: "Sep", direct: 60, referral: 35, social: 22 },
  { m: "Oct", direct: 52, referral: 30, social: 24 },
  { m: "Nov", direct: 58, referral: 34, social: 20 },
  { m: "Dec", direct: 50, referral: 28, social: 22 },
];

const pageViews = [
  { title: "Admin Home", path: "/demo/admin/index.html", views: 7755, pct: "31.74% (-100.0%)" },
  { title: "Form Elements", path: "/demo/admin/forms.html", views: 5215, pct: "28.53% (-100.0%)" },
  { title: "Utilities", path: "/demo/admin/util.html", views: 4848, pct: "25.35% (-100.0%)" },
  { title: "Form Validation", path: "/demo/admin/validation.html", views: 3275, pct: "23.17% (-100.0%)" },
  { title: "Modals", path: "/demo/admin/modals.html", views: 3003, pct: "22.21% (-100.0%)" },
];

const recentOrders: {
  tracking: string;
  product: string;
  order: number;
  status: "Rejected" | "Approved" | "Pending";
  amount: string;
}[] = [
  { tracking: "13256498", product: "Keyboard", order: 125, status: "Rejected", amount: "$70,999" },
  { tracking: "13286564", product: "Computer Accessories", order: 100, status: "Approved", amount: "$83,348" },
  { tracking: "84564564", product: "Camera Lens", order: 40, status: "Rejected", amount: "$40,570" },
  { tracking: "86739658", product: "TV", order: 99, status: "Pending", amount: "$410,780" },
  { tracking: "98652366", product: "Handset", order: 50, status: "Approved", amount: "$10,239" },
  { tracking: "98753263", product: "Mouse", order: 89, status: "Rejected", amount: "$10,570" },
  { tracking: "98753275", product: "Desktop", order: 185, status: "Approved", amount: "$98,063" },
  { tracking: "98753291", product: "Chair", order: 100, status: "Pending", amount: "$14,001" },
  { tracking: "98756325", product: "Mobile", order: 355, status: "Approved", amount: "$90,989" },
  { tracking: "98764564", product: "Laptop", order: 300, status: "Pending", amount: "$180,139" },
];

const statusDot: Record<string, string> = {
  Rejected: "bg-red-500",
  Approved: "bg-green-500",
  Pending: "bg-amber-500",
};

const transactions = [
  { icon: "success" as const, label: "Payment from #002434", time: "Today, 2:00 AM", amount: "+ $1,430", pct: "78%" },
  { icon: "error" as const, label: "Payment from #002434", time: "Today, 6:00 AM", amount: "+ $302", pct: "8%" },
  { icon: "pending" as const, label: "Pending from #002435", time: "Today, 2:00 AM", amount: "+ $682", pct: "16%" },
];

const taskProgress = [
  { label: "Published Project", pct: 30, color: "bg-blue-500" },
  { label: "Completed Task", pct: 90, color: "bg-green-500" },
  { label: "Pending Task", pct: 50, color: "bg-red-400" },
  { label: "Issues", pct: 55, color: "bg-amber-500" },
];

function TrendBadge({
  value,
  direction,
  color,
}: {
  value: string;
  direction: "up" | "down";
  color: "blue" | "red" | "amber";
}): React.JSX.Element {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-500",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <span className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[0.7rem] font-semibold ${colorMap[color]}`}>
      {direction === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {value}
    </span>
  );
}

function _StatCard({
  label,
  value,
  trendValue,
  direction,
  color,
  children,
}: {
  label: string;
  value: string;
  trendValue: string;
  direction: "up" | "down";
  color: "blue" | "red" | "amber";
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Card className="overflow-hidden">
      <div className="px-5 pt-4">
        <p className="text-xs text-gray-500">{label}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-xl font-semibold text-gray-800">{value}</span>
          <TrendBadge value={trendValue} direction={direction} color={color} />
        </div>
      </div>
      <div className="mt-3 h-14">{children}</div>
    </Card>
  );
}

function _WelcomeBanner(): React.JSX.Element {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-blue-400 px-8 py-8">
      <div className="relative z-10 max-w-md">
        <h1 className="text-2xl font-bold text-white">Welcome to Mantis</h1>
        <p className="mt-3 text-sm leading-relaxed text-blue-100">
          The purpose of a product update is to add new features, fix bugs or improve the
          performance of the product.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-5 border-white/40 bg-white/10 text-white hover:bg-white/20"
        >
          View Full Statistic
        </Button>
      </div>
      <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 sm:block">
        <svg width="130" height="110" viewBox="0 0 130 110" fill="none">
          <rect x="20" y="10" width="90" height="60" rx="8" fill="white" fillOpacity="0.12" />
          <rect x="32" y="22" width="66" height="36" rx="3" fill="white" fillOpacity="0.25" />
          <circle cx="95" cy="85" r="18" fill="white" fillOpacity="0.15" />
          <circle cx="25" cy="90" r="10" fill="white" fillOpacity="0.15" />
        </svg>
      </div>
    </div>
  );
}

function _IncomeOverviewCard(): React.JSX.Element {
  const [range, setRange] = useState<"Week" | "Month">("Week");

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-0">
        <div>
          <CardTitle className="text-sm font-semibold text-gray-800">Income Overview</CardTitle>
          <p className="mt-2 text-sm font-semibold text-red-500">▼ $1,12,900 (45.67%)</p>
          <p className="mt-1 text-xs text-gray-400">Compare to : 01 Dec 2021-08 Jan 2022</p>
        </div>
        <div className="flex items-center gap-1">
          {(["Week", "Month"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setRange(tab)}
              className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                range === tab ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
          <button className="ml-1 flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600">
            By Volume
            <ChevronDown className="h-3 w-3" />
          </button>
          <button className="ml-1 flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-50">
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={230}>
          <AreaChart data={incomeData} margin={{ left: -20 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#eef1f5" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="v" stroke="#2563eb" strokeWidth={2} fill="url(#incomeGrad)" dot={{ r: 3, fill: "#2563eb" }} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function _PageViewsCard(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-gray-800">Page Views by Page Title</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {pageViews.map((page) => (
          <div key={page.path} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-800">{page.title}</p>
              <p className="truncate text-xs text-gray-400">{page.path}</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-sm font-semibold text-blue-600">{page.views.toLocaleString()}</p>
              <p className="text-[0.68rem] text-gray-400">{page.pct}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function _RecentOrdersCard(): React.JSX.Element {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold text-gray-800">Recent Orders</CardTitle>
        <MoreHorizontal className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-2 text-left text-[0.68rem] font-semibold uppercase tracking-wider text-gray-400">Tracking No.</th>
                <th className="py-2 text-left text-[0.68rem] font-semibold uppercase tracking-wider text-gray-400">Product Name</th>
                <th className="py-2 text-right text-[0.68rem] font-semibold uppercase tracking-wider text-gray-400">Total Order</th>
                <th className="py-2 text-left text-[0.68rem] font-semibold uppercase tracking-wider text-gray-400">Status</th>
                <th className="py-2 text-right text-[0.68rem] font-semibold uppercase tracking-wider text-gray-400">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.tracking} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 text-blue-600">{order.tracking}</td>
                  <td className="py-2.5 text-gray-700">{order.product}</td>
                  <td className="py-2.5 text-right text-gray-700">{order.order}</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1.5 text-gray-600">
                      <span className={`h-1.5 w-1.5 rounded-full ${statusDot[order.status]}`} />
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-medium text-gray-800">{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function _AnalyticsReportCard(): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold text-gray-800">Analytics Report</CardTitle>
        <MoreHorizontal className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Company Finance Growth</span>
          <span className="font-semibold text-green-600">+45.14%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Company Expenses Ratio</span>
          <span className="font-semibold text-gray-800">0.58%</span>
        </div>
        <div className="flex items-center justify-between border-b border-gray-50 pb-3 text-sm">
          <span className="text-gray-500">Business Risk Cases</span>
          <span className="font-semibold text-gray-800">Low</span>
        </div>
        <ResponsiveContainer width="100%" height={130}>
          <LineChart data={analyticsReportData}>
            <XAxis dataKey="m" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function _SalesReportCard(): React.JSX.Element {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold text-gray-800">Sales Report</CardTitle>
        <button className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600">
          Today
          <ChevronDown className="h-3 w-3" />
        </button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-400">Net Profit</p>
            <p className="text-2xl font-semibold text-gray-800">$1560</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Income
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" /> Cost of Sales
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={salesReportData} margin={{ left: -20, top: 20 }} barGap={4}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#eef1f5" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="income" fill="#f5a623" radius={[3, 3, 0, 0]} barSize={10} />
            <Bar dataKey="cost" fill="#2563eb" radius={[3, 3, 0, 0]} barSize={10} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

const transactionIcon: Record<string, { icon: React.ReactNode; classes: string }> = {
  success: { icon: <Check className="h-4 w-4" />, classes: "bg-green-50 text-green-600" },
  error: { icon: <X className="h-4 w-4" />, classes: "bg-red-50 text-red-500" },
  pending: { icon: <Clock className="h-4 w-4" />, classes: "bg-blue-50 text-blue-600" },
};

function _TransactionHistoryCard(): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-gray-800">Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {transactions.map((tx, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${transactionIcon[tx.icon].classes}`}>
              {transactionIcon[tx.icon].icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-800">{tx.label}</p>
              <p className="text-xs text-gray-400">{tx.time}</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-sm font-semibold text-gray-800">{tx.amount}</p>
              <p className="text-xs text-gray-400">{tx.pct}</p>
            </div>
          </div>
        ))}

        <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Help & Support Chat</p>
              <p className="text-xs text-gray-400">Typical replay within 5 min</p>
            </div>
            <div className="flex -space-x-2">
              {["bg-blue-400", "bg-green-400", "bg-amber-400"].map((c, i) => (
                <span key={i} className={`h-6 w-6 rounded-full border-2 border-white ${c}`} />
              ))}
            </div>
          </div>
          <Button size="xs" className="mt-3">
            Need Help?
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function _TaskProgressCard(): React.JSX.Element {
  return (
    <Card className="lg:col-span-2">
      <CardContent className="space-y-4 pt-5">
        {taskProgress.map((task) => (
          <div key={task.label} className="flex items-center gap-4 text-sm">
            <span className="w-36 flex-shrink-0 text-gray-600">{task.label}</span>
            <div className="h-1.5 flex-1 rounded-full bg-gray-100">
              <div className={`h-full rounded-full ${task.color}`} style={{ width: `${task.pct}%` }} />
            </div>
            <span className="w-10 flex-shrink-0 text-right text-gray-500">{task.pct}%</span>
          </div>
        ))}

        <div className="flex items-start gap-3 border-t border-gray-100 pt-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Income Salaries & Budget</p>
            <p className="mt-0.5 text-xs text-gray-400">
              All your income salaries and budget comes here, you can track them or manage them
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function _AcquisitionChannelsCard(): React.JSX.Element {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-sm font-semibold text-gray-800">Acquisition Channels</CardTitle>
          <p className="text-xs text-gray-400">Marketing</p>
        </div>
        <span className="rounded px-1.5 py-0.5 text-xs font-semibold text-green-600">+128</span>
      </CardHeader>
      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={acquisitionData} barSize={6}>
            <Bar dataKey="direct" stackId="a" fill="#1e3a8a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="referral" stackId="a" fill="#2563eb" radius={[0, 0, 0, 0]} />
            <Bar dataKey="social" stackId="a" fill="#93c5fd" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-2 flex items-center justify-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-900" /> Direct
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-600" /> Referral
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-300" /> Social
          </span>
        </div>

        <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-gray-600">
              <ArrowUpRight className="h-4 w-4 rounded bg-green-50 p-0.5 text-green-600" />
              Top Channels
            </span>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">+$1,430</p>
              <p className="text-xs text-gray-400">35%</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-gray-600">
              <ArrowDownRight className="h-4 w-4 rounded bg-red-50 p-0.5 text-red-500" />
              Top Pages
            </span>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">-$1430</p>
              <p className="text-xs text-gray-400">35%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function _LearningBannerCard(): React.JSX.Element {
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-400 lg:col-span-2">
      <CardContent className="relative z-10 py-6">
        <p className="text-base font-semibold text-white">What would you want to learn today</p>
        <p className="mt-1 text-xs text-blue-100">Your learning capacity is 80% as daily analytics</p>
        <p className="mt-6 text-xl font-bold text-white">35% Completed</p>
        <div className="mt-2 h-1.5 w-full max-w-xs rounded-full bg-white/25">
          <div className="h-full w-[35%] rounded-full bg-green-400" />
        </div>
      </CardContent>
      <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 sm:block">
        <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
          <rect x="10" y="60" width="70" height="10" rx="2" fill="white" fillOpacity="0.25" />
          <rect x="18" y="48" width="54" height="10" rx="2" fill="white" fillOpacity="0.2" />
          <circle cx="45" cy="25" r="16" fill="white" fillOpacity="0.15" />
        </svg>
      </div>
    </Card>
  );
}

function _GetStartedCard(): React.JSX.Element {
  return (
    <Card>
      <CardContent className="py-6">
        <p className="text-sm font-semibold text-gray-800">Get started with new basic skills</p>
        <p className="mt-1 text-xs text-gray-400">Last Date 5th Nov 2020</p>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex -space-x-2">
            {["bg-pink-400", "bg-amber-400", "bg-green-400"].map((c, i) => (
              <span key={i} className={`h-7 w-7 rounded-full border-2 border-white ${c}`} />
            ))}
          </div>
          <button className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-4 line-clamp-2 text-xs text-gray-400">
          Chrome fixed the bug several versions ago, thus rendering this...
        </p>
      </CardContent>
    </Card>
  );
}

function _DashboardFooter(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-between gap-2 border-t border-gray-100 px-1 py-4 text-xs text-gray-400 sm:flex-row">
      <span>
        © All rights reserved <span className="text-blue-500">CodedThemes</span>
      </span>
      <div className="flex items-center gap-4">
        <span>Hire us</span>
        <span>License</span>
        <span>Terms</span>
        <span>Figma Design System</span>
      </div>
    </div>
  );
}

void [
  _totalUsersChart, _totalOrderChart, _totalSalesChart, _totalMarketingChart,
  _StatCard, _WelcomeBanner, _IncomeOverviewCard, _PageViewsCard,
  _RecentOrdersCard, _AnalyticsReportCard, _SalesReportCard,
  _TransactionHistoryCard, _TaskProgressCard, _AcquisitionChannelsCard,
  _LearningBannerCard, _GetStartedCard, _DashboardFooter,
];

export default function DashboardPage(): React.JSX.Element {
  return (
    // <div className="space-y-5 p-5">
    //   <WelcomeBanner />

    //   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    //     <StatCard label="Total Users" value="78,250" trendValue="70.5%" direction="up" color="blue">
    //       <ResponsiveContainer width="100%" height="100%">
    //         <BarChart data={totalUsersChart}>
    //           <Bar dataKey="v" fill="#3b82f6" radius={[1, 1, 0, 0]} />
    //         </BarChart>
    //       </ResponsiveContainer>
    //     </StatCard>

    //     <StatCard label="Total Order" value="18,800" trendValue="27.4%" direction="down" color="red">
    //       <ResponsiveContainer width="100%" height="100%">
    //         <AreaChart data={totalOrderChart}>
    //           <defs>
    //             <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
    //               <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
    //               <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
    //             </linearGradient>
    //           </defs>
    //           <Area type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={2} fill="url(#orderGrad)" dot={false} />
    //         </AreaChart>
    //       </ResponsiveContainer>
    //     </StatCard>

    //     <StatCard label="Total Sales" value="$35,078" trendValue="27.4%" direction="down" color="amber">
    //       <ResponsiveContainer width="100%" height="100%">
    //         <BarChart data={totalSalesChart}>
    //           <Bar dataKey="v" fill="#f59e0b" radius={[1, 1, 0, 0]} />
    //         </BarChart>
    //       </ResponsiveContainer>
    //     </StatCard>

    //     <StatCard label="Total Marketing" value="$1,12,083" trendValue="70.5%" direction="up" color="blue">
    //       <ResponsiveContainer width="100%" height="100%">
    //         <LineChart data={totalMarketingChart}>
    //           <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} dot={false} />
    //         </LineChart>
    //       </ResponsiveContainer>
    //     </StatCard>
    //   </div>

    //   <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
    //     <IncomeOverviewCard />
    //     <PageViewsCard />
    //   </div>

    //   <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
    //     <RecentOrdersCard />
    //     <AnalyticsReportCard />
    //   </div>

    //   <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
    //     <SalesReportCard />
    //     <TransactionHistoryCard />
    //   </div>

    //   <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
    //     <TaskProgressCard />
    //     <AcquisitionChannelsCard />
    //   </div>

    //   <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
    //     <LearningBannerCard />
    //     <GetStartedCard />
    //   </div>

    //   <DashboardFooter />
    // </div>
    <div>
      Hello
    </div>
  );
}
