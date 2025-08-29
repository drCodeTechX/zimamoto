export type NodeStatus = "Online" | "Offline" | "Warning" | "Maintenance"

export interface Contact {
  name: string
  role?: string
  phone?: string
  email?: string
}

export interface FireDetectionNode {
  id: string
  name: string
  location: [number, number]
  status: NodeStatus
  batteryLevel: number
  lastPing: string // ISO date string
  region: string
  installDate: string // ISO date string
  type: "Smoke" | "Heat" | "Combined"
  contacts?: Contact[]
}
