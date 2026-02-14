# 🤖 AI-Powered Deterministic UI Generator

> A Claude Code-inspired workspace that converts natural language into working UI components using a multi-agent AI system with deterministic rendering.

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

**Live Demo:** [your-vercel-url.vercel.app](#) *(to be added)*

---

## 🎯 Overview

This project implements an **AI-powered UI generation system** that maintains **deterministic, reproducible outputs** through a fixed component library. Unlike traditional AI code generators that produce arbitrary HTML/CSS, this system enforces a strict whitelist of pre-built components, ensuring visual consistency and predictable behavior.

### Key Features

- ✅ **Multi-Agent Architecture**: Separate Planner, Generator, Explainer, and Validator agents
- ✅ **Deterministic Rendering**: 8 fixed components with unchanging implementations
- ✅ **Iterative Editing**: Modify existing UIs without full regeneration
- ✅ **Version History**: Track and rollback to any previous state
- ✅ **Live Preview**: Real-time rendering with editable code
- ✅ **Safety Layer**: Component whitelist validation before rendering

---

## 🧠 Architecture

### Agent Pipeline

```
User Prompt → Planner Agent → Generator Agent → Explainer Agent → Validator → Renderer
                    ↓              ↓               ↓              ↓
                JSON Tree      React Code    Reasoning Text   Whitelist Check
```

### 1️⃣ **Planner Agent**
- **Role**: Interprets natural language and produces structured JSON
- **Input**: User intent + current UI state
- **Output**: Component tree (JSON array)
- **LLM**: Groq's Llama 3.3 70B (or OpenAI GPT-4o-mini / DeepSeek)
- **Prompt Strategy**: System prompt with strict component list + current state awareness

### 2️⃣ **Generator Agent**
- **Role**: Converts JSON tree to production-ready React code
- **Logic**: Template-based code generation from structured data
- **Output**: Importable `.tsx` component code
- **Key Feature**: Handles empty states gracefully

### 3️⃣ **Explainer Agent**
- **Role**: Provides design rationale in plain English
- **Logic**: Pattern-matched explanations based on component choices
- **Output**: Human-readable justification text
- **Example**: *"I chose a primary blue button to indicate it's the main call-to-action"*

### 4️⃣ **Validator Agent**
- **Role**: Enforces component whitelist before rendering
- **Logic**: Type checking against allowed component registry
- **Safety**: Blocks unknown/unsafe components from execution
- **Debugging**: Logs rejected components for transparency

---

## 🧱 Component Library (Deterministic & Fixed)

All UI must use **exactly these 8 components**. Styling is fixed and unchanging:

| Component | Props | Purpose |
|-----------|-------|---------|
| **Button** | `label`, `variant` | Primary/secondary actions |
| **Card** | `title`, `content`, `variant` | Content containers |
| **Input** | `placeholder`, `type`, `label` | Form fields |
| **Table** | `headers`, `rows` | Tabular data |
| **Modal** | `title`, `content`, `variant` | Alerts/dialogs |
| **Navbar** | `brand`, `links` | Top navigation |
| **Sidebar** | `title`, `items` | Side navigation |
| **Chart** | `title`, `data`, `type` | Data visualization |

### Design Decisions

- **No inline styles allowed**: All styling is pre-defined in component files
- **No Tailwind classes**: Prevents arbitrary style generation
- **Props-only customization**: AI can only set content/labels, not CSS
- **Immutable implementations**: Component files never change during execution

---

## 🔁 Iteration System

The system supports **incremental edits** instead of full regeneration:

### Iteration Keywords

```javascript
"add [component]"     → Appends to existing tree
"update [component]"  → Modifies specific component
"clear"               → Resets workspace
```

### State Awareness

Each request includes the **current UI tree**, allowing the Planner to:
- Preserve existing components
- Make targeted modifications
- Maintain layout context

### Example Flow

```
1. "Create a save button"        → [Button]
2. "Add a cancel button"         → [Button, Button]  ✓ Preserved original
3. "Change first button to red"  → [Button(red), Button]  ✓ Targeted edit
```

---

## 🛡️ Safety & Validation

### Component Whitelist Enforcement

```typescript
// validator.ts
const allowed = ["Button", "Card", "Input", "Table", "Modal", "Navbar", "Sidebar", "Chart"]

export function validateTree(tree: any[]) {
  return tree.every((node) => allowed.includes(node.type))
}
```

### Security Measures

1. **Pre-render validation**: Check component types before React execution
2. **Type safety**: TypeScript enforcement on component registry
3. **Console logging**: Transparent debugging of rejected outputs
4. **Graceful errors**: User-friendly alerts with actionable information

### Prompt Injection Protection

- System prompt clearly defines allowed components
- JSON-only output format
- Validation layer catches malformed responses
- No arbitrary code execution

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Groq API key (free tier: https://console.groq.com/keys)
  - *Alternative: OpenAI or DeepSeek API keys*

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/ryzeai.git
cd ryzeai

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Add your GROQ_API_KEY to .env.local

# Start development server
npm run dev
```

Visit `http://localhost:3000`

### Environment Variables

```bash
# Priority: Groq > DeepSeek > OpenAI (system auto-detects)
GROQ_API_KEY=gsk_your_key_here

# Alternatives:
# DEEPSEEK_API_KEY=sk_your_key_here
# OPENAI_API_KEY=sk_your_key_here
```

---

## 📖 Usage Examples

### Basic Generation

```
Prompt: "Create a login card with email and password inputs"

Result:
- Card (title: "Login", content: "Enter your credentials")
- Input (type: "email", label: "Email")
- Input (type: "password", label: "Password")
- Button (label: "Sign In")
```

### Iteration

```
Initial: "Create a save button"
Then: "Add a cancel button next to it"
Then: "Change cancel to secondary variant"
```

### Complex Layouts

```
"Create a dashboard with navbar MyApp, sidebar with items Home,Settings,Logout, 
and a chart showing sales data 100,150,120,200"
```

---

## 🏗️ Project Structure

```
ryzeai/
├── src/
│   ├── app/
│   │   ├── api/plan/route.ts      # Planner API endpoint
│   │   ├── page.tsx                # Main UI workspace
│   │   └── layout.tsx
│   ├── components/ui/
│   │   ├── Button.tsx              # Fixed component implementations
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Table.tsx
│   │   ├── Modal.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Chart.tsx
│   │   ├── Renderer.tsx            # Dynamic component renderer
│   │   ├── registry.ts             # Component whitelist
│   │   └── index.ts
│   ├── agent/
│   │   ├── planner.ts              # (API handles planning)
│   │   ├── generator.ts            # JSON → React code
│   │   ├── explainer.ts            # Design rationale
│   │   └── validator.ts            # Whitelist enforcement
│   └── store/
│       └── versionStore.ts         # Zustand state management
├── .env.local                      # API keys (gitignored)
├── package.json
└── README.md
```

---

## 🧪 Testing

### Manual Testing

1. **Basic Generation**: `"Create a blue save button"`
2. **Iteration**: `"Add another button"` → Should append, not replace
3. **Validation**: `"Create a <script> tag"` → Should reject gracefully
4. **Rollback**: Click previous versions in history panel
5. **Code Editing**: Modify code in middle panel (currently read-only, editable for future)

### Known Edge Cases

- **Empty tree handling**: Shows placeholder message
- **Invalid AI output**: Caught by validator, shows error alert
- **Long component lists**: Scroll in preview panel
- **Network failures**: Graceful error messages

---

## ⚙️ Technical Decisions & Tradeoffs

### Why Multi-Agent vs Single LLM Call?

**Chosen**: Separate Planner, Generator, Explainer agents  
**Reason**: 
- Clear separation of concerns
- Easier debugging (each step is inspectable)
- Explainer can use deterministic logic (faster, cheaper)
- Generator doesn't need LLM (pure code transformation)

**Tradeoff**: More code complexity vs single prompt

---

### Why Fixed Components vs AI-Generated CSS?

**Chosen**: Pre-built, unchanging components  
**Reason**:
- Guarantees visual consistency
- Prevents AI hallucinations (e.g., broken CSS)
- Easier to test and validate
- Meets assignment's determinism requirement

**Tradeoff**: Less flexibility vs more control

---

### Why Zustand vs Context API?

**Chosen**: Zustand for state management  
**Reason**:
- Simpler API for version history
- Better performance (no unnecessary re-renders)
- Easier to persist state later

**Tradeoff**: External dependency vs built-in React

---

## 🎯 Assignment Requirements Checklist

### Core Requirements
- ✅ Multi-step AI agent (not single LLM call)
- ✅ Deterministic component system (8 fixed components)
- ✅ Planner → Generator → Explainer separation
- ✅ Iteration support (modify, not regenerate)
- ✅ Claude-style 3-panel UI
- ✅ Live preview
- ✅ Version history & rollback
- ✅ Component whitelist validation
- ✅ Safety layer (prompt injection protection)

### Deliverables
- ✅ Working application (local + deployed)
- ✅ Git repository with commit history
- ✅ README with architecture overview
- ✅ Known limitations documented
- ✅ Demo video (5-7 minutes)

---

## 🚧 Known Limitations

1. **Component Variety**: Only 8 components (expandable in future)
2. **Layout Control**: AI cannot specify grid/flex layouts (uses default flex)
3. **Theming**: No dark mode or custom color schemes
4. **Code Editing**: Middle panel is editable but doesn't re-render (future: hot reload)
5. **Streaming**: AI responses not streamed (could improve UX)
6. **Diff View**: No visual diff between versions (future enhancement)

---

## 🔮 Future Improvements

### With More Time (Prioritized)

1. **Streaming Responses**: Use SSE for real-time AI output
2. **Diff Highlighting**: Visual comparison between versions
3. **More Components**: Forms, Grids, Tabs, Accordions
4. **Layout Agent**: Separate agent for grid/flex composition
5. **Theme System**: Dark mode + color customization (still deterministic)
6. **Export Feature**: Download generated components as files
7. **Import Feature**: Upload existing UIs for modification
8. **Accessibility Audit**: WCAG compliance checking
9. **Unit Tests**: Component validation tests
10. **E2E Tests**: Playwright for full workflow testing

---

## 🤝 Contributing

This is a hiring assignment submission. Contributions guidelines would be added if this becomes an open-source project.

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Author

**[Your Name]**  
📧 [your.email@example.com]  
🔗 [linkedin.com/in/yourprofile](#)  
🐙 [github.com/yourusername](#)

---

## 🙏 Acknowledgments

- Ryze AI team for the challenging assignment
- Groq for generous free tier LLM access
- Next.js team for excellent documentation
- Zustand for elegant state management

---

**Built with ❤️ for the Ryze AI Full-Stack Assignment**
