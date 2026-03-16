import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Map UI crashed', error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <div className="p-6 text-red-300">Something went wrong while rendering the map UI.</div>;
    }
    return this.props.children;
  }
}
