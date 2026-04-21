import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback UI. Can be a ReactNode, or a render function receiving resetErrorBoundary. */
  fallback?: ReactNode | ((resetErrorBoundary: () => void) => ReactNode);
  /** Called when the user clicks the reset button. Use this to reset parent state
   *  (e.g. clear questionnaire answers) so the child tree re-renders with fresh props. */
  onReset?: () => void;
  /** Custom label for the reset button. Defaults to "Start Over" when onReset is set, "Try Again" otherwise. */
  resetLabel?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetErrorBoundary = (): void => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const fallback = this.props.fallback;
        return typeof fallback === 'function' ? fallback(this.resetErrorBoundary) : fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-[300px] p-6">
          <div className="bg-card border border-border rounded-xl shadow-sm max-w-md w-full p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Something went wrong
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {this.props.onReset
                ? `An unexpected error occurred. Click "${this.props.resetLabel ?? 'Start Over'}" to reset, or reload the page.`
                : 'An unexpected error occurred. Please try again or reload the page.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.resetErrorBoundary}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {this.props.resetLabel ?? (this.props.onReset ? 'Start Over' : 'Try Again')}
              </button>
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
