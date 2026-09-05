import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { ShoppingBag, Search, Plus, Tag, BookOpen, Package, MessageSquare, Heart, Filter, MapPin, Clock, Star, X, Send } from "lucide-react";

interface MarketItem {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerSchool: string;
  title: string;
  description: string;
  price: number;
  category: "Textbooks" | "Notes" | "Electronics" | "Uniforms" | "Dorm" | "Other";
  condition: "New" | "Like New" | "Good" | "Fair";
  images: string[];
  isWishlisted: boolean;
  createdAt: string;
  location: string;
}

const SAMPLE_ITEMS: MarketItem[] = [
  {
    id: "item-1", sellerId: "demo-student-1", sellerName: "Kwame Mensah", sellerAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
    sellerSchool: "Achimota Senior High", title: "Elrod & Martin \"Human Anatomy\" Textbook (7th Ed.)", description: "Used for only one semester. In great condition. Perfect for Biology and Medical students.", price: 45, category: "Textbooks", condition: "Like New", images: ["https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&auto=format&fit=crop&q=80"], isWishlisted: false, createdAt: "2 days ago", location: "Achimota, Accra"
  },
  {
    id: "item-2", sellerId: "demo-teacher-1", sellerName: "Dr. Evelyn Addo", sellerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    sellerSchool: "PRESEC", title: "WAEC Past Questions Bundle (2018-2024) - Math & Science", description: "Complete set of WAEC past questions with worked solutions. Boosted my students scores by 30%!", price: 20, category: "Notes", condition: "Good", images: ["https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&auto=format&fit=crop&q=80"], isWishlisted: true, createdAt: "5 hours ago", location: "Legon, Accra"
  },
  {
    id: "item-3", sellerId: "super-admin-1", sellerName: "Alex Owusu", sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    sellerSchool: "University of Ghana", title: "Scientific Calculator (Casio FX-991EX)", description: "Top-of-the-line scientific calculator. Works perfectly. Selling because I graduated.", price: 35, category: "Electronics", condition: "Like New", images: ["https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&auto=format&fit=crop&q=80"], isWishlisted: false, createdAt: "1 week ago", location: "Legon, Accra"
  },
  {
    id: "item-4", sellerId: "demo-student-1", sellerName: "Kwame Mensah", sellerAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
    sellerSchool: "Achimota Senior High", title: "Achimota School Uniform Set (Size M)", description: "Full uniform set — shirt, trousers, tie. Outgrown it. Excellent condition.", price: 30, category: "Uniforms", condition: "Good", images: ["https://images.unsplash.com/photo-1619533395265-63f74b5c83b0?w=400&auto=format&fit=crop&q=80"], isWishlisted: false, createdAt: "3 days ago", location: "Achimota, Accra"
  },
  {
    id: "item-5", sellerId: "demo-teacher-1", sellerName: "James Darko", sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    sellerSchool: "University of Ghana", title: "Mini USB Desk Fan + LED Lamp Combo", description: "Perfect dorm setup! USB-powered fan and multi-colour LED lamp. Barely used.", price: 22, category: "Dorm", condition: "Like New", images: ["https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?w=400&auto=format&fit=crop&q=80"], isWishlisted: false, createdAt: "2 weeks ago", location: "East Legon"
  },
  {
    id: "item-6", sellerId: "super-admin-1", sellerName: "Ama Boateng", sellerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
    sellerSchool: "PRESEC", title: "Handwritten Maths Olympiad Notes (Sets 1-5)", description: "My handwritten prep notes that helped me win the regional Maths Olympiad. Organized by topic.", price: 15, category: "Notes", condition: "Good", images: ["https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&auto=format&fit=crop&q=80"], isWishlisted: true, createdAt: "4 days ago", location: "Legon, Accra"
  }
];

