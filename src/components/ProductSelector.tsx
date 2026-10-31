import React, { useState } from 'react';
import { PRODUCTS } from '../data/products';
import { ProductCategory, ProductConfig } from '../types/mockup';
import { Coffee, Shirt, ShoppingBag, BookOpen, Sparkles, Smartphone, Award, Compass, Disc } from 'lucide-react';

interface ProductSelectorProps {
  selectedProduct: ProductConfig;
  onSelectProduct: (product: ProductConfig) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  selectedProduct,
  onSelectProduct,
}) => {
  const [filter, setFilter] = useState<'all' | ProductCategory>('all');

  const filteredProducts = PRODUCTS.filter(
    (p) => filter === 'all' || p.category === filter
  );

  const getProductIcon = (id: string) => {
    switch (id) {
      case 'mug':
        return <Coffee className="w-5 h-5" />;
      case 'enamel-mug':
        return <Compass className="w-5 h-5" />;
      case 'tumbler':
        return <Award className="w-5 h-5" />;
      case 'tshirt':
      case 'hoodie':
        return <Shirt className="w-5 h-5" />;
      case 'tote':
        return <ShoppingBag className="w-5 h-5" />;
      case 'cap':
        return <Sparkles className="w-5 h-5" />;
      case 'notebook':
        return <BookOpen className="w-5 h-5" />;
      case 'phone-case':
        return <Smartphone className="w-5 h-5" />;
      case 'sticker':
        return <Disc className="w-5 h-5" />;
      default:
        return <Coffee className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      {/* Category filters */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 flex-wrap gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Select Product Mockup ({PRODUCTS.length})
        </h3>
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {(['all', 'drinkware', 'apparel', 'accessories', 'stationery'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-2.5 py-1 rounded-lg capitalize transition-colors font-medium whitespace-nowrap ${
                filter === cat
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product items scroll / grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 gap-2.5">
        {filteredProducts.map((prod) => {
          const isSelected = prod.id === selectedProduct.id;
          return (
            <button
              key={prod.id}
              onClick={() => onSelectProduct(prod)}
              className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer relative group ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 transition-transform group-hover:scale-105 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                }`}
              >
                {getProductIcon(prod.id)}
              </div>

              <div className="w-full">
                <span className="block text-xs font-bold text-slate-800 truncate" title={prod.name}>
                  {prod.name}
                </span>
                <span className="block text-[10px] text-slate-500 capitalize">
                  {prod.category}
                </span>
              </div>

              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
