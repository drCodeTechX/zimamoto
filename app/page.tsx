"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { EmergencySidebar } from "@/components/emergency-sidebar"
import { mockEmergencies } from "@/lib/mock-data"

// Import MapView dynamically to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
})

export default function Dashboard() {
  const [routeTo, setRouteTo] = useState<[number, number] | null>(null)
  const [emergencies, setEmergencies] = useState(() => mockEmergencies)
  const handleNavigate = (emergency: { location: [number, number] }) => {
    setRouteTo(emergency.location)
  }

  return (
    <div className="flex h-screen flex-col">
      <main className="flex-1 flex gap-0">
        <EmergencySidebar
          emergencies={emergencies}
          onNavigate={handleNavigate}
        />
        <div className="flex-1">
          <MapView
            defaultLocation={[-3.3667, 36.6833]}
            emergencies={emergencies}
            routeTo={routeTo}
            onNavigateEmergency={handleNavigate}
          />
        </div>
      </main>
    </div>
  )
}
