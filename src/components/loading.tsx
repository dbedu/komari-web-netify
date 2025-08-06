import "./Loading.css"

type LoadingProps = {
  text?: string;
  children?: React.ReactNode;
  size?: number
};

const Loading = ({ text, children, size }: LoadingProps) => {
  return (
    <div className="flex items-center justify-center flex-col min-h-[200px] p-8">
      {/* Clean Apple-style Loading Spinner - No Container */}
      <div className="relative mb-6">
        <div className="loader flex items-center justify-center">
          {/* Apple-style SVG spinner */}
          <svg 
            className="circular" 
            viewBox="25 25 50 50" 
            style={{ 
              width: `${size || 80}px`, 
              height: `${size || 80}px`,
              transform: `scale(${size ? size * 0.01 : 1})`,
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <circle
              className="path"
              cx="50"
              cy="50"
              r="20"
              fill="none"
              strokeWidth="2.5"
              strokeMiterlimit="10"
            />
          </svg>
        </div>
      </div>

      {/* Loading Text */}
      {text && (
        <div className="text-center space-y-4 max-w-md">
          <h3 className="text-lg font-medium bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
            {text}
          </h3>
        </div>
      )}

      {/* Children Content */}
      {children && (
        <div className="mt-8 w-full max-w-md">
          {children}
        </div>
      )}
    </div>
  );
};

export default Loading;
