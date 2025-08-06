import "./Loading.css"

type LoadingProps = {
  text?: string;
  children?: React.ReactNode;
  size?: number
};

const Loading = ({ text, children, size }: LoadingProps) => {

  return (
    <div className="flex items-center justify-center flex-col min-h-[200px] p-8">
      {/* Apple-style Loading Spinner */}
      <div className="relative mb-8">
        <div className="loader flex items-center justify-center">
          <svg 
            className="circular" 
            width="40" 
            height="40" 
            viewBox="25 25 50 50"
            style={{
              transform: `scale(${size ? size * 0.1 : 1})`,
              transition: "transform 0.3s ease-out",
            }}
          >
            <circle
              className="path"
              cx="50"
              cy="50"
              r="20"
              fill="none"
              strokeWidth="2"
              strokeMiterlimit="10"
            />
          </svg>
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2 max-w-md">
        <p className="text-base font-medium text-gray-600">
          Loading...
        </p>
        {text && (
          <p className="text-sm text-gray-500 leading-relaxed">
            {text}
          </p>
        )}
      </div>

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
