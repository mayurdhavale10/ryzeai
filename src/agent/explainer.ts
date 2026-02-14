export function getExplanation(prompt: string, tree: any[]): string {
    if (prompt.toLowerCase().includes("save")) {
        return "I chose a primary blue button for the 'Save' action to indicate it's the main call-to-action, following standard UI patterns for data persistence."
    }
    if (prompt.toLowerCase().includes("delete")) {
        return "I've used a secondary styling for the delete action to prevent accidental destructive clicks, while keeping the interface clean."
    }
    return `Generated ${tree.length} component(s) based on your request for "${prompt}". Uses deterministic rendering logic.`
}
