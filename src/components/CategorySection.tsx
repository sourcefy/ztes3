
const CategorySection = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="h-96 rounded-xl overflow-hidden shadow-2xl group">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
            alt="Hauptkategorie"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="h-44 rounded-xl overflow-hidden shadow-2xl group">
          <img 
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop"
            alt="Kategorie 1"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="h-44 rounded-xl overflow-hidden shadow-2xl group">
          <img 
            src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop"
            alt="Kategorie 2"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
