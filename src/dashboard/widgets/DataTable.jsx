import "./DataTable.css";

export default function DataTable({ columns, rows, keyField = "id" }) {
  if (!rows.length) {
    return <div className="datatable__empty">Nothing to show yet.</div>;
  }
  return (
    <div className="datatable__wrap">
      <table className="datatable">
        <thead>
          <tr>
            {columns.map((c) => <th key={c.key}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[keyField]}>
              {columns.map((c) => (
                <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
