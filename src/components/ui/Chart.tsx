type ChartProps = {
    title: string
    data: string
    type?: "bar" | "line"
}

export function Chart({ title, data, type = "bar" }: ChartProps) {
    const dataPoints = data.split(",").map(d => parseInt(d.trim()))
    const maxValue = Math.max(...dataPoints)

    return (
        <div style={{
            padding: "20px",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            width: "100%",
            maxWidth: "400px"
        }}>
            <h3 style={{
                margin: "0 0 20px 0",
                fontSize: "16px",
                fontWeight: 600,
                color: "#111827"
            }}>
                {title}
            </h3>
            <div style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "12px",
                height: "200px",
                padding: "10px 0"
            }}>
                {dataPoints.map((value, i) => (
                    <div
                        key={i}
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                height: `${(value / maxValue) * 180}px`,
                                backgroundColor: type === "bar" ? "#3b82f6" : "#10b981",
                                borderRadius: "4px 4px 0 0",
                                transition: "height 0.3s"
                            }}
                        />
                        <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>
                            {value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
