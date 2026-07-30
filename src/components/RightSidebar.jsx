import { Link } from 'react-router-dom';
import Avatar from './Avatar';

const SUGGESTIONS = [
  { name: 'fanus andrianto', subtitle: 'Followed by adaydwi + 12 m' },
  { name: 'Rizky Raphoksi', subtitle: 'Followed by rizalmp + 13 m' },
  { name: 'ronna', subtitle: 'Followed by adaydwi + 12 m' },
  { name: 'salsabilaa pw', subtitle: 'Followed by ekatahirapr + 7' },
  { name: 'dr. Christie', subtitle: 'Followed by sandradewi_ch' },
];

export default function RightSidebar({ user }) {
  if (!user) return null;

  const username = user.email ? user.email.split('@')[0] : user.name.toLowerCase().replace(/\s+/g, '');

  return (
    <aside className="hidden lg:block w-[320px] flex-shrink-0 pt-4 space-y-6">
      {/* Current User Card */}
      <div className="flex items-center justify-between">
        <Link to="/profile" className="flex items-center gap-3.5 group">
          <Avatar name={user.name} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors truncate">
              {username}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.name}</p>
          </div>
        </Link>
        <Link
          to="/profile"
          className="text-xs font-bold text-sky-400 hover:text-white transition-colors"
        >
          Switch
        </Link>
      </div>

      {/* Suggested Users Section */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400">
            Suggested for you
          </span>
          <button className="text-xs font-bold text-white hover:text-gray-400 transition-colors">
            See all
          </button>
        </div>

        <div className="space-y-3">
          {SUGGESTIONS.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={s.name} size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate hover:underline cursor-pointer">
                    {s.name}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">{s.subtitle}</p>
                </div>
              </div>
              <button className="text-xs font-bold text-sky-400 hover:text-white transition-colors flex-shrink-0 ml-2">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer info */}
      <div className="pt-4 space-y-4 border-t border-white/5">
        <p className="text-[11px] text-gray-600 leading-relaxed">
          About · Help · Press · API · Jobs · Privacy · Terms · Locations · Language · Meta Verified
        </p>
        <p className="text-[11px] text-gray-600 font-semibold tracking-wider uppercase">
          © 2026 INSTAGRAM FROM SEVIMA
        </p>
      </div>
    </aside>
  );
}
