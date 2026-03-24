import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0f0d] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#141210] border border-[rgba(196,168,80,0.2)] rounded-2xl p-8 md:p-12 shadow-[0_0_40px_rgba(196,168,80,0.05)] relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-red-500 opacity-[0.03] blur-[50px] pointer-events-none" />
            
            <div className="w-20 h-20 mx-auto bg-[#0a0f0d] border border-red-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
            
            <h1 className="font-serif text-3xl text-[#e8e4df] mb-4">
              Etwas ist schiefgelaufen.
            </h1>
            
            <p className="font-sans text-[#a8b0c5] mb-8 text-sm leading-relaxed">
              Ein unerwarteter Fehler ist aufgetreten. Wir haben das Problem protokolliert und werden uns darum kümmern.
            </p>
            
            <button 
              onClick={this.handleReload}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#c4a850] text-[#0a0f0d] font-sans font-bold rounded-xl hover:brightness-110 transition-all shadow-[0_0_20px_rgba(196,168,80,0.2)]"
            >
              <RefreshCw size={18} />
              Seite neu laden
            </button>
            
            {import.meta.env.DEV && this.state.error && (
              <div className="mt-8 text-left bg-[#0a0f0d] p-4 rounded-lg border border-red-500/20 overflow-auto max-h-48">
                <p className="text-red-400 font-mono text-xs mb-2">{this.state.error.toString()}</p>
                <pre className="text-[#888888] font-mono text-[10px]">{this.state.errorInfo?.componentStack}</pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;