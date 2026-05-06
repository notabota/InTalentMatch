import React from "react";
import { cn } from "@/lib/cn";

export interface Column<T> {
    key: string;
    header: React.ReactNode;
    render: (row: T) => React.ReactNode;
    align?: "left" | "right" | "center";
}

export interface TableProps<T> {
    columns: Column<T>[];
    rows: T[];
    rowKey: (row: T, index: number) => React.Key;
    className?: string;
}

export function Table<T>({ columns, rows, rowKey, className }: TableProps<T>) {
    const alignClass = (a?: "left" | "right" | "center") =>
        a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left";

    return (
        <div className={cn("overflow-x-auto rounded-[var(--radius-card)] border border-border", className)}>
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="border-b border-border">
                        {columns.map((c) => (
                            <th
                                key={c.key}
                                className={cn("px-4 py-3 font-semibold text-accent", alignClass(c.align))}
                            >
                                {c.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={rowKey(row, i)} className="border-b border-border last:border-0">
                            {columns.map((c) => (
                                <td key={c.key} className={cn("px-4 py-3 text-text", alignClass(c.align))}>
                                    {c.render(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
