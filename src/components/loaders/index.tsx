function Loader() {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="border-t-4 border-blue-200 border-solid border-4 rounded-full animate-spin h-16 w-16">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default Loader;
