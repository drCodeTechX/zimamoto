"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import { EmergencyMarker } from "./emergency-marker"
import { NoEmergencies } from "./no-emergencies"
import type { Emergency } from "@/types/emergency"

// Import Leaflet components dynamically to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)

// MapController must be inside component to access useMap properly
let MapController: any = null

const DynamicMapController = dynamic(() =>
  import("react-leaflet").then(({ useMap }) => {
    MapController = function ({ selectedEmergency, setMap }: any) {
      const map = useMap()

      useEffect(() => {
        setMap(map)
      }, [map, setMap])

      useEffect(() => {
        if (map && selectedEmergency) {
          map.setView(selectedEmergency.location, 16)
        }
      }, [map, selectedEmergency])

      return null
    }

    return () => null
  }), { ssr: false })

interface MapViewProps {
  emergencies: Emergency[]
  selectedEmergency?: Emergency
  onEmergencySelect: (emergency: Emergency) => void
}

export default function MapView({ emergencies, selectedEmergency, onEmergencySelect }: MapViewProps) {
  const [map, setMap] = useState<any>(null)
  const defaultCenter: [number, number] = [-3.3869, 36.6830]
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="h-full w-full bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        className="h-full w-full rounded-lg"
        style={{ height: "calc(100vh - 8rem)" }}
      >
        {MapController && (
          <MapController selectedEmergency={selectedEmergency} setMap={setMap} />
        )}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`}
        />
        {emergencies.map((emergency) => (
          <EmergencyMarker key={emergency.id} emergency={emergency} onClick={onEmergencySelect} />
        ))}
      </MapContainer>
      {emergencies.length === 0 && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <NoEmergencies />
        </div>
      )}
    </div>
  )
}
