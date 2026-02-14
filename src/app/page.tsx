"use client"

import { useState } from "react"
import { v4 as uuid } from "uuid"
import { Renderer } from "@/components/ui/Renderer"
import { useVersionStore } from "@/store/versionStore"
import { validateTree } from "@/agent/validator"

export default function Home() {
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const current = useVersionStore((s) => s.current)
    const addVersion = useVersionStore((s) => s.addVersion)

    const generateUI = async () => {
        if (!input.trim()) return

        setLoading(true)
        try {
            const res = await fetch("/api/plan", {
                method: "POST",
                body: JSON.stringify({
                    prompt: input,
                    currentTree: current?.tree || []
                }),
            })

            const data = await res.json()

            if (data.error) {
                alert("API Error: " + data.error)
                return
            }

            console.log("🤖 AI Generated Tree:", data.tree)

            if (!validateTree(data.tree)) {
                const invalidComponents = data.tree
                    .filter((node: any) => !["Button", "Card", "Input", "Table", "Modal", "Navbar", "Sidebar", "Chart"].includes(node.type))
                    .map((node: any) => node.type)

                console.error("❌ Invalid components:", invalidComponents)
                alert(`Invalid components from AI: ${invalidComponents.join(", ")}.\n\nOnly these are allowed: Button, Card, Input, Table, Modal, Navbar, Sidebar, Chart`)
                return
            }

            addVersion({
                id: uuid(),
                tree: data.tree,
                code: data.code,
                explanation: data.explanation,
            })
            setInput("")
        } catch (error) {
            console.error("Generation failed:", error)
            alert("Failed to connect to the planning API.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main
            style={{
                display: "grid",
                gridTemplateColumns: "380px 1fr 1fr",
                height: "100vh",
                background: "#FFFFFF",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                padding: "20px",
                gap: "20px"
            }}
        >
            {/* LEFT PANEL */}
            <div style={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                borderRadius: "24px",
                border: "2px solid #E0E0E0",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                boxShadow: "0 4px 24px rgba(240, 80, 35, 0.08)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <img
                        src="/images.jpg"
                        alt="Ryze AI Logo"
                        style={{
                            width: "56px",
                            height: "56px",
                            objectFit: "contain",
                            borderRadius: "12px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                        }}
                    />
                    <div>
                        <h1 style={{
                            fontSize: "24px",
                            fontWeight: 800,
                            marginBottom: "4px",
                            color: "#F05023",
                            letterSpacing: "-0.5px"
                        }}>
                            Ryze AI
                        </h1>
                        <p style={{ fontSize: "12px", color: "#666", margin: 0, fontWeight: 500 }}>
                            Deterministic UI Engine
                        </p>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), generateUI())}
                        placeholder="Describe your UI... e.g., 'Create a login card'"
                        style={{
                            width: "100%",
                            height: "110px",
                            padding: "16px",
                            borderRadius: "16px",
                            border: "2px solid #E0E0E0",
                            fontSize: "14px",
                            resize: "none",
                            outline: "none",
                            fontFamily: "inherit",
                            background: "#FFFFFF",
                            color: "#333",
                            fontWeight: 500,
                            transition: "all 0.2s"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#F05023"}
                        onBlur={(e) => e.target.style.borderColor = "#E0E0E0"}
                    />
                    <button
                        onClick={generateUI}
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "16px",
                            background: loading ? "#E0E0E0" : "#F05023",
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: "16px",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontWeight: 700,
                            fontSize: "15px",
                            boxShadow: loading ? "none" : "0 4px 16px rgba(240, 80, 35, 0.3)",
                            transition: "all 0.3s ease",
                            transform: loading ? "scale(0.98)" : "scale(1)"
                        }}
                        onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#D94419")}
                        onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "#F05023")}
                    >
                        {loading ? "⚡ Generating..." : "✨ Generate UI"}
                    </button>
                </div>

                {current && (
                    <div style={{
                        padding: "20px",
                        background: "linear-gradient(135deg, #FFF5F2 0%, #FFEEE8 100%)",
                        borderRadius: "20px",
                        border: "2px solid #FFE0D6",
                        boxShadow: "0 2px 12px rgba(240, 80, 35, 0.08)"
                    }}>
                        <h4 style={{
                            fontSize: "11px",
                            fontWeight: 800,
                            color: "#F05023",
                            marginBottom: "10px",
                            textTransform: "uppercase",
                            letterSpacing: "1px"
                        }}>
                            💡 AI Reasoning
                        </h4>
                        <p style={{ fontSize: "13px", color: "#666", lineHeight: "1.6", margin: 0, fontWeight: 500 }}>
                            {current.explanation}
                        </p>
                    </div>
                )}
            </div>

            {/* MIDDLE PANEL - CODE */}
            <div style={{
                background: "#FFFFFF",
                borderRadius: "24px",
                border: "2px solid #E0E0E0",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)"
            }}>
                <div style={{
                    padding: "24px 28px",
                    borderBottom: "2px solid #E0E0E0",
                    background: "#FAFAFA",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#333", margin: 0, letterSpacing: "0.3px" }}>
                        📝 Generated Code
                    </h2>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(current?.code || "")
                            alert("✓ Code copied!")
                        }}
                        disabled={!current}
                        style={{
                            padding: "8px 16px",
                            fontSize: "12px",
                            background: current ? "#F05023" : "#E0E0E0",
                            border: "none",
                            borderRadius: "10px",
                            cursor: current ? "pointer" : "not-allowed",
                            fontWeight: 600,
                            color: "#FFFFFF",
                            transition: "all 0.2s",
                            boxShadow: current ? "0 2px 8px rgba(240, 80, 35, 0.3)" : "none"
                        }}
                    >
                        📋 Copy
                    </button>
                </div>
                <div style={{
                    flex: 1,
                    background: "#0f172a",
                    color: "#e2e8f0",
                    padding: "28px",
                    overflow: "auto",
                    fontSize: "13px",
                    fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
                    lineHeight: "1.8"
                }}>
                    {current ? (
                        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}><code>{current.code}</code></pre>
                    ) : (
                        <div style={{ color: "rgba(226, 232, 240, 0.5)", fontStyle: "italic", fontFamily: "inherit" }}>
              // AI-generated code will appear here...
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT PANEL - PREVIEW */}
            <div style={{
                background: "#FFFFFF",
                borderRadius: "24px",
                border: "2px solid #E0E0E0",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)"
            }}>
                <div style={{
                    padding: "24px 28px",
                    borderBottom: "2px solid #E0E0E0",
                    background: "#FAFAFA"
                }}>
                    <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#333", margin: 0, letterSpacing: "0.3px" }}>
                        🎨 Live Preview
                    </h2>
                </div>
                <div style={{
                    flex: 1,
                    padding: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "auto",
                    background: "#FAFAFA"
                }}>
                    <div style={{
                        padding: current ? "48px" : "80px",
                        background: "#FFFFFF",
                        borderRadius: "24px",
                        boxShadow: current ? "0 8px 32px rgba(0, 0, 0, 0.12)" : "none",
                        minWidth: current ? "320px" : "240px",
                        textAlign: "center",
                        border: current ? "2px solid #E0E0E0" : "3px dashed #E0E0E0",
                        transition: "all 0.3s ease"
                    }}>
                        {current ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
                                <Renderer tree={current.tree} />
                            </div>
                        ) : (
                            <div style={{ color: "#999", fontSize: "14px", fontWeight: 600 }}>
                                <img
                                    src="/images.jpg"
                                    alt="Logo"
                                    style={{
                                        width: "120px",
                                        height: "120px",
                                        objectFit: "contain",
                                        marginBottom: "16px",
                                        filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
                                        borderRadius: "12px"
                                    }}
                                />
                                <div>Ready to generate...</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
