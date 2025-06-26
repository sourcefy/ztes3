
const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-white/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
