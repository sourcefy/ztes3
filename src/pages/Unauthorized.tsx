const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gradient-to-br from-red-800 to-black">
      <h1 className="text-4xl font-bold mb-4">🚫 Zugriff verweigert</h1>
      <p className="text-lg">Du benötigst Administratorrechte, um diese Seite zu sehen.</p>
    </div>
  );
};

export default Unauthorized;
