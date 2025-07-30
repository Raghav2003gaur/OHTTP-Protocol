"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Terminal, Clock, Layers } from "lucide-react"
import type { DeveloperInfo } from "@/lib/types"

interface DeveloperConsoleProps {
  developerInfo: DeveloperInfo | null
}

export default function DeveloperConsole({ developerInfo }: DeveloperConsoleProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!developerInfo) {
    return null
  }

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Developer Console
                <Badge variant="secondary" className="text-xs">
                  Advanced
                </Badge>
              </div>
              <Button variant="ghost" size="sm">
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Timing Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <h4 className="font-medium">Timing Analysis</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted rounded-md p-3">
                  <div className="text-sm font-medium mb-1">Total Request Time</div>
                  <div className="text-2xl font-mono">{developerInfo.timing.totalTime}ms</div>
                </div>
                <div className="bg-muted rounded-md p-3">
                  <div className="text-sm font-medium mb-1">Relay Times</div>
                  <div className="space-y-1">
                    {developerInfo.timing.relayTimes.map((time, index) => (
                      <div key={index} className="text-sm font-mono">
                        Relay {index + 1}: {time}ms
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Raw Payloads */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <h4 className="font-medium">Raw Payloads</h4>
              </div>

              <div className="space-y-4">
                {/* Original Request */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Original Request</h5>
                  <div className="bg-muted rounded-md p-3 text-xs font-mono overflow-x-auto">
                    <pre>{developerInfo.rawPayloads.request}</pre>
                  </div>
                </div>

                {/* Encrypted Payload */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Encrypted Payload</h5>
                  <div className="bg-muted rounded-md p-3 text-xs font-mono overflow-x-auto">
                    <pre className="break-all">{developerInfo.rawPayloads.encrypted}</pre>
                  </div>
                </div>

                {/* Relay Decisions */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Relay Decisions</h5>
                  <div className="space-y-2">
                    {developerInfo.rawPayloads.relayDecisions.map((decision, index) => (
                      <div key={index} className="bg-muted rounded-md p-3 text-xs font-mono">
                        <div className="font-medium mb-1">Relay {index + 1}:</div>
                        <pre>{decision}</pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
