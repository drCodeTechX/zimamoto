import L from "leaflet"
import { Marker, Popup } from "react-leaflet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Battery, Calendar, Signal, Thermometer, Wind } from "lucide-react"
import type { FireDetectionNode } from "@/types/node"

const getNodeIcon = (status: FireDetectionNode["status"], type: FireDetectionNode["type"]) => {
  const color =
    status === "Online" ? "green" : status === "Warning" ? "yellow" : status === "Maintenance" ? "blue" : "red"

  const icon = type === "Smoke" ? "💨" : type === "Heat" ? "🔥" : "🔍"

  return L.divIcon({
    className: "custom-marker",
    html: `<div class="w-8 h-8 rounded-full bg-${color}-500 border-2 border-white shadow-lg flex items-center justify-center">
            <span class="text-white text-lg">${icon}</span>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })
}

interface NodeMarkerProps {
  node: FireDetectionNode
  onClick: (node: FireDetectionNode) => void
}

export function NodeMarker({ node, onClick }: NodeMarkerProps) {
  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  // Get appropriate icon for node type
  const getTypeIcon = (type: FireDetectionNode["type"]) => {
    switch (type) {
      case "Smoke":
        return <Wind className="h-4 w-4 mr-1" />
      case "Heat":
        return <Thermometer className="h-4 w-4 mr-1" />
      case "Combined":
        return <Signal className="h-4 w-4 mr-1" />
    }
  }

  return (
    <Marker
      position={node.location}
      icon={getNodeIcon(node.status, node.type)}
      eventHandlers={{
        click: () => onClick(node),
      }}
    >
      <Popup className="w-72">
        <Card className="border-none shadow-none">
          <CardHeader className="p-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base">{node.name}</CardTitle>
              <Badge
                variant={
                  node.status === "Online"
                    ? "success"
                    : node.status === "Warning"
                      ? "warning"
                      : node.status === "Maintenance"
                        ? "default"
                        : "destructive"
                }
              >
                {node.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="space-y-2">
              <p className="text-sm flex items-center">
                {getTypeIcon(node.type)} {node.type} Detector
              </p>
              <p className="text-sm flex items-center">
                <Battery className="h-4 w-4 mr-1" /> Battery: {node.batteryLevel}%
              </p>
              <p className="text-sm flex items-center">
                <Calendar className="h-4 w-4 mr-1" /> Installed: {new Date(node.installDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">Region: {node.region}</p>
              <p className="text-sm text-muted-foreground">Last ping: {formatDate(node.lastPing)}</p>
            </div>
          </CardContent>
        </Card>
      </Popup>
    </Marker>
  )
}
