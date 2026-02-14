type ModalProps = {
    title: string
    content: string
    variant?: "info" | "warning"
}

export function Modal({ title, content, variant = "info" }: ModalProps) {
    const variants = {
        info: {
            backgroundColor: "#eff6ff",
            borderColor: "#3b82f6",
            titleColor: "#1e40af",
        },
        warning: {
            backgroundColor: "#fef3c7",
            borderColor: "#f59e0b",
            titleColor: "#92400e",
        },
    }

    return (
        <div style={{
            padding: "24px",
            borderRadius: "12px",
            backgroundColor: variants[variant].backgroundColor,
            border: `2px solid ${variants[variant].borderColor}`,
            maxWidth: "400px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
        }}>
            <h3 style={{
                margin: "0 0 12px 0",
                fontSize: "18px",
                fontWeight: 600,
                color: variants[variant].titleColor
            }}>
                {title}
            </h3>
            <p style={{ margin: 0, fontSize: "14px", color: "#374151", lineHeight: "1.6" }}>
                {content}
            </p>
        </div>
    )
}
