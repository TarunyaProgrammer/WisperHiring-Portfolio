import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

export class ExperienceErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Portfolio experience failed to load.", error, info);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
