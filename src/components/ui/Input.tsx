type InputProps = {
    placeholder: string
    type?: "text" | "email" | "password"
    label?: string
}

export function Input({ placeholder, type = "text", label }: InputProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", maxWidth: "300px" }}>
            {label && (
                <label style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>
                    {label}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                }}
            />
        </div>
    )
}
