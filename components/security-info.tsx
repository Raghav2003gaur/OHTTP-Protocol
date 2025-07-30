"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock, Key, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import type { SecurityInfo } from "@/lib/types"

interface SecurityInfoProps {
  securityInfo: SecurityInfo | null
}

export default function SecurityInfoSection({ securityInfo }: SecurityInfoProps) {
  const getReplayProtectionIcon = (status: SecurityInfo["replayProtection"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "error":
        return <XCircle className="h-4 w-4" />
    }
  }

  const getReplayProtectionColor = (status: SecurityInfo["replayProtection"]) => {
    switch (status) {
      case "success":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
    }
  }

  if (!securityInfo) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <div className="text-center space-y-2">
              <Shield className="h-8 w-8 mx-auto" />
              <p className="text-sm">Security info will appear after request</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nonce */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <span className="font-medium text-sm">Nonce</span>
            </div>
            <div className="bg-muted rounded-md p-3 font-mono text-xs break-all">{securityInfo.nonce}</div>
          </div>

          {/* Timestamp */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="font-medium text-sm">Timestamp</span>
            </div>
            <div className="bg-muted rounded-md p-3 font-mono text-xs">{securityInfo.timestamp}</div>
          </div>
        </div>

        {/* Security Features */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Security Features</h4>
          <div className="flex flex-wrap gap-2">
            <Badge className={`${getReplayProtectionColor(securityInfo.replayProtection)} text-white`}>
              {getReplayProtectionIcon(securityInfo.replayProtection)}
              <span className="ml-1">Replay Protection: {securityInfo.replayProtection.toUpperCase()}</span>
            </Badge>

            <Badge variant={securityInfo.tokenBinding ? "default" : "secondary"}>
              <Key className="h-3 w-3 mr-1" />
              Token Binding: {securityInfo.tokenBinding ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
