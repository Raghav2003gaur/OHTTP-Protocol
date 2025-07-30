"use client"

import { useState } from "react"
import type { RequestConfig, RelayInfo, ResponseData, SecurityInfo, DeveloperInfo } from "@/lib/types"
import RequestPanel from "@/components/request-panel"
import RelayPath from "@/components/relay-path"
import ResponseSection from "@/components/response-section"
import SecurityInfoSection from "@/components/security-info"
import DeveloperConsole from "@/components/developer-console"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [relays, setRelays] = useState<RelayInfo[]>([])
  const [response, setResponse] = useState<ResponseData | null>(null)
  const [securityInfo, setSecurityInfo] = useState<SecurityInfo | null>(null)
  const [developerInfo, setDeveloperInfo] = useState<DeveloperInfo | null>(null)

  const generateMockRelays = (count: number): RelayInfo[] => {
    const relayNames = ["US-East-1", "EU-West-1", "Asia-Pacific-1"]
    return Array.from({ length: count }, (_, index) => ({
      id: `relay-${index + 1}`,
      name: `Relay ${index + 1} (${relayNames[index % relayNames.length]})`,
      rtt: 0,
      status: "idle" as const,
    }))
  }

  const simulateRequest = async (config: RequestConfig) => {
    setIsLoading(true)
    setResponse(null)
    setSecurityInfo(null)
    setDeveloperInfo(null)

    // Generate relays based on config
    const mockRelays = generateMockRelays(config.relayCount)
    setRelays(mockRelays)

    try {
      // Simulate relay processing
      for (let i = 0; i < mockRelays.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400))

        setRelays((prev) =>
          prev.map((relay, index) => ({
            ...relay,
            status: index === i ? "active" : index < i ? "complete" : "idle",
            rtt: index === i ? Math.floor(50 + Math.random() * 200) : relay.rtt,
          })),
        )
      }

      // Final completion
      await new Promise((resolve) => setTimeout(resolve, 500))
      setRelays((prev) => prev.map((relay) => ({ ...relay, status: "complete" })))

      // Simulate actual HTTP request
      const actualResponse = await fetch(config.url)
      const responseText = await actualResponse.text()

      // Set response data
      const responseData: ResponseData = {
        status: actualResponse.status,
        headers: Object.fromEntries(actualResponse.headers.entries()),
        body: responseText,
        contentType: actualResponse.headers.get("content-type") || "text/plain",
      }
      setResponse(responseData)

      // Set security info
      const mockSecurityInfo: SecurityInfo = {
        nonce: Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
        timestamp: new Date().toISOString(),
        replayProtection: Math.random() > 0.1 ? "success" : "warning",
        tokenBinding: config.enableTokenBinding,
      }
      setSecurityInfo(mockSecurityInfo)

      // Set developer info
      const mockDeveloperInfo: DeveloperInfo = {
        rawPayloads: {
          request: JSON.stringify(
            {
              method: "GET",
              url: config.url,
              headers: { "User-Agent": "ObliviousHTTP/1.0" },
            },
            null,
            2,
          ),
          encrypted: Array.from({ length: 256 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
          relayDecisions: mockRelays.map((_, index) =>
            JSON.stringify(
              {
                relayId: index + 1,
                decision: "forward",
                encryptionLayer: `layer-${index + 1}`,
                timestamp: new Date(Date.now() - (mockRelays.length - index) * 1000).toISOString(),
              },
              null,
              2,
            ),
          ),
        },
        timing: {
          totalTime: mockRelays.reduce((sum, relay) => sum + relay.rtt, 0) + Math.floor(Math.random() * 100),
          relayTimes: mockRelays.map((relay) => relay.rtt),
        },
      }
      setDeveloperInfo(mockDeveloperInfo)
    } catch (error) {
      console.error("Request failed:", error)
      setRelays((prev) => prev.map((relay) => ({ ...relay, status: "error" })))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Oblivious HTTP Privacy Tester</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Test HTTP requests through privacy-preserving relay networks with end-to-end encryption
          </p>
        </div>

        {/* Request Panel */}
        <RequestPanel onSendRequest={simulateRequest} isLoading={isLoading} />

        {/* Relay Path Visualization */}
        <RelayPath relays={relays} isActive={isLoading} />

        {/* Response and Security Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponseSection response={response} isLoading={isLoading} />
          <SecurityInfoSection securityInfo={securityInfo} />
        </div>

        {/* Developer Console */}
        <DeveloperConsole developerInfo={developerInfo} />
      </div>
    </div>
  )
}
