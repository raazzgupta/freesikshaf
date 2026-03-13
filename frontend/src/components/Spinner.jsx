export default function Spinner({ fullScreen = false }) {
  const wrapper = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-dark-900/80'
    : 'flex items-center justify-center py-12';
  return (
    <div className={wrapper}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-dark-600 border-t-brand-500 animate-spin" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-b-purple-500 animate-spin animation-delay-150" />
      </div>
    </div>
  );
}
