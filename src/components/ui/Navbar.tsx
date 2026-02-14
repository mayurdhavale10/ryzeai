type NavbarProps = {
    brand: string
    links?: string
}

export function Navbar({ brand, links = "Home,About,Contact" }: NavbarProps) {
    const linkList = links.split(",").map(l => l.trim())

    return (
        <nav style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            backgroundColor: "#1f2937",
            color: "#ffffff",
            borderRadius: "8px",
            width: "100%",
            maxWidth: "800px"
        }}>
            <div style={{ fontSize: "20px", fontWeight: 700 }}>
                {brand}
            </div>
            <div style={{ display: "flex", gap: "24px" }}>
                {linkList.map((link, i) => (
                    <a
                        key={i}
                        href="#"
                        style={{
                            color: "#e5e7eb",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: 500,
                            transition: "color 0.2s"
                        }}
                    >
                        {link}
                    </a>
                ))}
            </div>
        </nav>
    )
}
