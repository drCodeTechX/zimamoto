"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Emergency } from "@/types/emergency"

interface EmergencySidebarProps {
  emergencies: Emergency[]
  onNavigate?: (emergency: Emergency) => void
}

export function EmergencySidebar({ emergencies, onNavigate }: EmergencySidebarProps) {
  return (
    <div className="w-80 border-r bg-muted/10">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Active Emergencies</h2>
        <p className="text-sm text-muted-foreground">{emergencies.length} active incidents</p>
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="p-4 space-y-4">
          {emergencies.map((emergency) => (
            <Card key={emergency.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{emergency.title}</h3>
                  <Badge variant={emergency.severity === "Critical" ? "destructive" : "default"}>
                    {emergency.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{emergency.address}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => onNavigate?.(emergency)}
                  >
                    Navigate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
