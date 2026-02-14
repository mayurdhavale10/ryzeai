import { componentRegistry } from "./registry"

type UINode = {
    type: keyof typeof componentRegistry
    props: any
}

export function Renderer({ tree }: { tree: UINode[] }) {
    return (
        <>
            {tree.map((node, i) => {
                const Component = componentRegistry[node.type]
                if (!Component) return null

                return <Component key={i} {...node.props} />
            })}
        </>
    )
}
