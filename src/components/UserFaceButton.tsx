export default function UserFaceButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      aria-label="Open assistant face"
      onClick={onClick}
      className="fixed bottom-4 left-4 z-[60] rounded-full w-12 h-12 bg-black/50 border border-white/15 backdrop-blur-md hover:scale-105 active:scale-95 transition grid place-items-center"
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white/90" fill="currentColor" aria-hidden>
        <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4 0-7 2-7 4.5V21h14v-2.5C19 16 16 14 12 14Z" />
      </svg>
    </button>
  );
}
