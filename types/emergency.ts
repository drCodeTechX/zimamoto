export type EmergencyType = "Fire" | "Flood"

export interface Emergency {
  id: string
  location: [number, number]
  title: string
  type: EmergencyType
  severity: "Critical" | "High" | "Medium" | "Low"
  address: string
}
