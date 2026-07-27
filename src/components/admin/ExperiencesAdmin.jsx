import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import ImageUpload from "./ImageUpload";
import { useToast } from "@/components/ui/use-toast";

const TRAINING_TYPES = [
  "Entrenamiento personalizado",
  "Entrenamiento grupal de fútbol",
  "Plan de entrenamiento con seguimiento",
];

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#121212] mb-1.5">{label}</label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-lg border border-black/10 bg-white text-sm text-[#121212] focus:outline-none focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-colors"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3 }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#121212] mb-1.5">{label}</label>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3.5 py-2.5 rounded-lg border border-black/10 bg-white text-sm text-[#121212] focus:outline-none focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-colors resize-y"
      />
    </div>
  );
}

export default function ExperiencesAdmin() {
  const [items, setItems] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    base44.entities.Experience.list("order", 50).then((data) => setItems(data || []));
  }, []);

  const update = (id, field, value) => {
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const save = async (item) => {
    setSavingId(item.id);
    try {
      await base44.entities.Experience.update(item.id, {
        image: item.image,
        name: item.name,
        trainingType: item.trainingType,
        testimonial: item.testimonial,
        goal: item.goal,
        result: item.result,
        focalPointX: item.focalPointX ?? 0.5,
        focalPointY: item.focalPointY ?? 0.5,
        order: item.order,
      });
      toast({ title: "Cambios guardados" });
    } catch (e) {
      toast({ title: "Error al guardar", variant: "destructive" });
    } finally {
      setSavingId(null);
    }
  };

  const add = async () => {
    try {
      const newItem = await base44.entities.Experience.create({
        image: "",
        name: "",
        trainingType: "",
        testimonial: "",
        goal: "",
        result: "",
        focalPointX: 0.5,
        focalPointY: 0.5,
        order: items?.length || 0,
      });
      setItems((prev) => [...(prev || []), newItem]);
      toast({ title: "Experiencia creada" });
    } catch (e) {
      toast({ title: "Error al crear", variant: "destructive" });
    }
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar esta experiencia?")) return;
    try {
      await base44.entities.Experience.delete(id);
      setItems((prev) => prev.filter((m) => m.id !== id));
      toast({ title: "Experiencia eliminada" });
    } catch (e) {
      toast({ title: "Error al eliminar", variant: "destructive" });
    }
  };

  if (!items) return <Loader2 className="animate-spin text-[#FF6600]" />;

  return (
    <div className="space-y-5">
      {items.map((item, i) => (
        <div key={item.id} className="bg-white rounded-2xl border border-black/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#121212]/40 uppercase tracking-wider">
              Experiencia {i + 1}
            </span>
            <button
              onClick={() => remove(item.id)}
              className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <ImageUpload
            label="Fotografía"
            value={item.image}
            onChange={(v) => update(item.id, "image", v)}
            aspect="aspect-[4/5]"
          />

          <Field
            label="Nombre o primer nombre"
            value={item.name}
            onChange={(v) => update(item.id, "name", v)}
            placeholder="Ej: Juan (usar solo primer nombre para menores)"
          />

          <div>
            <label className="block text-sm font-medium text-[#121212] mb-1.5">
              Tipo de entrenamiento
            </label>
            <select
              value={item.trainingType || ""}
              onChange={(e) => update(item.id, "trainingType", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-black/10 bg-white text-sm text-[#121212] focus:outline-none focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-colors"
            >
              <option value="">Sin tipo</option>
              {TRAINING_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <TextArea
            label="Testimonio breve"
            value={item.testimonial}
            onChange={(v) => update(item.id, "testimonial", v)}
            rows={3}
          />
          <Field
            label="Objetivo trabajado"
            value={item.goal}
            onChange={(v) => update(item.id, "goal", v)}
          />
          <Field
            label="Resultado obtenido (solo si hay información real)"
            value={item.result}
            onChange={(v) => update(item.id, "result", v)}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#121212] mb-1.5">
                Punto focal X
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={item.focalPointX ?? 0.5}
                onChange={(e) => update(item.id, "focalPointX", parseFloat(e.target.value))}
                className="w-full accent-[#FF6600]"
              />
              <span className="text-xs text-[#121212]/50">
                {(item.focalPointX ?? 0.5).toFixed(2)}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#121212] mb-1.5">
                Punto focal Y
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={item.focalPointY ?? 0.5}
                onChange={(e) => update(item.id, "focalPointY", parseFloat(e.target.value))}
                className="w-full accent-[#FF6600]"
              />
              <span className="text-xs text-[#121212]/50">
                {(item.focalPointY ?? 0.5).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => save(item)}
              disabled={savingId === item.id}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#121212] text-white text-sm font-semibold rounded-lg hover:bg-[#FF6600] transition-colors disabled:opacity-50"
            >
              {savingId === item.id ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Guardar
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={add}
        className="w-full py-3.5 border-2 border-dashed border-black/15 rounded-2xl text-sm font-medium text-[#121212]/60 hover:border-[#FF6600] hover:text-[#FF6600] transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={18} />
        Agregar experiencia
      </button>
    </div>
  );
}