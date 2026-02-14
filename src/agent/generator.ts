type UINode = {
    type: string
    props: any
}

export function generateReactCode(tree: UINode[]): string {
    // Handle empty tree case
    if (tree.length === 0) {
        return `export default function GeneratedUI() {
  return (
    <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>
      <p>No components yet. Ask the AI to generate something!</p>
    </div>
  )
}`
    }

    const components = tree.map((node) => {
        const propsString = Object.entries(node.props)
            .map(([key, value]) => `${key}="${value}"`)
            .join(" ")

        return `      <${node.type} ${propsString} />`
    }).join("\n")

    const uniqueComponentTypes = Array.from(new Set(tree.map(n => n.type)))

    return `import { ${uniqueComponentTypes.join(", ")} } from "@/components/ui"

export default function GeneratedUI() {
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
${components}
    </div>
  )
}`.trim()
}
