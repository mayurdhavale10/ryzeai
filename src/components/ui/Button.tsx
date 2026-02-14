type ButtonProps = {
    label: string
    variant?: "primary" | "secondary"
}

export function Button({ label, variant = "primary" }: ButtonProps) {
    const baseStyle = {
        padding: "8px 16px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
    }

    const variants = {
        primary: {
            backgroundColor: "#2563eb",
            color: "#ffffff",
        },
        secondary: {
            backgroundColor: "#e5e7eb",
            color: "#111827",
        },
    }

    return (
        <button style={{ ...baseStyle, ...variants[variant] }}>
            {label}
        </button>
    )
}
