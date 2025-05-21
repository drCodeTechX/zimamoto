// import { Bell, Search } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import Link from "next/link"

// export function Header() {
//   return (
//     <header className="flex h-16 items-center px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="flex items-center gap-2 font-semibold">
//         <Link href="/" className="flex items-center gap-2">
//           <span className="text-red-600 text-2xl">🚒</span>
//           Fire Response System
//         </Link>
//       </div>
//       <nav className="ml-6 flex items-center space-x-4 lg:space-x-6">
//         <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
//           Dashboard
//         </Link>
//         <Link href="/metrics" className="text-sm font-medium transition-colors hover:text-primary">
//           Metrics
//         </Link>
//       </nav>
//       <div className="ml-auto flex items-center gap-4">
//         <Button variant="outline" size="icon">
//           <Search className="h-4 w-4" />
//         </Button>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" size="icon">
//               <Bell className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuItem>New emergency reported</DropdownMenuItem>
//             <DropdownMenuItem>Unit 7 responding</DropdownMenuItem>
//             <DropdownMenuItem>Situation contained</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//         <Button>Dispatch Unit</Button>
//       </div>
//     </header>
//   )
// }


import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function Header() {
  
  return (
    <header className="flex h-16 py-2 items-center px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 font-semibold">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-red-600 text-2xl">🚒</span>
          Zimamoto
        </Link>
      </div>
      <nav className="ml-6 flex items-center space-x-4 lg:space-x-6">
        <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
          Dashboard
        </Link>
        <Link href="/network" className="text-sm font-medium transition-colors hover:text-primary">
          Network
        </Link>
        <Link href="/metrics" className="text-sm font-medium transition-colors hover:text-primary">
          Metrics
        </Link>
      </nav>
      <div className="ml-auto flex items-center gap-4">
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>New emergency reported</DropdownMenuItem>
            <DropdownMenuItem>Unit 7 responding</DropdownMenuItem>
            <DropdownMenuItem>Situation contained</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button>Dispatch Unit</Button>
      </div>
    </header>
  )
}
