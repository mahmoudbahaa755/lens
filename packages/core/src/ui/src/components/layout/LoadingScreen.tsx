const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="relative">
        <div className="w-20 h-20 border-t-4 border-b-4 border-green-500 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-lg">
          LENS
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
