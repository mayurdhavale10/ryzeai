type CardProps = {
    title: string
    content: string
    variant?: "default" | "outlined"
}

export function Card({ title, content, variant = "default" }: CardProps) {
    const baseStyle = {
        padding: "20px",
        borderRadius: "12px",
        maxWidth: "400px",
    }

    const variants = {
        default: {
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
        outlined: {
            backgroundColor: "transparent",
            border: "2px solid #2563eb",
        },
    }

    return (
        <div style={{ ...baseStyle, ...variants[variant] }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "18px", fontWeight: 600, color: "#111827" }}>
                {title}
            </h3>
            <p style={{ margin: 0, fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}>
                {content}
            </p>
        </div>
    )
}
