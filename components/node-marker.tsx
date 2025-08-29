"use client"

import { Marker, Popup } from "react-leaflet"
import { divIcon } from "leaflet"
import type { FireDetectionNode } from "@/types/node"

interface NodeMarkerProps {
  node: FireDetectionNode
  onClick?: (node: FireDetectionNode) => void
}

export function NodeMarker({ node, onClick }: NodeMarkerProps) {
  const isOnline = node.status === "Online"
  const colorName = isOnline ? "green" : "red"
  const colorHex = isOnline ? "#10B981" : "#EF4444"

  const html = `
    <div style="position:relative;width:28px;height:36px;display:flex;align-items:center;justify-content:center;">
      <div style="width:18px;height:18px;border-radius:50%;background:${colorHex};border:2px solid #ffffff;box-shadow:0 4px 10px rgba(0,0,0,0.25);z-index:2;margin:0 auto;"></div>
      <div style="width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:12px solid ${colorHex};position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);"></div>
    </div>
  `

  const icon = divIcon({
    className: "bg-transparent",
    html,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  })

  return (
    <Marker
      position={node.location}
      icon={icon}
      eventHandlers={onClick ? { click: () => onClick(node) } : undefined}
    >
      <Popup>
        <div className="p-2">
          <h3 className="font-semibold mb-1">{node.name}</h3>
          <p className="text-sm text-muted-foreground">Type: {node.type}</p>
          <p className="text-sm text-muted-foreground">Battery: {node.batteryLevel}%</p>
          <p className="text-sm text-muted-foreground">Status: {node.status}</p>
        </div>
      </Popup>
    </Marker>
  )
}
