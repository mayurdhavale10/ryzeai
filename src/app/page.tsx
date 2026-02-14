"use client"

import { useState } from "react"
import { v4 as uuid } from "uuid"
import { Renderer } from "@/components/ui/Renderer"
import { useVersionStore } from "@/store/versionStore"
import { validateTree } from "@/agent/validator"

export default function Home() {
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [editedCode, setEditedCode] = useState("")
    const current = useVersionStore((s) => s.current)
    const versions = useVersionStore((s) => s.versions)
    const addVersion = useVersionStore((s) => s.addVersion)

    // Sync edited code when current version changes
    useState(() => {
        if (current) {
            setEditedCode(current.code)
        }
    })

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

    const switchToVersion = (version: any) => {
        useVersionStore.setState({ current: version })
    }

    return (
        <main
            style={{
                display: "grid",
                gridTemplateColumns: "320px 1fr 1fr",
                height: "100vh",
                backgroundColor: "#fafafa",
                color: "#111827",
                fontFamily: "'Inter', -apple-system, system-ui, sans-serif"
            }}
        >
            {/* LEFT – CHAT */}
            <div style={{
                borderRight: "1px solid #e5e7eb",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                overflow: "hidden",
                backgroundColor: "#ffffff"
            }}>
                <div>
                    <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px", color: "#111827" }}>
                        🤖 AI Workspace
                    </h2>
                    <p style={{ fontSize: "11px", color: "#6b7280", margin: 0 }}>
                        Deterministic UI Engine • 8 Components
                    </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), generateUI())}
                        placeholder="e.g., 'Create a login card with email input'"
                        style={{
                            width: "100%",
                            height: "90px",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1px solid #e5e7eb",
                            fontSize: "13px",
                            resize: "none",
                            outline: "none",
                            fontFamily: "inherit"
                        }}
                    />
                    <button
                        onClick={generateUI}
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "11px",
                            backgroundColor: loading ? "#94a3b8" : "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontWeight: 600,
                            fontSize: "13px",
                        }}
                    >
                        {loading ? "⚡ Generating..." : "✨ Generate UI"}
                    </button>
                </div>

                {current && (
                    <div style={{
                        padding: "14px",
                        backgroundColor: "#f0f9ff",
                        borderRadius: "10px",
                        border: "1px solid #bae6fd"
                    }}>
                        <h4 style={{ fontSize: "11px", fontWeight: 700, color: "#0369a1", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            💡 AI Reasoning
                        </h4>
                        <p style={{ fontSize: "12px", color: "#0c4a6e", lineHeight: "1.5", margin: 0 }}>
                            {current.explanation}
                        </p>
                    </div>
                )}

                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <h4 style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#9ca3af",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: "4px"
                    }}>
                        📚 Version History ({versions.length})
                    </h4>
                    {versions.length === 0 && (
                        <div style={{ textAlign: "center", padding: "20px 0", color: "#9ca3af", fontSize: "12px" }}>
                            No versions yet
                        </div>
                    )}
                    {versions.slice().reverse().map((v, i) => {
                        const versionNum = versions.length - i
                        const isActive = current?.id === v.id
                        return (
                            <div
                                key={v.id}
                                onClick={() => switchToVersion(v)}
                                style={{
                                    padding: "10px 12px",
                                    borderRadius: "8px",
                                    border: isActive ? "2px solid #3b82f6" : "1px solid #f3f4f6",
                                    fontSize: "12px",
                                    cursor: "pointer",
                                    backgroundColor: isActive ? "#eff6ff" : "#ffffff",
                                    transition: "all 0.2s"
                                }}
                            >
                                <div style={{ fontWeight: 600, marginBottom: "4px", color: isActive ? "#2563eb" : "#111827" }}>
                                    v{versionNum} {isActive && "✓"}
                                </div>
                                <div style={{
                                    color: "#6b7280",
                                    fontSize: "11px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                }}>
                                    {v.explanation.slice(0, 50)}...
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* MIDDLE – CODE EDITOR */}
            <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: "#ffffff", borderRight: "1px solid #e5e7eb" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 style={{ fontSize: "13px", fontWeight: 600, color: "#374151", margin: 0 }}>
                        📝 Generated Code
                    </h2>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(current?.code || "")
                            alert("✓ Code copied to clipboard!")
                        }}
                        disabled={!current}
                        style={{
                            padding: "6px 12px",
                            fontSize: "11px",
                            backgroundColor: current ? "#f3f4f6" : "#f9fafb",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                            cursor: current ? "pointer" : "not-allowed",
                            fontWeight: 500,
                            color: "#374151"
                        }}
                    >
                        📋 Copy
                    </button>
                </div>
                <textarea
                    value={current?.code || "// No code generated yet"}
                    onChange={(e) => setEditedCode(e.target.value)}
                    spellCheck={false}
                    style={{
                        flex: 1,
                        backgroundColor: "#0f172a",
                        color: "#e2e8f0",
                        padding: "20px",
                        overflow: "auto",
                        fontSize: "12px",
                        fontFamily: "'Fira Code', 'Consolas', monospace",
                        lineHeight: "1.7",
                        border: "none",
                        outline: "none",
                        resize: "none"
                    }}
                />
            </div>

            {/* RIGHT – PREVIEW */}
            <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: "#f3f4f6" }}>
                <div style={{ padding: "14px 20px", borderBottom: "1px solid #e5e7eb", backgroundColor: "#ffffff" }}>
                    <h2 style={{ fontSize: "13px", fontWeight: 600, color: "#374151", margin: 0 }}>
                        🎨 Live Preview
                    </h2>
                </div>
                <div style={{
                    flex: 1,
                    padding: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "auto"
                }}>
                    <div style={{
                        padding: current ? "40px" : "60px",
                        backgroundColor: "white",
                        borderRadius: "16px",
                        boxShadow: current ? "0 10px 25px -5px rgba(0, 0, 0, 0.1)" : "none",
                        minWidth: current ? "300px" : "200px",
                        textAlign: "center",
                        border: current ? "none" : "2px dashed #d1d5db"
                    }}>
                        {current ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
                                <Renderer tree={current.tree} />
                            </div>
                        ) : (
                            <div style={{ color: "#9ca3af", fontSize: "13px" }}>
                                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🎭</div>
                                <div>Waiting for generation...</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
