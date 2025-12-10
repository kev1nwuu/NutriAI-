import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NutritionModal({ isOpen, onClose, data }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6 relative rounded-2xl shadow-lg bg-white">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          Nutrition Information
        </h2>

        <div className="space-y-2">
          <InfoRow label="Name" value={data?.name || "—"} />
          <InfoRow label="Calories" value={`${data?.calories || "—"} kcal`} />
          <InfoRow label="Protein" value={data?.protein || "—"} />
          <InfoRow label="Fat" value={data?.fat || "—"} />
          <InfoRow label="Carbs" value={data?.carbs || "—"} />
          <InfoRow label="Fiber" value={data?.fiber || "—"} />
        </div>

        <div className="mt-6 text-center">
          <Button onClick={onClose} className="px-6">
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-1">
      <span className="font-medium text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}
