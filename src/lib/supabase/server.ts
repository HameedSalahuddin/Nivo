// Server client for server components, route handlers, and server actions.
// TEMP E2E mock — revert me

const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const currentMonth = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
const d = (day) => `${currentMonth}-${pad(day)}`;

const store = {
  months: [{ id: "m1", user_id: "test-user", month: currentMonth, allowance: 25000 }],
  budgets: [
    { id: "b1", month_id: "m1", name: "Essentials", allocated_amount: 15000 },
    { id: "b2", month_id: "m1", name: "Shopping", allocated_amount: 6000 },
  ],
  expenses: [
    { id: "e1", budget_id: "b1", name: "Groceries", amount: 1200, category: "Food", date: d(12) },
    { id: "e2", budget_id: "b1", name: "Bus pass", amount: 400, category: "Transport", date: d(13) },
    { id: "e3", budget_id: "b1", name: "Rent split", amount: 3000, category: "Essentials", date: d(1) },
    { id: "e4", budget_id: "b2", name: "T-shirt", amount: 800, category: "Shopping", date: d(10) },
    { id: "e5", budget_id: "b2", name: "Movie night", amount: 350, category: "Entertainment", date: d(14) },
  ],
};

export async function createClient() {
  const builder = (table) => {
    let filters = [];
    let op = { type: "select" };

    const apply = () =>
      store[table].filter((row) =>
        filters.every((f) =>
          f.op === "eq" ? row[f.col] === f.val : f.vals.includes(row[f.col]),
        ),
      );

    const execute = async () => {
      if (op.type === "insert") {
        const arr = Array.isArray(op.payload) ? op.payload : [op.payload];
        for (const row of arr) {
          if (!row.id) row.id = crypto.randomUUID();
          store[table].push({ ...row });
        }
        return { data: arr, error: null };
      }
      const rows = apply();
      if (op.type === "update") {
        for (const row of rows) Object.assign(row, op.payload);
        return { data: rows, error: null };
      }
      if (op.type === "delete") {
        store[table] = store[table].filter((row) => !rows.includes(row));
        return { data: null, error: null };
      }
      return { data: rows, error: null };
    };

    const q = {
      select: () => q,
      eq: (col, val) => {
        filters.push({ op: "eq", col, val });
        return q;
      },
      in: (col, vals) => {
        filters.push({ op: "in", col, vals });
        return q;
      },
      order: async (col, opts = {}) => {
        const res = await execute();
        const dir = opts.ascending === false ? -1 : 1;
        res.data = [...(res.data ?? [])].sort((a, b) =>
          a[col] > b[col] ? dir : a[col] < b[col] ? -dir : 0,
        );
        return res;
      },
      maybeSingle: async () => {
        const res = await execute();
        return { data: res.data?.[0] ?? null };
      },
      insert: (payload) => {
        op = { type: "insert", payload };
        return q;
      },
      update: (payload) => {
        op = { type: "update", payload };
        return q;
      },
      delete: () => {
        op = { type: "delete" };
        return q;
      },
      then(resolve, reject) {
        execute().then(resolve).catch(reject);
      },
    };
    return q;
  };

  return {
    auth: {
      getUser: async () => ({ data: { user: { id: "test-user" } }, error: null }),
    },
    from: (table) => builder(table),
  };
}
