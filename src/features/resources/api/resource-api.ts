import type { ResourceConfig } from "@/features/resources/types";

/* -------------------------------------------------------------------------- */
/*                              Demo Resources                                */
/* -------------------------------------------------------------------------- */

const usersResource: ResourceConfig = {
  name: "users",
  label: "User",
  pluralLabel: "Users",
  endpoint: "/users",
  queryKey: "users",
  icon: "Users",
  enableSearch: true,
  enablePagination: true,
  enableColumnVisibility: true,
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
  actions: {
    create: true,
    edit: true,
    delete: true,
    export: true,
    bulkDelete: true,
    view: true,
  },
  fields: [
    { name: "id", label: "ID", type: "number", sortable: true, searchable: false, visible: true, width: "60px", enableHiding: false },
    { name: "name", label: "Name", type: "text", sortable: true, searchable: true, visible: true, required: true, minWidth: "150px" },
    { name: "email", label: "Email", type: "email", sortable: true, searchable: true, visible: true, required: true, minWidth: "200px" },
    { name: "phone", label: "Phone", type: "phone", sortable: false, searchable: true, visible: true, minWidth: "130px" },
    { name: "role", label: "Role", type: "select", sortable: true, searchable: true, visible: true, options: [
      { label: "Admin", value: "admin" },
      { label: "Manager", value: "manager" },
      { label: "User", value: "user" },
    ]},
    { name: "status", label: "Status", type: "select", sortable: true, searchable: true, visible: true, options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Pending", value: "pending" },
    ]},
    { name: "department", label: "Department", type: "select", sortable: true, searchable: true, visible: true, options: [
      { label: "Engineering", value: "engineering" },
      { label: "Marketing", value: "marketing" },
      { label: "Sales", value: "sales" },
      { label: "HR", value: "hr" },
    ]},
    { name: "joinDate", label: "Join Date", type: "date", sortable: true, searchable: false, visible: true, minWidth: "120px" },
  ],
  filters: [
    {
      id: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Pending", value: "pending" },
      ],
    },
    {
      id: "role",
      label: "Role",
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Manager", value: "manager" },
        { label: "User", value: "user" },
      ],
    },
    {
      id: "department",
      label: "Department",
      type: "select",
      options: [
        { label: "Engineering", value: "engineering" },
        { label: "Marketing", value: "marketing" },
        { label: "Sales", value: "sales" },
        { label: "HR", value: "hr" },
      ],
    },
  ],
};

const productsResource: ResourceConfig = {
  name: "products",
  label: "Product",
  pluralLabel: "Products",
  endpoint: "/products",
  queryKey: "products",
  icon: "Package",
  enableSearch: true,
  enablePagination: true,
  enableColumnVisibility: true,
  defaultPageSize: 10,
  actions: {
    create: true,
    edit: true,
    delete: true,
    export: true,
    bulkDelete: true,
  },
  fields: [
    { name: "id", label: "ID", type: "number", sortable: true, searchable: false, visible: true, width: "60px", enableHiding: false },
    { name: "name", label: "Product Name", type: "text", sortable: true, searchable: true, visible: true, required: true, minWidth: "180px" },
    { name: "sku", label: "SKU", type: "text", sortable: false, searchable: true, visible: true, required: true, minWidth: "120px" },
    { name: "category", label: "Category", type: "select", sortable: true, searchable: true, visible: true, options: [
      { label: "Electronics", value: "electronics" },
      { label: "Clothing", value: "clothing" },
      { label: "Home & Garden", value: "home-garden" },
      { label: "Sports", value: "sports" },
    ]},
    { name: "price", label: "Price", type: "number", sortable: true, searchable: false, visible: true, min: 0, width: "100px" },
    { name: "stock", label: "Stock", type: "number", sortable: true, searchable: false, visible: true, min: 0, width: "80px" },
    { name: "status", label: "Status", type: "select", sortable: true, searchable: true, visible: true, options: [
      { label: "Active", value: "active" },
      { label: "Draft", value: "draft" },
      { label: "Archived", value: "archived" },
    ]},
    { name: "createdAt", label: "Created At", type: "date", sortable: true, searchable: false, visible: true, minWidth: "120px" },
  ],
  filters: [
    {
      id: "category",
      label: "Category",
      type: "select",
      options: [
        { label: "Electronics", value: "electronics" },
        { label: "Clothing", value: "clothing" },
        { label: "Home & Garden", value: "home-garden" },
        { label: "Sports", value: "sports" },
      ],
    },
    {
      id: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Draft", value: "draft" },
        { label: "Archived", value: "archived" },
      ],
    },
  ],
};

