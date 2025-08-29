"use client"

import { useState } from "react"
import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer } from "react-leaflet"
import type { FireDetectionNode } from "@/types/node"
import { NodeMarker } from "./node-marker"


interface NetworkViewProps {
  devices: FireDetectionNode[]
  onDeviceSelect?: (node: FireDetectionNode) => void
}

export default function NetworkView({ devices, onDeviceSelect }: NetworkViewProps) {
  return (
    <div className="h-[calc(100vh-14rem)]">
      <MapContainer
        center={[-3.3667, 36.6833]} // Arusha center
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`}
        />
        {devices.map((device) => (
          <NodeMarker
            key={device.id}
            node={device}
            onClick={onDeviceSelect}
          />
        ))}
      </MapContainer>
    </div>
  )
}