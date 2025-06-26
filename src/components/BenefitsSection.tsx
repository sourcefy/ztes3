
const BenefitsSection = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-md p-8 rounded-xl shadow-2xl">
        <div className="border-l-4 border-purple-500 pl-6 mb-6">
          <h3 className="text-2xl font-bold mb-4">Discord Community</h3>
          <p className="text-gray-300 mb-6">
            Trete unserer Discord Community bei und erhalte noch mehr Funktionen und exklusive Inhalte.
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Beitreten
          </button>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-md p-8 rounded-xl shadow-2xl">
        <div className="border-l-4 border-orange-500 pl-6 mb-6">
          <h3 className="text-2xl font-bold mb-4">Exklusive Rabatte</h3>
          <p className="text-gray-300 mb-6">
            Du bekommst immer die besten Rabatte auf unsere Premium-Produkte.
          </p>
          <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Mehr erfahren
          </button>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
