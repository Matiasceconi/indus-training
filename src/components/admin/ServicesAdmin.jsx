import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Save, Loader2, Star } from "lucide-react";
import ImageUpload from "./ImageUpload";
import { useToast } from "@/components/ui/use-toast";

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#121212] mb-1.5">{label}</label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-lg border border-black/10 bg-white text-sm text-[#121212] focus:outline-none focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-colors"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#121212] mb-1.5">{label}</label>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3.5 py-2.5 rounded-lg border border-black/10 bg-white text-sm text-[#121212] focus:outline-none focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-colors resize-y"
      />
    </div>
  );
}

export default function ServicesAdmin() {
  const [services, setServices] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const { toast } = useToast();

  const load = () => {
    base44.entities.Service.list("order", 50).then((data) => setServices(data || []));
  };

  useEffect(() => {
    load();
  }, []);

  const update = (id, field, value) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const save = async (service) => {
    setSavingId(service.id);
    try {
      await base44.entities.Service.update(service.id, {
        title: service.title,
        description: service.description,
        features: service.features,
        price: service.price,
        priceUnit: service.priceUnit,
        priceNote: service.priceNote,
        cta: service.cta,
        whatsappMessage: service.whatsappMessage,
        image: service.image,
        video: service.video,
        order: service.order,
        featured: service.featured,
      });
      toast({ title: "Servicio guardado" });
    } catch (e) {
      toast({ title: "Error al guardar", variant: "destructive" });
    } finally {
      setSavingId(null);
    }
  };

  const add = async () => {
    try {
      const newService = await base44.entities.Service.create({
        title: "Nuevo servicio",
        description: "",
        features: [],
        price: "",
        priceUnit: "",
        priceNote: "",
        cta: "Consultar",
        whatsappMessage: "Hola INDUS TRAINING, quiero más información.",
        image: "",
        video: "",
        order: services?.length || 0,
        featured: false,
      });
      setServices((prev) => [...(prev || []), newService]);
      toast({ title: "Servicio creado" });
    } catch (e) {
      toast({ title: "Error al crear", variant: "destructive" });
    }
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar este servicio?")) return;
    try {
      await base44.entities.Service.delete(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast({ title: "Servicio eliminado" });
    } catch (e) {
      toast({ title: "Error al eliminar", variant: "destructive" });
    }
  };

  if (!services) return <Loader2 className="animate-spin text-[#FF6600]" />;

  return (
    <div className="space-y-5">
      {services.map((service, i) => (
        <div key={service.id} className="bg-white rounded-2xl border border-black/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#121212]/40 uppercase tracking-wider">
              Servicio {i + 1}
            </span>
            <button
              onClick={() => remove(service.id)}
              className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <ImageUpload
            label="Imagen del servicio"
            value={service.image}
            onChange={(v) => update(service.id, "image", v)}
            aspect="aspect-[16/10]"
          />

          <Field label="URL del video (opcional, reemplaza la imagen)" value={service.video} onChange={(v) => update(service.id, "video", v)} placeholder="https://..." />

          <Field label="Título" value={service.title} onChange={(v) => update(service.id, "title", v)} />
          <TextArea label="Descripción" value={service.description} onChange={(v) => update(service.id, "description", v)} />

          <div>
            <label className="block text-sm font-medium text-[#121212] mb-1.5">
              Características (una por línea)
            </label>
            <textarea
              value={(service.features || []).join("\n")}
              onChange={(e) => update(service.id, "features", e.target.value.split("\n").filter((f) => f.trim()))}
              rows={6}
              className="w-full px-3.5 py-2.5 rounded-lg border border-black/10 bg-white text-sm text-[#121212] focus:outline-none focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-colors resize-y"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Precio" value={service.price} onChange={(v) => update(service.id, "price", v)} placeholder="$35.000 ARS" />
            <Field label="Unidad del precio" value={service.priceUnit} onChange={(v) => update(service.id, "priceUnit", v)} placeholder="por clase" />
          </div>
          <Field label="Nota (si no tiene precio)" value={service.priceNote} onChange={(v) => update(service.id, "priceNote", v)} />
          <Field label="Texto del botón" value={service.cta} onChange={(v) => update(service.id, "cta", v)} />
          <TextArea label="Mensaje de WhatsApp" value={service.whatsappMessage} onChange={(v) => update(service.id, "whatsappMessage", v)} rows={2} />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <button
                type="button"
                onClick={() => update(service.id, "featured", !service.featured)}
                className={`w-9 h-5 rounded-full transition-colors relative ${service.featured ? "bg-[#FF6600]" : "bg-black/15"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${service.featured ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
              <span className="text-sm font-medium text-[#121212] flex items-center gap-1">
                <Star size={14} className="text-[#FF6600]" /> Destacado
              </span>
            </label>
            <button
              onClick={() => save(service)}
              disabled={savingId === service.id}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#121212] text-white text-sm font-semibold rounded-lg hover:bg-[#FF6600] transition-colors disabled:opacity-50"
            >
              {savingId === service.id ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
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
        Agregar servicio
      </button>
    </div>
  );
}