import L from "leaflet"
import { Marker, Popup } from "react-leaflet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navigation, Phone } from "lucide-react"
import type { Emergency } from "@/types/emergency"

const getMarkerIcon = (type: Emergency["type"], severity: Emergency["severity"]) => {
  const color =
    severity === "Critical" ? "red" : severity === "High" ? "orange" : severity === "Medium" ? "yellow" : "blue"

  const emoji = type === "Fire" ? "🔥" : "💧"

  return L.divIcon({
    className: "custom-marker",
    html: `<div class="w-8 h-8 rounded-full bg-${color}-500 border-2 border-white shadow-lg flex items-center justify-center ${severity === "Critical" ? "animate-pulse" : ""}">
            <span class="text-white text-lg">${emoji}</span>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })
}

interface EmergencyMarkerProps {
  emergency: Emergency
  onClick: (emergency: Emergency) => void
}

export function EmergencyMarker({ emergency, onClick }: EmergencyMarkerProps) {
  return (
    <Marker
      position={emergency.location}
      icon={getMarkerIcon(emergency.type, emergency.severity)}
      eventHandlers={{
        click: () => onClick(emergency),
      }}
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
            <p className="text-sm text-muted-foreground mb-1">{emergency.type} Emergency</p>
            <p className="text-sm text-muted-foreground mb-3">{emergency.address}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="w-full">
                <Navigation className="mr-2 h-4 w-4" />
                Navigate
              </Button>
              <Button size="sm" variant="default" className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                Contact
              </Button>
            </div>
          </CardContent>
        </Card>
      </Popup>
    </Marker>
  )
}
