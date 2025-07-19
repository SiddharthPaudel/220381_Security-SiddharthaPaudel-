const Unauthorized = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-[#121212] text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">403 Forbidden</h1>
        <p className="text-lg text-gray-300">You do not have permission to access this page.</p>
      </div>
    </div>
  );
};

export default Unauthorized;
