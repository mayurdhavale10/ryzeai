const allowed = ["Button", "Card", "Input", "Table", "Modal", "Navbar", "Sidebar", "Chart"]

export function validateTree(tree: any[]) {
    if (!Array.isArray(tree)) return false
    return tree.every((node) => allowed.includes(node.type))
}
