"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, FileText, Code } from "lucide-react"
import type { ResponseData } from "@/lib/types"

interface ResponseSectionProps {
  response: ResponseData | null
  isLoading: boolean
}

export default function ResponseSection({ response, isLoading }: ResponseSectionProps) {
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-500"
    if (status >= 300 && status < 400) return "bg-yellow-500"
    if (status >= 400 && status < 500) return "bg-orange-500"
    if (status >= 500) return "bg-red-500"
    return "bg-gray-500"
  }

  const formatResponse = (body: string, contentType: string) => {
    try {
      if (contentType.includes("application/json")) {
        return JSON.stringify(JSON.parse(body), null, 2)
      }
    } catch {
      // If JSON parsing fails, return as-is
    }
    return body
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Response
          {response && <Badge className={getStatusColor(response.status)}>{response.status}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
              <p className="text-sm text-muted-foreground">Routing through privacy relays...</p>
            </div>
          </div>
        ) : response ? (
          <div className="space-y-4">
            {/* Headers */}
            {Object.keys(response.headers).length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Headers</h4>
                <div className="bg-muted rounded-md p-3 text-xs font-mono space-y-1">
                  {Object.entries(response.headers).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-blue-600 dark:text-blue-400">{key}:</span> <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Body */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm">Response Body</h4>
                <Badge variant="outline" className="text-xs">
                  {response.contentType}
                </Badge>
              </div>
              <div className="bg-muted rounded-md p-4 text-sm font-mono overflow-x-auto max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap">{formatResponse(response.body, response.contentType)}</pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <div className="text-center space-y-2">
              <Code className="h-8 w-8 mx-auto" />
              <p className="text-sm">No response yet</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
