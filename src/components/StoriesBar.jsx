const FAKE_STORIES = [
  { name: 'Alex', color: 'from-yellow-400 to-pink-500' },
  { name: 'Maya', color: 'from-pink-500 to-purple-600' },
  { name: 'Josh', color: 'from-orange-400 to-red-500' },
  { name: 'Sari', color: 'from-teal-400 to-blue-500' },
  { name: 'Reza', color: 'from-purple-500 to-indigo-600' },
  { name: 'Tina', color: 'from-green-400 to-cyan-500' },
  { name: 'Budi', color: 'from-yellow-500 to-orange-500' },
  { name: 'Lisa', color: 'from-pink-400 to-rose-500' },
];

export default function StoriesBar() {
  return (
    <div className="border border-[#262626] rounded-sm bg-[#000] py-4 px-2 mb-3">
      <div
        className="flex gap-5 overflow-x-auto"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Your story */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
          <div className="relative w-[62px] h-[62px]">
            <div className="w-full h-full rounded-full bg-[#1a1a1a] border-2 border-dashed border-[#555] flex items-center justify-center group-hover:border-white/40 transition-colors">
              <span className="text-3xl font-black text-gray-500 group-hover:text-gray-300 leading-none">+</span>
            </div>
          </div>
          <span className="text-[11px] text-gray-400 w-16 text-center truncate">Your story</span>
        </div>

        {/* Friend stories */}
        {FAKE_STORIES.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
            <div className={`p-[2px] rounded-full bg-gradient-to-bl ${s.color} group-hover:scale-105 transition-transform`}>
              <div className="bg-[#000] rounded-full p-[2px]">
                <div
                  className={`w-[58px] h-[58px] rounded-full bg-gradient-to-br ${s.color} flex items-center justify-center font-bold text-white text-lg`}
                >
                  {s.name.charAt(0)}
                </div>
              </div>
            </div>
            <span className="text-[11px] text-gray-300 w-16 text-center truncate">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
