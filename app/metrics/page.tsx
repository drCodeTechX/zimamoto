"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

const rescuedData = [
  { month: "Jan", houses: 45, people: 120 },
  { month: "Feb", houses: 52, people: 140 },
  { month: "Mar", houses: 49, people: 130 },
  { month: "Apr", houses: 62, people: 170 },
  { month: "May", houses: 55, people: 150 },
  { month: "Jun", houses: 71, people: 190 },
  { month: "Jul", houses: 58, people: 160 },
  { month: "Aug", houses: 63, people: 180 },
  { month: "Sep", houses: 60, people: 170 },
  { month: "Oct", houses: 66, people: 185 },
  { month: "Nov", houses: 53, people: 145 },
  { month: "Dec", houses: 48, people: 130 },
]

const responseTimeData = [
  { month: "Jan", fire: 8.2, flood: 12.5 },
  { month: "Feb", fire: 7.9, flood: 11.8 },
  { month: "Mar", fire: 8.1, flood: 12.2 },
  { month: "Apr", fire: 7.7, flood: 11.5 },
  { month: "May", fire: 7.8, flood: 11.9 },
  { month: "Jun", fire: 7.5, flood: 11.2 },
  { month: "Jul", fire: 7.6, flood: 11.4 },
  { month: "Aug", fire: 7.4, flood: 11.0 },
  { month: "Sep", fire: 7.3, flood: 10.8 },
  { month: "Oct", fire: 7.2, flood: 10.7 },
  { month: "Nov", fire: 7.5, flood: 11.3 },
  { month: "Dec", fire: 7.8, flood: 11.7 },
]

const incidentTypesData = [
  { type: "Residential Fire", count: 280 },
  { type: "Commercial Fire", count: 150 },
  { type: "Industrial Fire", count: 80 },
  { type: "Vehicle Fire", count: 120 },
  { type: "Flash Flood", count: 90 },
  { type: "River Flood", count: 70 },
  { type: "Urban Flood", count: 110 },
  { type: "Other", count: 50 },
]

export default function MetricsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Metrics Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Houses Saved</CardTitle>
                <CardDescription>Total houses saved this year</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">682</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>People Rescued</CardTitle>
                <CardDescription>Total people rescued this year</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">1,870</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Avg. Fire Response</CardTitle>
                <CardDescription>In minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">7.6</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Avg. Flood Response</CardTitle>
                <CardDescription>In minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">11.5</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Rescues per Month</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={rescuedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="houses" name="Houses" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="people" name="People" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Incident Types</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={incidentTypesData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="type" type="category" width={150} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Average Response Time Trend</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="fire" name="Fire" stroke="#ff7300" />
                    <Line type="monotone" dataKey="flood" name="Flood" stroke="#0088fe" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-full">
                      <p className="text-sm font-medium">Successful Rescues</p>
                      <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: "92%" }}></div>
                      </div>
                    </div>
                    <span className="ml-4 text-sm font-medium">92%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full">
                      <p className="text-sm font-medium">Fire Response Time Target Met</p>
                      <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: "87%" }}></div>
                      </div>
                    </div>
                    <span className="ml-4 text-sm font-medium">87%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full">
                      <p className="text-sm font-medium">Flood Response Time Target Met</p>
                      <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: "83%" }}></div>
                      </div>
                    </div>
                    <span className="ml-4 text-sm font-medium">83%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full">
                      <p className="text-sm font-medium">Equipment Readiness</p>
                      <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: "95%" }}></div>
                      </div>
                    </div>
                    <span className="ml-4 text-sm font-medium">95%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
