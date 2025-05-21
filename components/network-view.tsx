"use client"

import { useState, useEffect } from "react"
import type L from "leaflet"
import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, useMap, Circle, Tooltip } from "react-leaflet"
import {  } from "./node-marker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FireDetectionNode } from "@/types/node"
import { NodeMarker } from "./component-node-marker"
import { config } from "@/config"


interface Device {
  id: string
  deviceId: string
  deviceName: string
  listToBeNotified: {
    name: string
    phoneNumber: string
  }[]
  userId: string
  latitude: number
  longitude: number
  online: boolean
}

interface NetworkViewProps {
  nodes: FireDetectionNode[]
}

export default function NetworkView({ nodes }: NetworkViewProps) {
  const [map, setMap] = useState<L.Map | null>(null)
  const [selectedNode, setSelectedNode] = useState<FireDetectionNode | null>(null)
  const [filter, setFilter] = useState<"all" | "online" | "offline" | "warning" | "maintenance">("all")
  const [regionFilter, setRegionFilter] = useState<string>("all")
  const [mapToViewDevices, setMapToViewDevices] = useState<FireDetectionNode[]>([])


  const [devices, setDevices] = useState<Device[]>([])

  useEffect(() => {
    fetch(`${config.apiUrl}/registeredDevices`)
      .then((response) => response.json())
      .then((data) => {
        setDevices(data)
        let devicesToView: FireDetectionNode[] =  data.map((device: Device) => {
          console.log(device);

  
         return {
          id: device.id,
          name: device.deviceName,
          location: [device.latitude, device.longitude],
          status: "Online",
          batteryLevel: 100,
          lastPing: "2023-06-01T00:00:00.000Z",
          region: "arusha",
          installDate: "2023-06-01T00:00:00.000Z",
          type: "Smoke",
         }
        })

        console.log(data);
        
        console.log(devicesToView);
        
        setMapToViewDevices(devicesToView)
      })
  },
  )


const regions: string[] = [
    "dar es salaam",
    "dodoma",
    "mbeya",
    "mwanza",
    "arusha",

]
  // Filter nodes based on selected filters
  const filteredNodes = nodes.filter((node) => {
    // Filter by status
    if (filter !== "all") {
      if (filter === "online" && node.status !== "Online") return false
      if (filter === "offline" && node.status !== "Offline") return false
      if (filter === "warning" && node.status !== "Warning") return false
      if (filter === "maintenance" && node.status !== "Maintenance") return false
    }

    // Filter by region
    if (regionFilter !== "all" && node.region !== regionFilter) return false

    return true
  })

  // Calculate statistics

  const defaultCenter: [number, number] = [-3.3869, 36.6830]

  function MapController() {
    const map = useMap()
    useEffect(() => {
      setMap(map)
    }, [map])
    return null
  }

  // Center map on selected node
  useEffect(() => {
    if (map && selectedNode) {
      map.setView(selectedNode.location, 16)
    }
  }, [map, selectedNode])

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="md:w-1/4">
          <CardHeader>
            <CardTitle>Network Status</CardTitle>
            <CardDescription>Fire detection network overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Total Nodes</p>
                <p className="text-3xl font-bold">{devices.length}</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-green-50 p-2 rounded-md">
                  <p className="text-xs text-green-700">Online</p>
                  <p className="text-xl font-semibold text-green-700">{1}</p>
                </div>
                <div className="bg-red-50 p-2 rounded-md">
                  <p className="text-xs text-red-700">Offline</p>
                  <p className="text-xl font-semibold text-red-700">{devices.length - 1}</p>
                </div>
                <div className="bg-yellow-50 p-2 rounded-md">
                  <p className="text-xs text-yellow-700">Warning</p>
                  <p className="text-xl font-semibold text-yellow-700">{0}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Filter by Status</p>
                <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Nodes</SelectItem>
                    <SelectItem value="online">Online Only</SelectItem>
                    <SelectItem value="offline">Offline Only</SelectItem>
                    <SelectItem value="warning">Warning Only</SelectItem>
                    <SelectItem value="maintenance">Maintenance Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Filter by Region</p>
                <Select value={regionFilter} onValueChange={(value: any) => setRegionFilter(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Network Map</CardTitle>
            <CardDescription>
              Showing {devices.length} nodes
              {filter !== "all" && ` with status: ${filter}`}
              {regionFilter !== "all" && ` in region: ${regionFilter}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] rounded-md overflow-hidden">
              <MapContainer center={defaultCenter} zoom={12} className="h-full w-full">
                <MapController />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`}
                />

                {/* Group nodes by region and draw coverage circles */}
                {regions.map((region) => {
                  const regionNodes = mapToViewDevices.filter((node) => node.region === region)
                  if (mapToViewDevices.length === 0) return null

                  // Calculate center point of the region
                  const latSum = mapToViewDevices.reduce((sum, node) => sum + node.location[0], 0)
                  const lngSum = mapToViewDevices.reduce((sum, node) => sum + node.location[1], 0)
                  const center: [number, number] = [latSum / mapToViewDevices.length, lngSum / mapToViewDevices.length]

                  // Calculate radius to cover all nodes (simple approach)
                  const maxDistance = Math.max(
                    ...mapToViewDevices.map((node) => {
                      const dx = (node.location[0] - center[0]) * 111000 // approx meters per degree
                      const dy = (node.location[1] - center[1]) * 111000 * Math.cos((center[0] * Math.PI) / 180)
                      return Math.sqrt(dx * dx + dy * dy)
                    }),
                  )

                  // Add 20% buffer
                  const radius = maxDistance * 1.2

                  return (
                    <Circle
                      key={region}
                      center={center}
                      radius={radius}
                      pathOptions={{
                        color: "#FF5733",
                        fillColor: "#FF5733",
                        fillOpacity: 0.1,
                      }}
                    >
                      <Tooltip direction="center" permanent>
                        {region} ({regionNodes.length} nodes)
                      </Tooltip>
                    </Circle>
                  )
                })}

                {/* Display individual nodes */}
                {mapToViewDevices.map((node) => (
                  <NodeMarker key={node.id} node={node} onClick={setSelectedNode} />
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
