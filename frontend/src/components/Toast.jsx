"use client";

export default function Toast({ message, type = "success", onClose }) {
  if (!message) return null;

  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    loading: "bg-blue-600",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3
        rounded-lg text-white shadow-lg ${colors[type]}`}
    >
      {type === "loading" && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      <span className="text-sm font-medium">{message}</span>
      {onClose && type !== "loading" && (
        <button onClick={onClose} className="ml-2 text-white/70 hover:text-white">
          ✕
        </button>
      )}
    </div>
  );
}
