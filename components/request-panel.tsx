"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, Loader2 } from "lucide-react"
import type { RequestConfig } from "@/lib/types"

interface RequestPanelProps {
  onSendRequest: (config: RequestConfig) => void
  isLoading: boolean
}

export default function RequestPanel({ onSendRequest, isLoading }: RequestPanelProps) {
  const [config, setConfig] = useState<RequestConfig>({
    url: "https://httpbin.org/json",
    relayCount: 2,
    enableStreaming: false,
    enableTokenBinding: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSendRequest(config)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Request Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url">Target URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/api/endpoint"
              value={config.url}
              onChange={(e) => setConfig({ ...config, url: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relays">Number of Relays</Label>
            <Select
              value={config.relayCount.toString()}
              onValueChange={(value) => setConfig({ ...config, relayCount: Number.parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Relay</SelectItem>
                <SelectItem value="2">2 Relays</SelectItem>
                <SelectItem value="3">3 Relays</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="streaming"
                checked={config.enableStreaming}
                onCheckedChange={(checked) => setConfig({ ...config, enableStreaming: checked as boolean })}
              />
              <Label htmlFor="streaming">Enable Streaming</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="token-binding"
                checked={config.enableTokenBinding}
                onCheckedChange={(checked) => setConfig({ ...config, enableTokenBinding: checked as boolean })}
              />
              <Label htmlFor="token-binding">Enable Token Binding</Label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Anonymously...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Anonymously
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
