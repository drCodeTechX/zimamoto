"use client"

import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FireDetectionNode } from "@/types/node"
import { useEffect, useState } from "react"
import { config } from "@/config"

// Import NetworkView dynamically to avoid SSR issues with Leaflet
const NetworkView = dynamic(() => import("@/components/network-view"), {
  ssr: false,
})

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



export default function NetworkPage() {
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
  



  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Fire Detection Network</h2>
      </div>

      <Tabs defaultValue="map" className="space-y-4">
        <TabsList>
          <TabsTrigger value="map">Network Map</TabsTrigger>
          <TabsTrigger value="list">Node List</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <NetworkView nodes={mapToViewDevices} />
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="rounded-md border">
            <div className="grid grid-cols-7 gap-4 p-4 font-medium border-b">
              <div>Node Name</div>
              <div>Region</div>
              <div>Type</div>
              <div>Status</div>
              <div>Battery</div>
              <div>Install Date</div>
              <div>Last Ping</div>
            </div>
            <div className="divide-y">
              {mapToViewDevices.map((node) => (
                <div key={node.id} className="grid grid-cols-7 gap-4 p-4">
                  <div>{node.name}</div>
                  <div>{node.region}</div>
                  <div>{node.type}</div>
                  <div>
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
                  <div>{node.batteryLevel}%</div>
                  <div>{new Date(node.installDate).toLocaleDateString()}</div>
                  <div>{new Date(node.lastPing).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
