import "./Loading.css"

type LoadingProps = {
  text?: string;
  children?: React.ReactNode;
  size?: number
};

const Loading = ({ text, children, size }: LoadingProps) => {
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
            <img 
              src="/assets/BlueArchive-loading.gif" 
              alt="Loading..." 
              className="w-20 h-20 object-contain"
              style={{ maxWidth: "100%", height: "auto" }}
            />
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