const CATEGORIES = ["All", "Textbooks", "Notes", "Electronics", "Uniforms", "Dorm", "Other"];
const CONDITION_COLORS: Record<string, string> = {
  "New": "bg-emerald-100 text-emerald-700",
  "Like New": "bg-blue-100 text-blue-700",
  "Good": "bg-amber-100 text-amber-700",
  "Fair": "bg-neutral-100 text-neutral-600",
};

export const MarketplaceView: React.FC = () => {
  const { currentUser, showToast } = useApp();
  const [items, setItems] = useState<MarketItem[]>(SAMPLE_ITEMS);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [showSell, setShowSell] = useState(false);
  const [contactMsg, setContactMsg] = useState("");

  // Sell form
  const [sellTitle, setSellTitle] = useState("");
  const [sellDesc, setSellDesc] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [sellCategory, setSellCategory] = useState<MarketItem["category"]>("Textbooks");
  const [sellCondition, setSellCondition] = useState<MarketItem["condition"]>("Good");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.sellerSchool.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, selectedCategory]);

  const toggleWishlist = (itemId: string) => {
    setItems((prev) => prev.map((it) => it.id === itemId ? { ...it, isWishlisted: !it.isWishlisted } : it));
    showToast("Added to wishlist!", "success");
  };

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMsg.trim()) return;
    showToast(`Message sent to ${selectedItem?.sellerName}! ??`, "success");
    setContactMsg("");
  };

  const handleSell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellTitle.trim() || !sellPrice) return;
    const newItem: MarketItem = {
      id: `item-${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar,
      sellerSchool: currentUser.schoolName,
      title: sellTitle.trim(),
      description: sellDesc.trim(),
      price: parseFloat(sellPrice),
      category: sellCategory,
      condition: sellCondition,
      images: ["https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&auto=format&fit=crop&q=80"],
      isWishlisted: false,
      createdAt: "Just now",
      location: currentUser.schoolName,
    };
    setItems((prev) => [newItem, ...prev]);
    setShowSell(false);
    setSellTitle(""); setSellDesc(""); setSellPrice("");
    showToast("Your item is now listed on the Marketplace! ??", "success");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-black text-xl tracking-tight">Campus Marketplace</h1>
                <p className="text-white/80 text-xs">Buy, sell & swap textbooks, notes, gear & more</p>
              </div>
            </div>
            <button onClick={() => setShowSell(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 rounded-xl font-black text-xs hover:bg-orange-50 transition-all shadow-lg">
              <Plus className="w-3.5 h-3.5" /> Sell an Item
            </button>
          </div>

          {/* Search bar */}
          <div className="mt-4 flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2.5 border border-white/30">
              <Search className="w-4 h-4 text-white/70 flex-shrink-0" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search textbooks, notes, electronics..."
                className="flex-1 bg-transparent text-xs text-white placeholder-white/60 outline-none" />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-3 flex gap-4">
            <div className="text-center">
              <p className="text-lg font-black">{items.length}</p>
              <p className="text-[10px] text-white/70 font-medium">Listings</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-black">{items.filter(i => i.category === "Textbooks").length}</p>
              <p className="text-[10px] text-white/70 font-medium">Textbooks</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-black">{items.filter(i => i.isWishlisted).length}</p>
              <p className="text-[10px] text-white/70 font-medium">Wishlisted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              selectedCategory === cat
                ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20"
                : "bg-white text-neutral-600 border-neutral-200 hover:border-orange-300"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
            onClick={() => setSelectedItem(item)}>
            {/* Image */}
            <div className="relative h-44 overflow-hidden bg-neutral-100">
              <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&auto=format&fit=crop&q=80"; }} />
              <div className="absolute top-2 left-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CONDITION_COLORS[item.condition]}`}>{item.condition}</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); toggleWishlist(item.id); }}
                className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-all ${item.isWishlisted ? "bg-red-500 text-white" : "bg-white text-neutral-400 hover:text-red-500"}`}>
                <Heart className="w-3.5 h-3.5" fill={item.isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Info */}
            <div className="p-3">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-bold text-xs text-neutral-900 line-clamp-2 leading-snug flex-1">{item.title}</h3>
                <p className="text-base font-black text-orange-600 shrink-0">?{item.price}</p>
              </div>
              <span className="inline-block text-[9px] font-bold uppercase tracking-wider bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full mb-2">{item.category}</span>
              <p className="text-[11px] text-neutral-500 line-clamp-2 mb-2">{item.description}</p>
              <div className="flex items-center gap-1.5">
                <img src={item.sellerAvatar} alt={item.sellerName} className="w-5 h-5 rounded-full object-cover border border-neutral-200" />
                <span className="text-[10px] text-neutral-500 truncate">{item.sellerName}</span>
                <span className="text-neutral-300">•</span>
                <span className="text-[10px] text-neutral-400 truncate">{item.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="font-bold text-neutral-500">No items found</p>
          <p className="text-xs text-neutral-400 mt-1">Try a different search or category</p>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="relative h-56">
              <img src={selectedItem.images[0]} alt={selectedItem.title} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedItem(null)} className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${CONDITION_COLORS[selectedItem.condition]}`}>{selectedItem.condition}</span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="font-black text-lg text-neutral-900 leading-tight">{selectedItem.title}</h2>
                <p className="text-2xl font-black text-orange-600 shrink-0">?{selectedItem.price}</p>
              </div>
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full mb-3">{selectedItem.category}</span>
              <p className="text-sm text-neutral-600 leading-relaxed mb-4">{selectedItem.description}</p>
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-neutral-100">
                <img src={selectedItem.sellerAvatar} alt={selectedItem.sellerName} className="w-9 h-9 rounded-full object-cover border border-neutral-200" />
                <div>
                  <p className="text-xs font-bold text-neutral-900">{selectedItem.sellerName}</p>
                  <p className="text-[10px] text-blue-600">{selectedItem.sellerSchool}</p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-[10px] text-neutral-400">
                  <MapPin className="w-3 h-3" /> {selectedItem.location}
                </div>
              </div>
              <form onSubmit={handleContact}>
                <div className="flex gap-2">
                  <input value={contactMsg} onChange={(e) => setContactMsg(e.target.value)}
                    placeholder={`Hi ${selectedItem.sellerName.split(" ")[0]}, is this still available?`}
                    className="flex-1 text-xs bg-neutral-100 px-3 py-2.5 rounded-xl border border-neutral-200 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200" />
                  <button type="submit" disabled={!contactMsg.trim()}
                    className="px-4 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-xs hover:bg-orange-600 disabled:opacity-40 transition-all flex items-center gap-1">
                    <Send className="w-3.5 h-3.5" /> Contact
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {showSell && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSell(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-black text-lg text-neutral-900">List an Item for Sale</h2>
                <button onClick={() => setShowSell(false)} className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleSell} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">Item Title *</label>
                  <input value={sellTitle} onChange={(e) => setSellTitle(e.target.value)} required
                    placeholder="e.g. Core Mathematics Textbook (Grade 11)" maxLength={80}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">Description</label>
                  <textarea value={sellDesc} onChange={(e) => setSellDesc(e.target.value)} rows={3}
                    placeholder="Describe the item, its condition, and why you're selling..." maxLength={300}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 outline-none focus:border-orange-400 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">Price (GH?) *</label>
                    <input value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} type="number" min="1" required
                      placeholder="0.00" className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 outline-none focus:border-orange-400" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">Condition</label>
                    <select value={sellCondition} onChange={(e) => setSellCondition(e.target.value as MarketItem["condition"])}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 outline-none focus:border-orange-400">
                      {["New", "Like New", "Good", "Fair"].map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">Category</label>
                  <select value={sellCategory} onChange={(e) => setSellCategory(e.target.value as MarketItem["category"])}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 outline-none focus:border-orange-400">
                    {["Textbooks", "Notes", "Electronics", "Uniforms", "Dorm", "Other"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <button type="submit"
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm rounded-xl hover:brightness-110 transition-all shadow-lg shadow-orange-500/20">
                  ?? List Item for Sale
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
