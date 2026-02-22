import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', color: '#ff3333', background: 'white', height: '100vh', overflow: 'auto', fontFamily: 'monospace' }}>
                    <h1>Something went wrong.</h1>
                    <details open style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>Error Details (Auto-Expanded)</summary>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        <br />
                        <strong>Component Stack:</strong>
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}
