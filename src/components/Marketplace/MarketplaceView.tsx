import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MarketItem } from '../../types';
import {
  ShoppingBag,
  Search,
  Plus,
  Heart,
  MapPin,
  X,
  Send,
  Trash2
} from 'lucide-react';

const CATEGORIES = ['All', 'Textbooks', 'Notes', 'Electronics', 'Uniforms', 'Dorm', 'Other'] as const;

const CONDITION_COLORS: Record<string, string> = {
  'New': 'bg-emerald-100 text-emerald-700',
  'Like New': 'bg-blue-100 text-blue-700',
  'Good': 'bg-amber-100 text-amber-700',
  'Fair': 'bg-neutral-100 text-neutral-600',
};

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  Textbooks: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80',
  Notes: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
  Electronics: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&auto=format&fit=crop&q=80',
  Uniforms: 'https://images.unsplash.com/photo-1619533395265-63f74b5c83b0?w=600&auto=format&fit=crop&q=80',
  Dorm: 'https://images.unsplash.com/photo-1518893494013-481c1d8ed3fd?w=600&auto=format&fit=crop&q=80',
  Other: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80'
};

export const MarketplaceView: React.FC = () => {
  const {
    currentUser,
    users,
    showToast,
    marketplaceItems,
    addMarketItem,
    deleteMarketItem,
    toggleWishlistMarketItem,
    startDirectMessage
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [showSell, setShowSell] = useState(false);
  const [contactMsg, setContactMsg] = useState('');

  // Sell form fields
  const [sellTitle, setSellTitle] = useState('');
  const [sellDesc, setSellDesc] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellCategory, setSellCategory] = useState<MarketItem['category']>('Textbooks');
  const [sellCondition, setSellCondition] = useState<MarketItem['condition']>('Good');
  const [sellImageUrl, setSellImageUrl] = useState('');

  const filteredItems = useMemo(() => {
    return marketplaceItems.filter((item) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.sellerSchool && item.sellerSchool.toLowerCase().includes(q));
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [marketplaceItems, search, selectedCategory]);

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    // Find seller user in user list or synthesize member profile
    const sellerUser = users.find((u) => u.id === selectedItem.sellerId) || {
      id: selectedItem.sellerId,
      name: selectedItem.sellerName,
      username: selectedItem.sellerName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      email: '',
      role: 'user' as const,
      userType: 'student' as const,
      avatar: selectedItem.sellerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedItem.sellerId}`,
      coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80',
      bio: `Student at ${selectedItem.sellerSchool}`,
      schoolId: '',
      schoolName: selectedItem.sellerSchool,
      classLevel: 'Student',
      interests: [],
      creatorTalents: [],
      badges: [],
      followersCount: 0,
      followingCount: 0,
      connectionsCount: 0,
      isVerified: false,
      isPrivate: false,
      allowDownloads: true,
      whoCanMessage: 'everyone' as const,
      whoCanConnect: 'everyone' as const
    };

    startDirectMessage(sellerUser);
    setSelectedItem(null);
    setContactMsg('');
    showToast(`Conversation started with ${selectedItem.sellerName}!`, 'success');
  };

  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellTitle.trim() || !sellPrice) return;

    const finalImage =
      sellImageUrl.trim() ||
      DEFAULT_CATEGORY_IMAGES[sellCategory] ||
      DEFAULT_CATEGORY_IMAGES.Other;

    await addMarketItem({
      title: sellTitle.trim(),
      description: sellDesc.trim(),
      price: parseFloat(sellPrice),
      category: sellCategory,
      condition: sellCondition,
      images: [finalImage],
      location: currentUser.schoolName || 'Campus Hub'
    });

    setShowSell(false);
    setSellTitle('');
    setSellDesc('');
    setSellPrice('');
    setSellImageUrl('');
  };

  const handleDeleteListing = async (itemId: string) => {
    if (confirm('Are you sure you want to remove this listing?')) {
      await deleteMarketItem(itemId);
      if (selectedItem?.id === itemId) {
        setSelectedItem(null);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl p-6 text-white relative overflow-hidden shadow-sm">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xs">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-black text-xl tracking-tight">Campus Marketplace</h1>
                <p className="text-white/80 text-xs">Buy, sell & swap verified textbooks, notes, gear & essentials</p>
              </div>
            </div>
            <button
              onClick={() => setShowSell(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 rounded-xl font-black text-xs hover:bg-orange-50 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List an Item</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="mt-4 flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2.5 border border-white/30">
              <Search className="w-4 h-4 text-white/70 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search textbooks, revision notes, calculators, dorm gear..."
                className="flex-1 bg-transparent text-xs text-white placeholder-white/70 outline-none"
              />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-3 flex gap-4">
            <div className="text-center">
              <p className="text-lg font-black">{marketplaceItems.length}</p>
              <p className="text-[10px] text-white/80 font-medium">Listings</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-black">
                {marketplaceItems.filter((i) => i.category === 'Textbooks').length}
              </p>
              <p className="text-[10px] text-white/80 font-medium">Textbooks</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-black">
                {marketplaceItems.filter((i) => i.isWishlisted).length}
              </p>
              <p className="text-[10px] text-white/80 font-medium">Wishlisted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              selectedCategory === cat
                ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-orange-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between"
            onClick={() => setSelectedItem(item)}
          >
            {/* Image */}
            <div className="relative h-44 overflow-hidden bg-neutral-100">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_CATEGORY_IMAGES[item.category] || DEFAULT_CATEGORY_IMAGES.Other;
                }}
              />
              <div className="absolute top-2 left-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CONDITION_COLORS[item.condition] || 'bg-neutral-100 text-neutral-600'}`}>
                  {item.condition}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlistMarketItem(item.id);
                }}
                className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-xs transition-all cursor-pointer ${
                  item.isWishlisted ? 'bg-rose-500 text-white' : 'bg-white text-neutral-400 hover:text-rose-500'
                }`}
                title={item.isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className="w-3.5 h-3.5" fill={item.isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Info */}
            <div className="p-3.5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-xs text-neutral-900 line-clamp-2 leading-snug flex-1">
                    {item.title}
                  </h3>
                  <p className="text-base font-black text-orange-600 shrink-0">
                    GH₵{item.price}
                  </p>
                </div>
                <span className="inline-block text-[9px] font-bold uppercase tracking-wider bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full mb-2">
                  {item.category}
                </span>
                <p className="text-[11px] text-neutral-500 line-clamp-2 mb-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <img
                    src={item.sellerAvatar}
                    alt={item.sellerName}
                    className="w-5 h-5 rounded-full object-cover border border-neutral-200 shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.sellerId}`;
                    }}
                  />
                  <span className="text-[10px] text-neutral-600 truncate font-medium">{item.sellerName}</span>
                </div>
                {item.sellerId === currentUser.id ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteListing(item.id);
                    }}
                    className="text-neutral-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                    title="Delete your listing"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    <span className="truncate max-w-[80px]">{item.location}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-sm text-neutral-900 mb-1">No items listed in this category yet</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
            Have textbooks, class notes, or campus supplies you no longer need? List them to help fellow students!
          </p>
          <button
            onClick={() => setShowSell(true)}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>List an Item Now</span>
          </button>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectedItem(null)} />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="relative h-56 bg-neutral-900">
              <img
                src={selectedItem.images[0]}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_CATEGORY_IMAGES[selectedItem.category] || DEFAULT_CATEGORY_IMAGES.Other;
                }}
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-3 left-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${CONDITION_COLORS[selectedItem.condition] || 'bg-white text-neutral-800'}`}>
                  {selectedItem.condition}
                </span>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="font-black text-lg text-neutral-900 leading-tight">{selectedItem.title}</h2>
                <p className="text-2xl font-black text-orange-600 shrink-0">GH₵{selectedItem.price}</p>
              </div>

              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full mb-3">
                {selectedItem.category}
              </span>

              <p className="text-xs text-neutral-600 leading-relaxed mb-4">{selectedItem.description}</p>

              {/* Seller Info Card */}
              <div className="flex items-center gap-3 mb-5 p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
                <img
                  src={selectedItem.sellerAvatar}
                  alt={selectedItem.sellerName}
                  className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                  onError={(e) => {
                    e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedItem.sellerId}`;
                  }}
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-neutral-900 truncate">{selectedItem.sellerName}</p>
                  <p className="text-[11px] text-blue-600 font-medium truncate">{selectedItem.sellerSchool}</p>
                </div>
                <div className="ml-auto flex items-center gap-1 text-[11px] text-neutral-400 shrink-0">
                  <MapPin className="w-3 h-3" />
                  <span>{selectedItem.location}</span>
                </div>
              </div>

              {/* Actions */}
              {selectedItem.sellerId === currentUser.id ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteListing(selectedItem.id)}
                    className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Listing</span>
                  </button>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContact} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      placeholder={`Hi ${selectedItem.sellerName.split(' ')[0]}, is this still available?`}
                      className="flex-1 text-xs bg-neutral-50 px-3.5 py-2.5 rounded-xl border border-neutral-200 outline-none focus:border-orange-400 focus:bg-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Message Seller</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-400 text-center">
                    Messaging will open a direct campus chat thread with the seller.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {showSell && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowSell(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-black text-lg text-neutral-900">List an Item for Sale</h2>
                  <p className="text-xs text-neutral-500">Sell textbooks, study guides, dorm gear, or electronics</p>
                </div>
                <button
                  onClick={() => setShowSell(false)}
                  className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 rounded-full flex items-center justify-center text-neutral-500 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSell} className="space-y-3.5">
                <div>
                  <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                    Item Title *
                  </label>
                  <input
                    value={sellTitle}
                    onChange={(e) => setSellTitle(e.target.value)}
                    required
                    placeholder="e.g. Elective Mathematics Textbook (SHS 3)"
                    maxLength={80}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 outline-none focus:border-orange-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                    Description
                  </label>
                  <textarea
                    value={sellDesc}
                    onChange={(e) => setSellDesc(e.target.value)}
                    rows={3}
                    placeholder="Describe the item condition, edition, or pickup details on campus..."
                    maxLength={300}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 outline-none focus:border-orange-400 focus:bg-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                      Price (GH₵) *
                    </label>
                    <input
                      value={sellPrice}
                      onChange={(e) => setSellPrice(e.target.value)}
                      type="number"
                      min="1"
                      step="0.5"
                      required
                      placeholder="0.00"
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 outline-none focus:border-orange-400 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                      Condition
                    </label>
                    <select
                      value={sellCondition}
                      onChange={(e) => setSellCondition(e.target.value as MarketItem['condition'])}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 outline-none focus:border-orange-400 focus:bg-white"
                    >
                      {['New', 'Like New', 'Good', 'Fair'].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                    Category
                  </label>
                  <select
                    value={sellCategory}
                    onChange={(e) => setSellCategory(e.target.value as MarketItem['category'])}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 outline-none focus:border-orange-400 focus:bg-white"
                  >
                    {['Textbooks', 'Notes', 'Electronics', 'Uniforms', 'Dorm', 'Other'].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
                    Photo URL (Optional)
                  </label>
                  <input
                    value={sellImageUrl}
                    onChange={(e) => setSellImageUrl(e.target.value)}
                    placeholder="Paste image web link or leave blank for category cover"
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 outline-none focus:border-orange-400 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:brightness-105 transition-all shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  List Item on Marketplace
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
