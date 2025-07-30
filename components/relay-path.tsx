"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Monitor, Server, Globe } from "lucide-react"
import type { RelayInfo } from "@/lib/types"

interface RelayPathProps {
  relays: RelayInfo[]
  isActive: boolean
}

export default function RelayPath({ relays, isActive }: RelayPathProps) {
  const getStatusColor = (status: RelayInfo["status"]) => {
    switch (status) {
      case "active":
        return "bg-blue-500 animate-pulse"
      case "complete":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-300 dark:bg-gray-600"
    }
  }

  const getIcon = (index: number, total: number) => {
    if (index === 0) return <Monitor className="h-5 w-5" />
    if (index === total - 1) return <Globe className="h-5 w-5" />
    return <Server className="h-5 w-5" />
  }

  const allNodes = [
    { id: "client", name: "Client", rtt: 0, status: "complete" as const },
    ...relays,
    {
      id: "gateway",
      name: "Gateway",
      rtt: 0,
      status: relays.length > 0 ? relays[relays.length - 1].status : ("idle" as const),
    },
  ]

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            {allNodes.map((node, index) => (
              <div key={node.id} className="flex items-center space-x-4 flex-shrink-0">
                <div className="flex flex-col items-center space-y-2">
                  <div
                    className={`
                      relative p-4 rounded-lg border-2 transition-all duration-300 min-w-[120px]
                      ${
                        isActive && node.status === "active"
                          ? "border-blue-500 shadow-lg shadow-blue-500/25 scale-105"
                          : "border-gray-200 dark:border-gray-700"
                      }
                      ${node.status === "complete" ? "bg-green-50 dark:bg-green-900/20" : ""}
                      ${node.status === "error" ? "bg-red-50 dark:bg-red-900/20" : ""}
                    `}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex items-center space-x-2">
                        {getIcon(index, allNodes.length)}
                        <span className="font-medium text-sm">{node.name}</span>
                      </div>
                      {node.rtt > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {node.rtt}ms
                        </Badge>
                      )}
                    </div>

                    {/* Status indicator */}
                    <div
                      className={`
                        absolute -top-1 -right-1 w-3 h-3 rounded-full
                        ${getStatusColor(node.status)}
                      `}
                    />
                  </div>
                </div>

                {index < allNodes.length - 1 && (
                  <ArrowRight
                    className={`
                      h-5 w-5 text-gray-400 transition-colors duration-300
                      ${isActive ? "text-blue-500" : ""}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
