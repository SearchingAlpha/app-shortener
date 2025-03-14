export default function PageLoading() {
    return (
      <div className="w-full flex flex-col items-center justify-center py-12">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-600"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-600" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-blue-600" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p className="text-sm text-gray-500 mt-4">Loading content transformer...</p>
      </div>
    );
  }