const customersResource: ResourceConfig = {
  name: "customers",
  label: "Customer",
  pluralLabel: "Customers",
  endpoint: "/customers",
  queryKey: "customers",
  icon: "Contact",
  enableSearch: true,
  enablePagination: true,
  enableColumnVisibility: true,
  defaultPageSize: 10,
  actions: {
    create: true,
    edit: true,
    delete: true,
    export: true,
    bulkDelete: true,
    view: true,
  },
  fields: [
    { name: "id", label: "ID", type: "number", sortable: true, searchable: false, visible: true, width: "60px", enableHiding: false },
    { name: "name", label: "Customer Name", type: "text", sortable: true, searchable: true, visible: true, required: true, minWidth: "150px" },
    { name: "email", label: "Email", type: "email", sortable: true, searchable: true, visible: true, required: true, minWidth: "200px" },
    { name: "phone", label: "Phone", type: "phone", sortable: false, searchable: true, visible: true, minWidth: "130px" },
    { name: "company", label: "Company", type: "text", sortable: true, searchable: true, visible: true, minWidth: "150px" },
    { name: "city", label: "City", type: "text", sortable: true, searchable: true, visible: true, minWidth: "120px" },
    { name: "status", label: "Status", type: "select", sortable: true, searchable: true, visible: true, options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ]},
    { name: "totalOrders", label: "Total Orders", type: "number", sortable: true, searchable: false, visible: true, width: "100px" },
    { name: "totalSpent", label: "Total Spent", type: "number", sortable: true, searchable: false, visible: true, width: "120px" },
    { name: "createdAt", label: "Joined", type: "date", sortable: true, searchable: false, visible: true, minWidth: "120px" },
  ],
  filters: [
    {
      id: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ],
};

