"use client"

import { Component, type ReactNode, type ErrorInfo } from "react"
import { AlertTriangle, RotateCcw } from "lucide-react"

interface Props {
  children: ReactNode
  fallbackMessage?: string
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: "" }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-4 p-8 text-center">
          <AlertTriangle size={32} className="text-destructive" />
          <div>
            <p className="font-medium text-foreground">Something went wrong</p>
            <p className="text-sm text-muted-foreground mt-1">
              {this.props.fallbackMessage ?? this.state.message}
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, message: "" })}
            className="flex items-center gap-2 px-3 py-2 rounded bg-secondary text-sm text-foreground hover:bg-accent transition-colors"
          >
            <RotateCcw size={13} />
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
