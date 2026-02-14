type TableProps = {
    headers: string
    rows: string
}

export function Table({ headers, rows }: TableProps) {
    const headerList = headers.split(",").map(h => h.trim())
    const rowList = rows.split("|").map(r => r.trim().split(",").map(c => c.trim()))

    return (
        <div style={{
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            overflow: "hidden",
            backgroundColor: "#ffffff"
        }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f9fafb" }}>
                        {headerList.map((header, i) => (
                            <th
                                key={i}
                                style={{
                                    padding: "12px 16px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                    color: "#374151",
                                    borderBottom: "2px solid #e5e7eb",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em"
                                }}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rowList.map((row, i) => (
                        <tr key={i} style={{ borderBottom: i < rowList.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                            {row.map((cell, j) => (
                                <td
                                    key={j}
                                    style={{
                                        padding: "12px 16px",
                                        fontSize: "14px",
                                        color: "#6b7280"
                                    }}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
