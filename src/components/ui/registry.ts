import { Button } from "./Button"
import { Card } from "./Card"
import { Input } from "./Input"
import { Table } from "./Table"
import { Modal } from "./Modal"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"
import { Chart } from "./Chart"

export const componentRegistry = {
    Button,
    Card,
    Input,
    Table,
    Modal,
    Navbar,
    Sidebar,
    Chart,
}

export type AllowedComponent = keyof typeof componentRegistry
