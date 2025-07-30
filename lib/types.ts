export interface RelayInfo {
  id: string
  name: string
  rtt: number
  status: "idle" | "active" | "complete" | "error"
}

export interface SecurityInfo {
  nonce: string
  timestamp: string
  replayProtection: "success" | "warning" | "error"
  tokenBinding: boolean
}

export interface RequestConfig {
  url: string
  relayCount: number
  enableStreaming: boolean
  enableTokenBinding: boolean
}

export interface ResponseData {
  status: number
  headers: Record<string, string>
  body: string
  contentType: string
}

export interface DeveloperInfo {
  rawPayloads: {
    request: string
    encrypted: string
    relayDecisions: string[]
  }
  timing: {
    totalTime: number
    relayTimes: number[]
  }
}