const ordersResource: ResourceConfig = {
  name: "orders",
  label: "Order",
  pluralLabel: "Orders",
  endpoint: "/orders",
  queryKey: "orders",
  icon: "ShoppingCart",
  enableSearch: true,
  enablePagination: true,
  enableColumnVisibility: true,
  defaultPageSize: 10,
  actions: {
    create: true,
    edit: true,
    delete: false,
    export: true,
    bulkDelete: false,
    view: true,
  },
  fields: [
    { name: "id", label: "Order ID", type: "text", sortable: true, searchable: true, visible: true, width: "100px", enableHiding: false },
    { name: "customerName", label: "Customer", type: "text", sortable: true, searchable: true, visible: true, required: true, minWidth: "150px" },
    { name: "email", label: "Email", type: "email", sortable: false, searchable: true, visible: true, minWidth: "200px" },
    { name: "items", label: "Items", type: "number", sortable: true, searchable: false, visible: true, width: "70px" },
    { name: "total", label: "Total", type: "number", sortable: true, searchable: false, visible: true, width: "100px" },
    { name: "status", label: "Status", type: "select", sortable: true, searchable: true, visible: true, options: [
      { label: "Pending", value: "pending" },
      { label: "Processing", value: "processing" },
      { label: "Shipped", value: "shipped" },
      { label: "Delivered", value: "delivered" },
      { label: "Cancelled", value: "cancelled" },
    ]},
    { name: "paymentMethod", label: "Payment", type: "select", sortable: true, searchable: true, visible: true, options: [
      { label: "Credit Card", value: "credit_card" },
      { label: "PayPal", value: "paypal" },
      { label: "Bank Transfer", value: "bank_transfer" },
      { label: "Cash on Delivery", value: "cod" },
    ]},
    { name: "createdAt", label: "Order Date", type: "date", sortable: true, searchable: false, visible: true, minWidth: "120px" },
  ],
  filters: [
    {
      id: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Processing", value: "processing" },
        { label: "Shipped", value: "shipped" },
        { label: "Delivered", value: "delivered" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    {
      id: "paymentMethod",
      label: "Payment Method",
      type: "select",
      options: [
        { label: "Credit Card", value: "credit_card" },
        { label: "PayPal", value: "paypal" },
        { label: "Bank Transfer", value: "bank_transfer" },
        { label: "Cash on Delivery", value: "cod" },
      ],
    },
  ],
};

const suppliersResource: ResourceConfig = {
  name: "suppliers",
  label: "Supplier",
  pluralLabel: "Suppliers",
  endpoint: "/suppliers",
  queryKey: "suppliers",
  icon: "Truck",
  enableSearch: true,
  enablePagination: true,
  enableColumnVisibility: true,
  defaultPageSize: 10,
  actions: {
    create: true,
    edit: true,
    delete: true,
    export: true,
    bulkDelete: true,
    view: true,
  },
  fields: [
    { name: "id", label: "ID", type: "number", sortable: true, searchable: false, visible: true, width: "60px", enableHiding: false },
    { name: "name", label: "Supplier Name", type: "text", sortable: true, searchable: true, visible: true, required: true, minWidth: "180px" },
    { name: "contactPerson", label: "Contact Person", type: "text", sortable: true, searchable: true, visible: true, required: true, minWidth: "150px" },
    { name: "email", label: "Email", type: "email", sortable: true, searchable: true, visible: true, required: true, minWidth: "200px" },
    { name: "phone", label: "Phone", type: "phone", sortable: false, searchable: true, visible: true, minWidth: "130px" },
    { name: "city", label: "City", type: "text", sortable: true, searchable: true, visible: true, minWidth: "120px" },
    { name: "country", label: "Country", type: "text", sortable: true, searchable: true, visible: true, minWidth: "120px" },
    { name: "category", label: "Category", type: "select", sortable: true, searchable: true, visible: true, options: [
      { label: "Electronics", value: "electronics" },
      { label: "Textiles", value: "textiles" },
      { label: "Raw Materials", value: "raw_materials" },
      { label: "Packaging", value: "packaging" },
    ]},
    { name: "status", label: "Status", type: "select", sortable: true, searchable: true, visible: true, options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Pending", value: "pending" },
    ]},
    { name: "rating", label: "Rating", type: "number", sortable: true, searchable: false, visible: true, width: "80px" },
    { name: "createdAt", label: "Added", type: "date", sortable: true, searchable: false, visible: true, minWidth: "120px" },
  ],
  filters: [
    {
      id: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Pending", value: "pending" },
      ],
    },
    {
      id: "category",
      label: "Category",
      type: "select",
      options: [
        { label: "Electronics", value: "electronics" },
        { label: "Textiles", value: "textiles" },
        { label: "Raw Materials", value: "raw_materials" },
        { label: "Packaging", value: "packaging" },
      ],
    },
  ],
};

