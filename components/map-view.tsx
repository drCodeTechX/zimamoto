"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import { mockNodes, arushaFireAgencyLocation } from "@/lib/mock-data"
import type { Emergency } from "@/types/emergency"
import { NodeMarker } from "./node-marker"
import { EmergencyMarker } from "./emergency-marker"
import { Polyline, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import { useMap } from 'react-leaflet'

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)

interface MapViewProps {
  defaultLocation: [number, number]
  emergencies: Emergency[]
  routeTo?: [number, number] | null
  onNavigateEmergency?: (emergency: Emergency) => void
  onClearRoute?: () => void
}

export default function MapView({ defaultLocation, emergencies, routeTo, onNavigateEmergency, onClearRoute }: MapViewProps) {
  const [isClient, setIsClient] = useState(false)

  // Use the Arusha Fire & Rescue Agency location from mock data
  const fireAgencyLocation = arushaFireAgencyLocation

  // State to hold routed coordinates (lat, lng pairs for Leaflet), distance (meters) and duration (seconds)
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([])
  const [routeSteps, setRouteSteps] = useState<any[]>([])
  const [showSteps, setShowSteps] = useState(false)
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null)
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null)
  const [isRouting, setIsRouting] = useState(false)
  const [routingError, setRoutingError] = useState<string | null>(null)

  // Large custom icon for the fire agency
  const fireAgencyIcon = L.divIcon({
    className: "fire-agency-icon",
    // SVG of a fire station / house silhouette to represent the agency (white on red circle)
    html: `
      <div style="width:56px;height:56px;border-radius:50%;background:#DC2626;display:flex;align-items:center;justify-content:center;border:3px solid #fff;box-shadow:0 6px 18px rgba(0,0,0,0.25);">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3l8 6v10a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1V9l8-6z" fill="#fff"/>
          <path d="M9 13h6v4H9v-4z" fill="#DC2626"/>
          <path d="M7 9h10v2H7V9z" fill="#fff" opacity="0.9"/>
        </svg>
      </div>
    `,
    iconSize: [56, 56],
    iconAnchor: [28, 56],
    popupAnchor: [0, -56],
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch route from OSRM whenever routeTo changes
  useEffect(() => {
    // Reset routing state when no destination
    if (!routeTo) {
      setRouteCoords([])
      setDistanceMeters(null)
      setDurationSeconds(null)
      setRoutingError(null)
      setIsRouting(false)
      return
    }

    const abort = new AbortController()
    setIsRouting(true)
    setRoutingError(null)

    // fireAgencyLocation and routeTo are both [lat, lng]
    const [oLat, oLng] = fireAgencyLocation
    const [dLat, dLng] = routeTo

    // OSRM expects lon,lat order
    const url = `https://router.project-osrm.org/route/v1/driving/${oLng},${oLat};${dLng},${dLat}?overview=full&geometries=geojson&steps=true`

    fetch(url, { signal: abort.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`OSRM responded with ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (!data || !data.routes || data.routes.length === 0) {
          throw new Error("No route found from OSRM")
        }
        const route = data.routes[0]
        // Convert [[lon, lat], ...] to [[lat, lon], ...] for Leaflet
        const coords: [number, number][] = route.geometry.coordinates.map((c: number[]) => [c[1], c[0]])
        setRouteCoords(coords)
        setDistanceMeters(typeof route.distance === "number" ? route.distance : null)
        setDurationSeconds(typeof route.duration === "number" ? route.duration : null)
        // store steps (if present) for simple step-by-step directions
        const steps = route.legs && route.legs[0] && Array.isArray(route.legs[0].steps) ? route.legs[0].steps : []
        setRouteSteps(steps)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        console.error("Failed to fetch OSRM route:", err)
        setRoutingError(err.message || String(err))
        // keep routeCoords empty so UI can fall back to a straight line
        setRouteCoords([])
        setDistanceMeters(null)
        setDurationSeconds(null)
      })
      .finally(() => setIsRouting(false))

    return () => abort.abort()
  }, [routeTo, fireAgencyLocation])

  // Only set client-side rendering flag
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fit bounds using a small child that grabs the map via useMap (avoids MapContainer typing issues)
  function FitBounds({ coords, dest, origin }: { coords: [number, number][]; dest?: [number, number] | null; origin: [number, number] }) {
    const map = useMap()
    useEffect(() => {
      if (!map) return
      if (coords && coords.length > 0) {
        try {
          const bounds = L.latLngBounds(coords as L.LatLngExpression[])
          map.fitBounds(bounds, { padding: [40, 40] })
        } catch (e) {
          // ignore
        }
        return
      }
      if (dest) {
        try {
          const bounds = L.latLngBounds([origin as L.LatLngExpression, dest as L.LatLngExpression])
          map.fitBounds(bounds, { padding: [40, 40] })
        } catch (e) {
          // ignore
        }
      }
    }, [map, coords, dest, origin])
    return null
  }

  const distanceKm = distanceMeters != null ? (distanceMeters / 1000).toFixed(2) : null
  const durationMin = durationSeconds != null ? Math.round(durationSeconds / 60) : null

  // Localized distance formatter (uses browser locale)
  const formatDistance = (meters: number | null) => {
    if (meters == null) return null
    try {
      const locale = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language : 'en-US'
      if (meters >= 1000) {
        const km = meters / 1000
        return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(km) + ' km'
      }
      return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(meters) + ' m'
    } catch (e) {
      // fallback
      if (meters >= 1000) return (meters / 1000).toFixed(2) + ' km'
      return Math.round(meters) + ' m'
    }
  }

  const formatDuration = (seconds: number | null) => {
    if (seconds == null) return null
    const mins = Math.round(seconds / 60)
    return `${mins} min`
  }

  if (!isClient) {
    return <div className="h-full w-full bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
  }

  return (
    <div className="h-[calc(100vh-8rem)] relative">
      {/* Small routing info overlay */}
      {routeTo && (
        <div className="absolute top-4 right-4 z-10 max-w-xs">
          <div className="bg-white/95 text-sm rounded shadow p-2">
            {isRouting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                <div>Routing — fetching route...</div>
              </div>
            ) : routingError ? (
              <div className="text-red-600">Routing error</div>
            ) : (distanceMeters != null && durationSeconds != null) ? (
              <div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Route</div>
                    <div className="text-xs text-muted-foreground">{formatDistance(distanceMeters)} • {formatDuration(durationSeconds)}</div>
                  </div>
                  {routeSteps && routeSteps.length > 0 && (
                    <button
                      className="text-xs underline text-blue-600"
                      onClick={() => setShowSteps((s) => !s)}
                    >
                      {showSteps ? 'Hide steps' : 'Show steps'}
                    </button>
                  )}
                </div>
                {showSteps && routeSteps && routeSteps.length > 0 && (
                  <div className="mt-2 max-h-48 overflow-auto text-xs text-muted-foreground space-y-1">
                    {routeSteps.map((step: any, idx: number) => {
                      const maneuver = step.maneuver || {}
                      const name = step.name || ''
                      const instr = `${maneuver.type || 'Proceed'}${maneuver.modifier ? ' ' + maneuver.modifier : ''}${name ? ' onto ' + name : ''}`
                      return (
                        <div key={idx} className="border-b pb-1">
                          <div className="font-medium">{idx + 1}. {instr}</div>
                          <div className="text-muted-foreground">{formatDistance(step.distance)} • {formatDuration(step.duration)}</div>
                        </div>
                      )
                    })}
                  </div>
                )}
                <div className="mt-2 flex gap-2">
                  <button
                    className="text-xs px-2 py-1 bg-gray-100 rounded"
                    onClick={() => {
                      // clear persisted route and local route state
                      try { localStorage.removeItem('zimamoto.lastRoute') } catch (e) {}
                      setRouteCoords([])
                      setDistanceMeters(null)
                      setDurationSeconds(null)
                      if (onClearRoute) onClearRoute()
                    }}
                  >
                    Clear route
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">No route data</div>
            )}
          </div>
        </div>
      )}

      <MapContainer
        center={defaultLocation}
                  zoom={15}
        className="h-full w-full"
      >
        {/* Fit to route bounds when route is available */}
        <FitBounds coords={routeCoords} dest={routeTo} origin={fireAgencyLocation} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`}
        />
        {mockNodes.map((node) => (
          <NodeMarker key={node.id} node={node} />
        ))}
        {emergencies.map((emergency) => (
          <EmergencyMarker key={emergency.id} emergency={emergency} onClick={onNavigateEmergency} />
        ))}
        {/* Fire & Rescue Agency marker (large) */}
        <Marker position={fireAgencyLocation} icon={fireAgencyIcon}>
          <Popup>
            <div className="p-2">
              <strong>Arusha Fire &amp; Rescue Agency</strong>
              <div className="text-sm text-muted-foreground">Primary dispatch &amp; coordination</div>
            </div>
          </Popup>
        </Marker>

        {/* Destination marker and route polyline (use OSRM route if available, otherwise straight line) */}
        {routeTo && (() => {
          const dest = routeTo as [number, number]
          return (
            <>
              {/* Destination marker */}
              <Marker position={dest as L.LatLngExpression}>
                <Popup>
                  <div className="p-2">
                    <strong>Destination</strong>
                    <div className="text-sm text-muted-foreground">{`${dest[0].toFixed(5)}, ${dest[1].toFixed(5)}`}</div>
                    {(distanceKm && durationMin) && (
                      <div className="mt-2 text-sm">{distanceKm} km • {durationMin} min</div>
                    )}
                  </div>
                </Popup>
              </Marker>

              {/* Use routed coordinates when available */}
              {routeCoords && routeCoords.length > 0 ? (
                <Polyline positions={routeCoords} color="blue" weight={5} />
              ) : (
                <Polyline positions={[fireAgencyLocation as L.LatLngExpression, dest as L.LatLngExpression]} color="blue" />
              )}
            </>
          )
        })()}
      </MapContainer>
    </div>
  )
}
