import { AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function NoEmergencies() {
  return (
    <Card className="w-96 bg-white bg-opacity-90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">No Active Emergencies</CardTitle>
        <CardDescription>The city is safe and sound</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <AlertCircle className="w-24 h-24 text-green-500 mb-4" />
        <p className="text-muted-foreground text-center">
          Stay vigilant and prepared. Use this time for training and equipment maintenance.
        </p>
      </CardContent>
    </Card>
  )
}
