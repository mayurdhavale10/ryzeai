import { NextResponse } from "next/server"
import OpenAI from "openai"
import { generateReactCode } from "@/agent/generator"
import { getExplanation } from "@/agent/explainer"

// Support multiple AI providers
const getClient = () => {
    let apiKey = ""
    let baseURL: string | undefined = undefined

    if (process.env.GROQ_API_KEY) {
        apiKey = process.env.GROQ_API_KEY
        baseURL = "https://api.groq.com/openai/v1"
    } else if (process.env.DEEPSEEK_API_KEY) {
        apiKey = process.env.DEEPSEEK_API_KEY
        baseURL = "https://api.deepseek.com"
    } else if (process.env.OPENAI_API_KEY) {
        apiKey = process.env.OPENAI_API_KEY
    }

    return new OpenAI({
        apiKey: apiKey || "mock_key",
        baseURL,
    })
}

const client = getClient()

// Get model based on provider
const getModel = () => {
    if (process.env.GROQ_API_KEY) return "llama-3.3-70b-versatile"
    if (process.env.DEEPSEEK_API_KEY) return "deepseek-chat"
    return "gpt-4o-mini"
}

export async function POST(req: Request) {
    try {
        const { prompt, currentTree = [] } = await req.json()
        let tree = [...currentTree]
        let explanation = ""

        // 1. Try Real AI call
        const hasValidKey = (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes("your_key_here"))
            || (process.env.DEEPSEEK_API_KEY && !process.env.DEEPSEEK_API_KEY.includes("your_key_here"))
            || (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes("your_key_here"))

        if (hasValidKey) {
            try {
                const completion = await client.chat.completions.create({
                    model: getModel(),
                    messages: [
                        {
                            role: "system",
                            content: `You are a UI planner. You may ONLY use these components:
              - Button (props: label, variant)
              - Card (props: title, content, variant)
              - Input (props: placeholder, type, label)
              - Table (props: headers, rows)
              - Modal (props: title, content, variant)
              - Navbar (props: brand, links)
              - Sidebar (props: title, items)
              - Chart (props: title, data, type)
              
              Current UI state: ${JSON.stringify(currentTree)}
              The user wants to modify this UI. Return the FULL updated JSON array.
              Return ONLY valid JSON.`,
                        },
                        { role: "user", content: prompt },
                    ],
                    temperature: 0.3,
                }, { timeout: 10000 })

                const rawContent = completion.choices[0].message.content || "[]"
                const cleanContent = rawContent.replace(/```json|```/g, "").trim()
                tree = JSON.parse(cleanContent)
                explanation = "AI updated the UI based on your instructions."

                console.log(`✅ Using ${getModel()} - Success`)
            } catch (apiError: any) {
                console.error(`❌ AI API Error (${getModel()}):`, apiError.status, apiError.message)
                if (apiError.status !== 429 && apiError.status !== 401) {
                    return NextResponse.json({ error: apiError.message }, { status: 500 })
                }
            }
        }

        // 2. Mock Fallback (with Iteration Logic)
        if (explanation === "") {
            console.log("Running in MOCK MODE (Iteration)")

            if (prompt.toLowerCase().includes("add") || prompt.toLowerCase().includes("another")) {
                tree.push({ type: "Button", props: { label: "New Item", variant: "secondary" } })
                explanation = "I added a new component to your existing layout."
            } else if (prompt.toLowerCase().includes("clear") || prompt.toLowerCase().includes("reset")) {
                tree = []
                explanation = "I cleared the workspace for you."
            } else if (tree.length > 0 && (prompt.toLowerCase().includes("change") || prompt.toLowerCase().includes("update"))) {
                tree[0].props.label = "Updated " + (tree[0].props.label || "Button")
                explanation = "I updated the existing component as requested."
            } else {
                // Default: Create new button based on prompt keywords
                let label = "New Button"
                let variant: "primary" | "secondary" = "primary"

                if (prompt.toLowerCase().includes("save")) {
                    label = "Save Changes"
                    variant = "primary"
                } else if (prompt.toLowerCase().includes("delete")) {
                    label = "Delete Record"
                    variant = "secondary"
                } else if (prompt.toLowerCase().includes("submit")) {
                    label = "Submit Form"
                    variant = "primary"
                } else if (prompt.toLowerCase().includes("cancel")) {
                    label = "Cancel"
                    variant = "secondary"
                }

                tree = [{ type: "Button", props: { label, variant } }]
                explanation = getExplanation(prompt, tree)
            }
        }

        const code = generateReactCode(tree)

        return NextResponse.json({
            tree,
            code,
            explanation
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