const invoicesResource: ResourceConfig = {
  name: "invoices",
  label: "Invoice",
  pluralLabel: "Invoices",
  endpoint: "/invoices",
  queryKey: "invoices",
  icon: "FileText",
  enableSearch: true,
  enablePagination: true,
  enableColumnVisibility: true,
  defaultPageSize: 10,
  actions: {
    create: true,
    edit: true,
    delete: false,
    export: true,
    bulkDelete: false,
    view: true,
  },
  fields: [
    { name: "id", label: "Invoice #", type: "text", sortable: true, searchable: true, visible: true, width: "110px", enableHiding: false },
    { name: "customerName", label: "Customer", type: "text", sortable: true, searchable: true, visible: true, minWidth: "150px" },
    { name: "email", label: "Email", type: "email", sortable: false, searchable: true, visible: true, minWidth: "200px" },
    { name: "amount", label: "Amount", type: "number", sortable: true, searchable: false, visible: true, width: "110px" },
    { name: "tax", label: "Tax", type: "number", sortable: true, searchable: false, visible: true, width: "80px" },
    { name: "total", label: "Total", type: "number", sortable: true, searchable: false, visible: true, width: "110px" },
    { name: "status", label: "Status", type: "select", sortable: true, searchable: true, visible: true, options: [
      { label: "Draft", value: "draft" },
      { label: "Sent", value: "sent" },
      { label: "Paid", value: "paid" },
      { label: "Overdue", value: "overdue" },
      { label: "Cancelled", value: "cancelled" },
    ]},
    { name: "dueDate", label: "Due Date", type: "date", sortable: true, searchable: false, visible: true, minWidth: "120px" },
    { name: "createdAt", label: "Created", type: "date", sortable: true, searchable: false, visible: true, minWidth: "120px" },
  ],
  filters: [
    {
      id: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Sent", value: "sent" },
        { label: "Paid", value: "paid" },
        { label: "Overdue", value: "overdue" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*                              Resource Registry                             */
/* -------------------------------------------------------------------------- */

const resourceRegistry: Record<string, ResourceConfig> = {
  users: usersResource,
  products: productsResource,
  customers: customersResource,
  orders: ordersResource,
  suppliers: suppliersResource,
  invoices: invoicesResource,
};

/* -------------------------------------------------------------------------- */
/*                                API Functions                               */
/* -------------------------------------------------------------------------- */

export async function getResourceConfig(name: string): Promise<ResourceConfig | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return resourceRegistry[name] ?? null;
}

export async function getAllResourceConfigs(): Promise<ResourceConfig[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return Object.values(resourceRegistry);
}

export async function getResourceData(_name: string, _params?: Record<string, unknown>): Promise<{ data: unknown[]; total: number }> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const demoData: Record<string, unknown[]> = {
    users: [
      { id: 1, name: "John Doe", email: "john@example.com", phone: "01712345678", role: "admin", status: "active", department: "engineering", joinDate: "2023-01-15" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "01812345678", role: "manager", status: "active", department: "marketing", joinDate: "2023-03-20" },
      { id: 3, name: "Bob Wilson", email: "bob@example.com", phone: "01912345678", role: "user", status: "inactive", department: "sales", joinDate: "2023-06-10" },
      { id: 4, name: "Alice Brown", email: "alice@example.com", phone: "01612345678", role: "user", status: "pending", department: "hr", joinDate: "2023-09-05" },
      { id: 5, name: "Charlie Davis", email: "charlie@example.com", phone: "01512345678", role: "manager", status: "active", department: "engineering", joinDate: "2024-01-12" },
    ],
    products: [
      { id: 1, name: "Wireless Mouse", sku: "WM-001", category: "electronics", price: 29.99, stock: 150, status: "active", createdAt: "2024-01-10" },
      { id: 2, name: "Keyboard Pro", sku: "KP-002", category: "electronics", price: 79.99, stock: 85, status: "active", createdAt: "2024-01-15" },
      { id: 3, name: "Cotton T-Shirt", sku: "CT-003", category: "clothing", price: 19.99, stock: 200, status: "active", createdAt: "2024-02-01" },
      { id: 4, name: "Garden Hose", sku: "GH-004", category: "home-garden", price: 34.99, stock: 0, status: "draft", createdAt: "2024-02-10" },
      { id: 5, name: "Yoga Mat", sku: "YM-005", category: "sports", price: 24.99, stock: 120, status: "active", createdAt: "2024-03-01" },
    ],
    customers: [
      { id: 1, name: "Acme Corp", email: "info@acme.com", phone: "01712345678", company: "Acme Corporation", city: "Dhaka", status: "active", totalOrders: 45, totalSpent: 12500, createdAt: "2023-01-20" },
      { id: 2, name: "Tech Solutions", email: "contact@techsol.com", phone: "01812345678", company: "Tech Solutions Ltd", city: "Chittagong", status: "active", totalOrders: 32, totalSpent: 8900, createdAt: "2023-04-15" },
      { id: 3, name: "Global Trade", email: "info@globaltrade.com", phone: "01912345678", company: "Global Trade Co", city: "Sylhet", status: "inactive", totalOrders: 12, totalSpent: 3200, createdAt: "2023-07-10" },
      { id: 4, name: "Local Market", email: "sales@localmarket.com", phone: "01612345678", company: "Local Market Ltd", city: "Rajshahi", status: "active", totalOrders: 28, totalSpent: 6700, createdAt: "2023-10-05" },
      { id: 5, name: "Digital Hub", email: "hello@digitalhub.com", phone: "01512345678", company: "Digital Hub Inc", city: "Khulna", status: "active", totalOrders: 18, totalSpent: 4500, createdAt: "2024-01-08" },
    ],
    orders: [
      { id: "ORD-001", customerName: "Acme Corp", email: "info@acme.com", items: 5, total: 299.95, status: "delivered", paymentMethod: "credit_card", createdAt: "2024-03-15" },
      { id: "ORD-002", customerName: "Tech Solutions", email: "contact@techsol.com", items: 3, total: 179.97, status: "shipped", paymentMethod: "paypal", createdAt: "2024-03-18" },
      { id: "ORD-003", customerName: "Global Trade", email: "info@globaltrade.com", items: 10, total: 549.90, status: "processing", paymentMethod: "bank_transfer", createdAt: "2024-03-20" },
      { id: "ORD-004", customerName: "Local Market", email: "sales@localmarket.com", items: 2, total: 89.98, status: "pending", paymentMethod: "cod", createdAt: "2024-03-22" },
      { id: "ORD-005", customerName: "Digital Hub", email: "hello@digitalhub.com", items: 7, total: 419.93, status: "cancelled", paymentMethod: "credit_card", createdAt: "2024-03-25" },
    ],
    suppliers: [
      { id: 1, name: "Shenzhen Electronics", contactPerson: "Li Wei", email: "sales@sztech.com", phone: "86-755-1234567", city: "Shenzhen", country: "China", category: "electronics", status: "active", rating: 4.5, createdAt: "2023-02-15" },
      { id: 2, name: "Mumbai Textiles", contactPerson: "Priya Patel", email: "orders@mumbaitex.com", phone: "91-22-2345678", city: "Mumbai", country: "India", category: "textiles", status: "active", rating: 4.2, createdAt: "2023-05-20" },
      { id: 3, name: "Dhaka Raw Materials", contactPerson: "Kamal Hossain", email: "info@dhakarm.com", phone: "880-2-9876543", city: "Dhaka", country: "Bangladesh", category: "raw_materials", status: "active", rating: 3.8, createdAt: "2023-08-10" },
      { id: 4, name: "Istanbul Packaging", contactPerson: "Mehmet Yilmaz", email: "sales@istpack.com", phone: "90-212-3456789", city: "Istanbul", country: "Turkey", category: "packaging", status: "pending", rating: 4.0, createdAt: "2024-01-05" },
      { id: 5, name: "Ho Chi Minh Electronics", contactPerson: "Nguyen Van", email: "export@hcmtech.com", phone: "84-28-4567890", city: "Ho Chi Minh City", country: "Vietnam", category: "electronics", status: "active", rating: 4.3, createdAt: "2024-02-28" },
    ],
    invoices: [
      { id: "INV-001", customerName: "Acme Corp", email: "info@acme.com", amount: 250.00, tax: 25.00, total: 275.00, status: "paid", dueDate: "2024-04-15", createdAt: "2024-03-15" },
      { id: "INV-002", customerName: "Tech Solutions", email: "contact@techsol.com", amount: 150.00, tax: 15.00, total: 165.00, status: "sent", dueDate: "2024-04-20", createdAt: "2024-03-18" },
      { id: "INV-003", customerName: "Global Trade", email: "info@globaltrade.com", amount: 500.00, tax: 50.00, total: 550.00, status: "overdue", dueDate: "2024-03-30", createdAt: "2024-03-01" },
      { id: "INV-004", customerName: "Local Market", email: "sales@localmarket.com", amount: 75.00, tax: 7.50, total: 82.50, status: "draft", dueDate: "2024-05-01", createdAt: "2024-03-22" },
      { id: "INV-005", customerName: "Digital Hub", email: "hello@digitalhub.com", amount: 350.00, tax: 35.00, total: 385.00, status: "paid", dueDate: "2024-04-10", createdAt: "2024-03-10" },
    ],
  };

  const data = demoData[_name] ?? [];
  return { data, total: data.length };
}
