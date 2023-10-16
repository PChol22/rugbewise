export const Error = () => (
  <div className="flex flex-col items-center justify-center w-full h-full space-y-6">
    <h1 className="text-2xl font-bold text-center text-palette-primary">
      🙀 Oh no! We encountered an error! 🙀
    </h1>
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
      onClick={() => (window.location.href = '/')}
    >
      Go back to main page
    </button>
  </div>
);
