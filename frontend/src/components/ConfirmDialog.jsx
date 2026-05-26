"use client";

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[hsl(0,0%,0%)] backdrop-blur-sm">
      <div className="bg-[hsl(0,0%,100%)] rounded-xl p-6 shadow-xl max-w-sm w-full mx-4">
        <p className="text-[hsl(0,0%,30%)] text-base mb-5">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm text-[hsl(0,0%,30%)] border border-[hsl(0,0%,50%)] hover:bg-[hsl(0,0%,70%)]"> Cancelar </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm text-white bg-red-600 hover:bg-red-700"> Confirmar </button>
        </div>
      </div>
    </div>
  );
}
