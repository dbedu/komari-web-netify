import "./Loading.css"
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type LoadingProps = {
  text?: string;
  children?: React.ReactNode;
  size?: number
};

const Loading = ({ text, children, size }: LoadingProps) => {
  const isMobile = useIsMobile();
  const [gifLoaded, setGifLoaded] = useState(false);
  const [gifError, setGifError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // On mobile, show fallback after 3 seconds if GIF hasn't loaded
    if (isMobile && !gifLoaded && !gifError) {
      const timer = setTimeout(() => {
        setShowFallback(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, gifLoaded, gifError]);

  const handleGifLoad = () => {
    setGifLoaded(true);
    setShowFallback(false);
  };

  const handleGifError = () => {
    setGifError(true);
    setShowFallback(true);
  };

  return (
    <div className="flex items-center justify-center flex-col min-h-[200px] p-8">
      {/* Loading Spinner Container */}
      <div className="relative mb-6">
        <div
          className="showbox backdrop-blur-sm bg-background/20 rounded-2xl p-6 shadow-lg border border-border/20"
          style={{
            transform: `scale(${size ? size * 0.1 : 0.6})`,
            transition: "transform 0.3s ease-out",
          }}
        >
          <div className="loader flex items-center justify-center">
            {/* Show GIF if loaded or loading, fallback SVG if needed */}
            {!showFallback ? (
              <img 
                src="/assets/BlueArchive-loading.gif" 
                alt="Loading..." 
                className="w-20 h-20 object-contain"
                style={{ 
                  maxWidth: "100%", 
                  height: "auto",
                  display: gifError ? 'none' : 'block'
                }}
                onLoad={handleGifLoad}
                onError={handleGifError}
                loading="eager"
              />
            ) : (
              // Fallback SVG spinner for mobile or when GIF fails
              <svg className="circular w-20 h-20" viewBox="25 25 50 50">
                <circle
                  className="path"
                  cx="50"
                  cy="50"
                  r="20"
                  fill="none"
                  strokeWidth="3"
                  strokeMiterlimit="10"
                />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-3 max-w-md">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
          Loading...
        </h3>
        {text && (
          <p className="text-sm text-muted-foreground/80 leading-relaxed">
            {text}
          </p>
        )}
      </div>

      {/* Children Content */}
      {children && (
        <div className="mt-6 w-full max-w-md">
          {children}
        </div>
      )}
    </div>
  );
};

export default Loading;
