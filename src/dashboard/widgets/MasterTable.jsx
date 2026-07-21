import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineChevronUp, HiOutlineChevronDown, HiOutlineMagnifyingGlass, HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import "./MasterTable.css";

const DEFAULT_SIZES = [25, 50, 75, 100];

/**
 * columns: [{ key, label, sortable?, render?(row) }]
 * rows: array of plain objects
 * searchKeys: which row fields the search box matches against (defaults to all column keys)
 */
export default function MasterTable({
  title,
  columns,
  rows,
  searchKeys,
  pageSizeOptions = DEFAULT_SIZES,
  defaultPageSize = DEFAULT_SIZES[0],
  keyField = "id",
}) {
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: null, dir: "asc" });

  const matchKeys = searchKeys || columns.map((c) => c.key);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.trim().toLowerCase();
    return rows.filter((r) =>
      matchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(q))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, query]);

  const sorted = useMemo(() => {
    if (!sort.key) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const va = a[sort.key]; const vb = b[sort.key];
      if (va === vb) return 0;
      const result = va > vb ? 1 : -1;
      return sort.dir === "asc" ? result : -result;
    });
    return copy;
  }, [filtered, sort]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const pageRows = sorted.slice(start, start + pageSize);

  function toggleSort(key) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  }

  function changePageSize(size) {
    setPageSize(size);
    setPage(1);
  }

  function changeQuery(q) {
    setQuery(q);
    setPage(1);
  }

  return (
    <div className="mastertable">
      {title && <h3 className="mastertable__title">{title}</h3>}

      <div className="mastertable__toolbar">
        <label className="mastertable__pagesize">
          <select value={pageSize} onChange={(e) => changePageSize(Number(e.target.value))}>
            {pageSizeOptions.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          Entries per page
        </label>

        <div className="mastertable__search">
          <HiOutlineMagnifyingGlass />
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => changeQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mastertable__scroll">
        <table className="mastertable__table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={c.sortable ? "mastertable__th--sortable" : ""}
                  onClick={() => c.sortable && toggleSort(c.key)}
                >
                  <span>{c.label}</span>
                  {c.sortable && (
                    <span className="mastertable__sorticons">
                      <HiOutlineChevronUp className={sort.key === c.key && sort.dir === "asc" ? "mastertable__sortactive" : ""} />
                      <HiOutlineChevronDown className={sort.key === c.key && sort.dir === "desc" ? "mastertable__sortactive" : ""} />
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td className="mastertable__empty" colSpan={columns.length}>No matching records found.</td>
              </tr>
            ) : (
              pageRows.map((row, i) => (
                <motion.tr
                  key={row[keyField] ?? i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                >
                  {columns.map((c) => (
                    <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mastertable__footer">
        <span className="mastertable__count">
          {total === 0 ? "Showing 0 entries" : `Showing ${start + 1} to ${Math.min(start + pageSize, total)} of ${total} entries`}
        </span>
        <div className="mastertable__pager">
          <button disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            <HiOutlineChevronLeft />
          </button>
          <span className="mastertable__pagelabel">Page {safePage} of {totalPages}</span>
          <button disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            <HiOutlineChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
