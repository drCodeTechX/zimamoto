// Arusha coordinates: roughly -3.3667° S, 36.6833° E
export interface FireDetectionNode {
  id: string
  name: string
  location: [number, number]
  status: "Online" | "Offline"
  batteryLevel: number
  lastPing: string
  region: string
  installDate: string
  type: "Heat" | "Smoke" | "Combined"
  contacts?: { name: string; role?: string; phone?: string; email?: string }[]
}

export const mockNodes: FireDetectionNode[] = [
  {
    id: "node-01",
    name: "Clock Tower",
    location: [-3.3667, 36.6833],
    status: "Online",
    batteryLevel: 85,
    lastPing: new Date().toISOString(),
    region: "Arusha CBD",
    installDate: "2025-01-15",
    type: "Combined",
    contacts: [
      { name: "John M", role: "Station Officer", phone: "+255 27 254 xxxx", email: "john.m@arushafire.go.tz" }
    ]
  },
  {
    id: "node-02",
    name: "Sheikh Amri Abeid Stadium",
    location: [-3.3739, 36.6911],
    status: "Online",
    batteryLevel: 92,
    lastPing: new Date().toISOString(),
    region: "Arusha",
    installDate: "2025-01-15",
    type: "Heat",
    contacts: [
      { name: "Asha K", role: "Field Officer", phone: "+255 27 254 yyyy", email: "asha.k@arushafire.go.tz" }
    ]
  },
  {
    id: "node-03",
    name: "Central Market",
    location: [-3.3698, 36.6878],
    status: "Online",
    batteryLevel: 78,
    lastPing: new Date().toISOString(),
    region: "Arusha CBD",
    installDate: "2025-01-15",
    type: "Smoke",
    contacts: [
      { name: "Peter L", role: "Contact", phone: "+255 27 254 zzzz", email: "peter.l@arushafire.go.tz" }
    ]
  },
  {
    id: "node-04",
    name: "Arusha Technical College",
    location: [-3.3611, 36.6911],
    status: "Online",
    batteryLevel: 95,
    lastPing: new Date().toISOString(),
    region: "Arusha",
    installDate: "2025-01-15",
    type: "Combined",
    contacts: [
      { name: "Sara N", role: "Liaison", phone: "+255 27 254 aaaa", email: "sara.n@arushafire.go.tz" }
    ]
  },
  {
    id: "node-05",
    name: "Arusha Declaration Museum",
    location: [-3.3728, 36.6856],
    status: "Online",
    batteryLevel: 88,
    lastPing: new Date().toISOString(),
    region: "Arusha",
    installDate: "2025-01-15",
    type: "Combined",
    contacts: [
      { name: "Michael B", role: "Curator", phone: "+255 27 254 bbbb", email: "michael.b@arushafire.go.tz" }
    ]
  }
]

// Arusha Fire & Rescue Agency (approximate) - replace with exact if available
export const arushaFireAgencyLocation: [number, number] = [-3.3675, 36.6825]

// Use Emergency from types/emergency.ts
import type { Emergency, EmergencyType } from "@/types/emergency"

export const mockEmergencies: Emergency[] = [
  {
    id: "emg-01",
    location: [-3.3739, 36.6911], // Sheikh Amri Abeid Stadium
    title: "Fire Alert at Sheikh Amri Abeid Stadium",
    type: "Fire" as EmergencyType,
    severity: "High",
    address: "Sheikh Amri Abeid Stadium, Arusha"
  },
  {
    id: "emg-02",
    location: [-3.3698, 36.6878], // Central Market
    title: "Fire Detection at Central Market",
    type: "Fire" as EmergencyType,
    severity: "Critical",
    address: "Central Market Area, Arusha CBD"
  }
]

// Device-level contacts are provided on each FireDetectionNode (mockNodes) and will be shown when contacting a device owner.
