import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Save, Sparkles, Plus, Trash2 } from 'lucide-react';

export const EditProfileModal: React.FC = () => {
  const { currentUser, updateCurrentUserProfile, closeModal, showToast } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [classLevel, setClassLevel] = useState(currentUser.classLevel || 'Senior Grade 12');
  const [talents, setTalents] = useState<string[]>(currentUser.creatorTalents || []);
  const [newTalentInput, setNewTalentInput] = useState('');

  const handleAddTalent = () => {
    if (!newTalentInput.trim()) return;
    if (!talents.includes(newTalentInput.trim())) {
      setTalents([...talents, newTalentInput.trim()]);
    }
    setNewTalentInput('');
  };

  const handleRemoveTalent = (t: string) => {
    setTalents(talents.filter((item) => item !== t));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({
      name: name.trim(),
      bio: bio.trim(),
      classLevel: classLevel.trim(),
      creatorTalents: talents
    });
    showToast('Profile updated successfully!', 'success');
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 px-6 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-neutral-900">Edit Student Profile</h3>
          <button
            onClick={closeModal}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-bold text-neutral-700 block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Class / Grade Level</label>
            <input
              type="text"
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
              placeholder="e.g., Senior Secondary 3 / Year 12"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="font-bold text-neutral-700 block mb-1">
              Creator Talents & Passions
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {talents.map((t) => (
                <span
                  key={t}
                  className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                >
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTalent(t)}
                    className="text-blue-600 hover:text-rose-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTalentInput}
                onChange={(e) => setNewTalentInput(e.target.value)}
                placeholder="Add talent (e.g., Robotics, Photography)..."
                className="flex-1 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl outline-none"
              />
              <button
                type="button"
                onClick={handleAddTalent}
                className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-xl"
              >
                Add
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl text-neutral-600 hover:bg-neutral-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-xs"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
