import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { ErrorState } from './ui/States'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Greenmart UI error:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <ErrorState
            title="The dashboard hit an unexpected error"
            description={this.state.message || 'Please refresh and try again.'}
            onRetry={this.handleReset}
          />
        </div>
      )
    }

    return this.props.children
  }
}
