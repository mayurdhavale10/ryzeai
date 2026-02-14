import { componentRegistry } from "./registry"

type UINode = {
    type: keyof typeof componentRegistry
    props: any
}

export function Renderer({ tree }: { tree: UINode[] }) {
    // Safety check: ensure tree is an array
    if (!Array.isArray(tree)) {
        console.error("Renderer received non-array tree:", tree)
        return <div style={{ color: "red" }}>Error: Invalid tree structure</div>
    }

    return (
        <>
            {tree.map((node, i) => {
                // Validate node structure
                if (!node || typeof node !== "object" || !node.type) {
                    console.error("Invalid node at index", i, node)
                    return null
                }

                const Component = componentRegistry[node.type]
                if (!Component) {
                    console.error("Unknown component type:", node.type)
                    return null
                }

                // Ensure props is an object
                const props = node.props && typeof node.props === "object" ? node.props : {}

                return <Component key={i} {...props} />
            })}
        </>
    )
}
