"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Header } from "@/components/header"
import { EmergencySidebar } from "@/components/emergency-sidebar"
import type { Emergency } from "@/types/emergency"

// Import MapView dynamically to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
})

// Sample emergency data (can be empty to test no emergencies scenario)
const sampleEmergencies: Emergency[] = [
  // {
  //   id: "1",
  //   location: [-6.2088, 106.8456],
  //   title: "Commercial Building Fire",
  //   type: "Fire",
  //   severity: "Critical",
  //   address: "Plaza Indonesia, Jl. M.H. Thamrin No.28-30",
  // },
  // {
  //   id: "2",
  //   location: [-6.2156, 106.8486],
  //   title: "Residential Flooding",
  //   type: "Flood",
  //   severity: "High",
  //   address: "Menteng, Central Jakarta",
  // },
  // {
  //   id: "3",
  //   location: [-6.2008, 106.8366],
  //   title: "Industrial Fire",
  //   type: "Fire",
  //   severity: "Medium",
  //   address: "Tanah Abang, Central Jakarta",
  // },
  // {
  //   id: "4",
  //   location: [-6.19, 106.82],
  //   title: "Flash Flood",
  //   type: "Flood",
  //   severity: "High",
  //   address: "Kemayoran, Central Jakarta",
  // },
]

export default function Dashboard() {
  const [selectedEmergency, setSelectedEmergency] = useState(sampleEmergencies[0])

  return (
    <div className="flex h-screen flex-col">
 
      <div className="flex flex-1 overflow-hidden">
        <EmergencySidebar
          emergencies={sampleEmergencies}
          selectedEmergency={selectedEmergency}
          onEmergencySelect={setSelectedEmergency}
        />
        <main className="flex-1 p-4">
          <MapView
            emergencies={sampleEmergencies}
            selectedEmergency={selectedEmergency}
            onEmergencySelect={setSelectedEmergency}
          />
        </main>
      </div>
    </div>
  )
}
