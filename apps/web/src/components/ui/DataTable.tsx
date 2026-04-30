import { flexRender, type Table } from '@tanstack/react-table';
import { Spinner } from './Spinner';

interface DataTableProps<T> {
  table: Table<T>;
  isLoading?: boolean;
  emptyMessage?: string;
}

// Tabela reutilizável que renderiza qualquer instância TanStack Table.
// Aceita isLoading para exibir spinner e emptyMessage para estado vazio.
export function DataTable<T>({
  table,
  isLoading = false,
  emptyMessage = 'Nenhum registro encontrado.',
}: DataTableProps<T>) {
  const allColumns = table.getAllColumns().length;

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-white/10 bg-dark-800">
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider whitespace-nowrap"
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={allColumns} className="py-16 text-center">
                <div className="flex justify-center">
                  <Spinner />
                </div>
              </td>
            </tr>
          ) : table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={allColumns} className="py-16 text-center text-white/40">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-white align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
