type SidebarProps = {
    title: string
    items: string
}

export function Sidebar({ title, items }: SidebarProps) {
    const itemList = items.split(",").map(i => i.trim())

    return (
        <aside style={{
            width: "240px",
            padding: "20px",
            backgroundColor: "#f9fafb",
            borderRadius: "12px",
            border: "1px solid #e5e7eb"
        }}>
            <h3 style={{
                margin: "0 0 16px 0",
                fontSize: "16px",
                fontWeight: 600,
                color: "#111827"
            }}>
                {title}
            </h3>
            <ul style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: "8px"
            }}>
                {itemList.map((item, i) => (
                    <li
                        key={i}
                        style={{
                            padding: "10px 12px",
                            borderRadius: "6px",
                            fontSize: "14px",
                            color: "#374151",
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                            backgroundColor: i === 0 ? "#e0e7ff" : "transparent"
                        }}
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </aside>
    )
}
