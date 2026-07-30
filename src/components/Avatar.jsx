export default function Avatar({ name = '?', size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const colors = [
    'from-pink-500 to-red-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-pink-500',
    'from-blue-500 to-purple-500',
    'from-green-500 to-teal-500',
    'from-yellow-500 to-orange-500',
  ];

  const colorIndex = name?.charCodeAt(0) % colors.length || 0;
  const gradient = colors[colorIndex];

  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 font-bold text-white uppercase ${className}`}
    >
      {name?.charAt(0) || '?'}
    </div>
  );
}
