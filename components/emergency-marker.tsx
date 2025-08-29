import L from "leaflet"
import { useState } from "react"
import { Marker, Popup } from "react-leaflet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navigation, Phone } from "lucide-react"
import type { Emergency } from "@/types/emergency"
import { mockNodes } from "@/lib/mock-data"

import type { FireDetectionNode } from "@/types/node"

interface EmergencyMarkerProps {
  emergency: Emergency
  onClick?: (emergency: Emergency) => void
}

export const getMarkerIcon = (type: Emergency["type"], severity: Emergency["severity"]) => {
  const color =
    severity === "Critical" ? "red" : severity === "High" ? "orange" : severity === "Medium" ? "yellow" : "blue"

  const emoji = type === "Fire" ? "🔥" : "💧"

  const html = `<div class="w-8 h-8 rounded-full bg-${color}-500 border-2 border-white shadow-lg flex items-center justify-center ${
    severity === "Critical" ? "animate-pulse" : ""
  }"><span class="text-white text-lg">${emoji}</span></div>`

  return L.divIcon({
    className: "custom-marker",
    html,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })
}

export function EmergencyMarker({ emergency, onClick }: EmergencyMarkerProps) {
  const [showContacts, setShowContacts] = useState(false)

  // Find nearest device to the emergency location (simple squared-distance on lat/lon)
  const findNearestDevice = (loc: [number, number]): FireDetectionNode | null => {
    if (!mockNodes || mockNodes.length === 0) return null
    let best: FireDetectionNode | null = null
    let bestDist = Infinity
    for (const node of mockNodes) {
      const dLat = node.location[0] - loc[0]
      const dLon = node.location[1] - loc[1]
      const dist = dLat * dLat + dLon * dLon
      if (dist < bestDist) {
        bestDist = dist
        best = node
      }
    }
    return best
  }

  const nearestDevice = findNearestDevice(emergency.location)
  return (
    <Marker
      position={emergency.location}
      icon={getMarkerIcon(emergency.type, emergency.severity)}
      eventHandlers={onClick ? { click: () => onClick(emergency) } : undefined}
    >
      <Popup className="w-72">
        <Card className="border-none shadow-none">
          <CardHeader className="p-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base">{emergency.title}</CardTitle>
              <Badge variant={emergency.severity === "Critical" ? "destructive" : "default"} className="ml-2">
                {emergency.severity}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            {!showContacts ? (
              <>
                <p className="text-sm text-muted-foreground mb-1">{emergency.type} Emergency</p>
                <p className="text-sm text-muted-foreground mb-3">{emergency.address}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (onClick) onClick(emergency)
                    }}
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    Navigate
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowContacts(true)
                    }}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                </div>
              </>
            ) : (
              <div>
                {nearestDevice && nearestDevice.contacts && nearestDevice.contacts.length > 0 ? (
                  <>
                    <div className="text-sm text-muted-foreground mb-2">Contacts for device: {nearestDevice.name}</div>
                    <div className="space-y-2">
                      {nearestDevice.contacts.map((c, i) => (
                        <div key={i} className="p-2 border rounded">
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.role}</div>
                          <div className="text-xs mt-1">{c.phone}</div>
                          <div className="text-xs">{c.email}</div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">No device owner contacts available near this emergency.</div>
                )}
                <div className="mt-3">
                  <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setShowContacts(false) }}>Close</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Popup>
    </Marker>
  )
}
