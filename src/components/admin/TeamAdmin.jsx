import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import ImageUpload from "./ImageUpload";
import { useToast } from "@/components/ui/use-toast";

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

export default function TeamAdmin() {
  const [members, setMembers] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    base44.entities.TeamMember.list("order", 50).then((data) => setMembers(data || []));
  }, []);

  const update = (id, field, value) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const save = async (member) => {
    setSavingId(member.id);
    try {
      await base44.entities.TeamMember.update(member.id, {
        name: member.name,
        role: member.role,
        description: member.description,
        image: member.image,
        focalPointX: member.focalPointX ?? 0.5,
        focalPointY: member.focalPointY ?? 0.5,
        order: member.order,
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
      const newMember = await base44.entities.TeamMember.create({
        name: "Nuevo profesional",
        role: "",
        description: "",
        image: "",
        focalPointX: 0.5,
        focalPointY: 0.5,
        order: members?.length || 0,
      });
      setMembers((prev) => [...(prev || []), newMember]);
      toast({ title: "Miembro creado" });
    } catch (e) {
      toast({ title: "Error al crear", variant: "destructive" });
    }
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar este miembro del equipo?")) return;
    try {
      await base44.entities.TeamMember.delete(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast({ title: "Miembro eliminado" });
    } catch (e) {
      toast({ title: "Error al eliminar", variant: "destructive" });
    }
  };

  if (!members) return <Loader2 className="animate-spin text-[#FF6600]" />;

  return (
    <div className="space-y-5">
      {members.map((member, i) => (
        <div key={member.id} className="bg-white rounded-2xl border border-black/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#121212]/40 uppercase tracking-wider">
              Miembro {i + 1}
            </span>
            <button
              onClick={() => remove(member.id)}
              className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <ImageUpload
            label="Fotografía"
            value={member.image}
            onChange={(v) => update(member.id, "image", v)}
            aspect="aspect-[4/5]"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nombre" value={member.name} onChange={(v) => update(member.id, "name", v)} />
            <Field label="Cargo" value={member.role} onChange={(v) => update(member.id, "role", v)} />
          </div>
          <TextArea label="Descripción" value={member.description} onChange={(v) => update(member.id, "description", v)} />

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#121212] mb-1.5">
                Punto focal X (0 = izquierda, 1 = derecha)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={member.focalPointX ?? 0.5}
                onChange={(e) => update(member.id, "focalPointX", parseFloat(e.target.value))}
                className="w-full accent-[#FF6600]"
              />
              <span className="text-xs text-[#121212]/50">{(member.focalPointX ?? 0.5).toFixed(2)}</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#121212] mb-1.5">
                Punto focal Y (0 = arriba, 1 = abajo)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={member.focalPointY ?? 0.5}
                onChange={(e) => update(member.id, "focalPointY", parseFloat(e.target.value))}
                className="w-full accent-[#FF6600]"
              />
              <span className="text-xs text-[#121212]/50">{(member.focalPointY ?? 0.5).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => save(member)}
              disabled={savingId === member.id}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#121212] text-white text-sm font-semibold rounded-lg hover:bg-[#FF6600] transition-colors disabled:opacity-50"
            >
              {savingId === member.id ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
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
        Agregar miembro
      </button>
    </div>
  );
}