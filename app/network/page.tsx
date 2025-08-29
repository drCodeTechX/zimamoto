"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Search, Battery, Wifi } from "lucide-react"
import type { FireDetectionNode } from "@/types/node"
import { useMemo, useState } from "react"
import { mockNodes } from "@/lib/mock-data"
import { Phone } from "lucide-react"

export default function NetworkPage() {
  const [devices] = useState<FireDetectionNode[]>(mockNodes)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"All" | "Online" | "Offline">("All")
  const [selectedDevice, setSelectedDevice] = useState<FireDetectionNode | null>(null)

  // local UI state to show contacts
  const [showContacts, setShowContacts] = useState(false)

  const counts = useMemo(() => {
    const online = devices.filter((d) => d.status === "Online").length
    const offline = devices.length - online
    return { total: devices.length, online, offline }
  }, [devices])

  const filtered = useMemo(() => {
    return devices.filter((d) => {
      if (statusFilter === "Online" && d.status !== "Online") return false
      if (statusFilter === "Offline" && d.status === "Online") return false
      if (!query) return true
      const q = query.toLowerCase()
      return (
        d.name.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q)
      )
    })
  }, [devices, query, statusFilter])

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-slate-50">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h1 className="text-2xl font-semibold">Network Devices</h1>
            <p className="text-sm text-muted-foreground mt-1">Overview of fire detection devices in the network.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Total:{" "}
              <span className="font-medium">{counts.total}</span>
            </div>
            <Badge variant="default" className="px-3">
              Online: {counts.online}
            </Badge>
            <Badge variant="secondary" className="px-3">
              Offline: {counts.offline}
            </Badge>
          </div>
        </div>

        <div className="flex gap-6 flex-1 overflow-hidden">
          {/* Left: list and controls */}
          <div className="w-full lg:w-2/3 h-full flex flex-col rounded-lg bg-white border shadow-sm overflow-hidden">
            <div className="p-4 border-b flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-100 rounded-md px-3 py-2 flex-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  className="bg-transparent outline-none text-sm w-full"
                  placeholder="Search by name, id or type"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={statusFilter === "All" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter("All")}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "Online" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter("Online")}
                >
                  Online
                </Button>
                <Button
                  variant={statusFilter === "Offline" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter("Offline")}
                >
                  Offline
                </Button>
              </div>
            </div>

            <div className="p-4 overflow-auto flex-1">
              <ul className="space-y-3">
                {filtered.map((device) => {
                  const isOnline = device.status === "Online"
                  const pinColor = isOnline ? "#10B981" : "#EF4444"

                  return (
                    <li
                      key={device.id}
                      className={`flex items-center gap-4 p-3 rounded-md hover:bg-muted/50 transition-colors cursor-pointer ${
                        selectedDevice?.id === device.id ? "ring-2 ring-indigo-300" : ""
                      }`}
                      onClick={() => {
                        setSelectedDevice(device)
                        setShowContacts(false)
                      }}
                    >
                      <div className="flex items-center" style={{ width: 40 }}>
                        <div className="relative" style={{ width: 28, height: 36 }}>
                          <svg viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg" className="block">
                            <defs />
                            <g fill="none" fillRule="evenodd">
                              <path
                                d="M12 0c3.866 0 7 3.134 7 7 0 5.25-7 13-7 13s-7-7.75-7-13c0-3.866 3.134-7 7-7z"
                                fill={pinColor}
                              />
                              <circle cx="12" cy="7" r="4" fill="#fff" opacity="0.15" />
                            </g>
                          </svg>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{device.name}</div>
                            <div className="text-xs text-muted-foreground">
                              ID: {device.id} • {device.type}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-medium">{device.batteryLevel}%</div>
                            <div className="text-xs text-muted-foreground">
                              {device.location[0].toFixed(4)}, {device.location[1].toFixed(4)}
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Battery className="h-4 w-4 text-muted-foreground" />
                            <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full`}
                                style={{
                                  width: `${device.batteryLevel}%`,
                                  background: device.batteryLevel > 30 ? "#10B981" : "#F59E0B",
                                }}
                              />
                            </div>
                          </div>

                          <Badge variant={isOnline ? "default" : "secondary"}>{device.status}</Badge>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => { setSelectedDevice(device); setShowContacts(false) }}>
                            View
                          </Button>
                          <Button size="sm" variant="default" onClick={() => { setSelectedDevice(device); setShowContacts(true) }}>
                            <Phone className="mr-2 h-4 w-4" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </li>
                  )
                })}

                {filtered.length === 0 && (
                  <li className="text-sm text-muted-foreground">No devices found.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Right: details panel */}
          <aside className="hidden lg:block lg:w-1/3 h-full">
            <div className="h-full rounded-lg border bg-white p-4 sticky top-6 overflow-auto">
              {!selectedDevice ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <MapPin className="h-8 w-8 mb-2" />
                  <h3 className="font-semibold">Select a device</h3>
                  <p className="text-sm mt-2">
                    Click any device on the left to view details and quick actions.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{selectedDevice.name}</h3>
                      <div className="text-xs text-muted-foreground">ID: {selectedDevice.id}</div>
                    </div>
                    <Badge variant={selectedDevice.status === "Online" ? "default" : "secondary"}>
                      {selectedDevice.status}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Location</div>
                      <div className="font-medium">
                        {selectedDevice.location[0].toFixed(5)}, {selectedDevice.location[1].toFixed(5)}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground">Type</div>
                      <div className="font-medium">{selectedDevice.type}</div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground">Battery</div>
                      <div className="font-medium">{selectedDevice.batteryLevel}%</div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground">Connectivity</div>
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4" />
                        <span className="text-sm">Signal good</span>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => { setSelectedDevice(null); setShowContacts(false) }}>
                        Close
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowContacts(true)}>
                        Contact
                      </Button>
                    </div>

                    {/* Contacts panel */}
                    {showContacts && (
                      <div className="pt-4">
                        <div className="text-xs text-muted-foreground">Contacts</div>
                        <div className="space-y-2 mt-2">
                          {(selectedDevice?.contacts && selectedDevice.contacts.length > 0) ? (
                            selectedDevice!.contacts!.map((c, idx) => (
                              <div key={idx} className="p-3 border rounded-md">
                                <div className="font-medium">{c.name}</div>
                                <div className="text-xs text-muted-foreground">{c.role}</div>
                                <div className="text-xs mt-1">{c.phone}</div>
                                <div className="text-xs">{c.email}</div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-muted-foreground">No contacts configured for this device.</div>
                          )}

                          <div className="pt-2">
                            <Button size="sm" variant="ghost" onClick={() => setShowContacts(false)}>Close Contacts</Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

// Note: Contacts are available on FireDetectionNode.contacts (mock data). The panel shows them when a device is selected.
