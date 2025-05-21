"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Navigation, Droplet, Flame, CheckCircle } from "lucide-react"
import type { Emergency } from "@/types/emergency"

interface EmergencySidebarProps {
  emergencies: Emergency[]
  selectedEmergency?: Emergency
  onEmergencySelect: (emergency: Emergency) => void
}

export function EmergencySidebar({ emergencies, selectedEmergency, onEmergencySelect }: EmergencySidebarProps) {
  return (
    <div className="w-80 border-r bg-muted/10">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Active Emergencies</h2>
        <p className="text-sm text-muted-foreground">{emergencies.length} active incidents</p>
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        {emergencies.length === 0 ? (
          <div className="p-4 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <p className="text-lg font-semibold">All Clear</p>
            <p className="text-sm text-muted-foreground">No active emergencies</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {emergencies.map((emergency) => (
              <Card
                key={emergency.id}
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedEmergency?.id === emergency.id ? "border-primary" : ""
                }`}
                onClick={() => onEmergencySelect(emergency)}
              >
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{emergency.title}</CardTitle>
                    <Badge variant={emergency.severity === "Critical" ? "destructive" : "default"}>
                      {emergency.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground mb-1">
                    {emergency.type === "Fire" ? (
                      <Flame className="inline mr-1" />
                    ) : (
                      <Droplet className="inline mr-1" />
                    )}
                    {emergency.type} Emergency
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">{emergency.address}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="w-full">
                      <Navigation className="mr-2 h-4 w-4" />
                      Navigate
                    </Button>
                    <Button size="sm" variant="destructive" className="w-full">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Respond
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
