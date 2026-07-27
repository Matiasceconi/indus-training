import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Save, Loader2 } from "lucide-react";
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

export default function SiteContentEditor({ section }) {
  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    base44.entities.SiteContent.list().then((data) => {
      if (data && data.length > 0) {
        setContent(data[0]);
      } else {
        base44.entities.SiteContent.create({}).then((rec) => setContent(rec));
      }
    });
  }, []);

  const update = (field, value) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const { id, created_date, updated_date, created_by_id, created_by, ...fields } = content;
      await base44.entities.SiteContent.update(content.id, fields);
      toast({ title: "Cambios guardados correctamente" });
    } catch (e) {
      toast({ title: "Error al guardar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (!content) return <Loader2 className="animate-spin text-[#FF6600]" />;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-black/10 p-5 space-y-4">
        {section === "general" && (
          <>
            <ImageUpload
              label="Logo de INDUS TRAINING"
              value={content.logo}
              onChange={(v) => update("logo", v)}
              aspect="aspect-[3/1]"
            />
            <Field
              label="Número de WhatsApp (formato internacional sin +)"
              value={content.whatsappNumber}
              onChange={(v) => update("whatsappNumber", v)}
              placeholder="5491112345678"
            />
            <TextArea
              label="Mensaje por defecto de WhatsApp"
              value={content.whatsappMessage}
              onChange={(v) => update("whatsappMessage", v)}
              rows={2}
            />
            <Field
              label="URL de Instagram"
              value={content.instagramUrl}
              onChange={(v) => update("instagramUrl", v)}
              placeholder="https://instagram.com/indus.training"
            />
            <Field
              label="Handle de Instagram"
              value={content.instagramHandle}
              onChange={(v) => update("instagramHandle", v)}
              placeholder="@indus.training"
            />
          </>
        )}

        {section === "hero" && (
          <>
            <ImageUpload
              label="Imagen de portada"
              value={content.heroImage}
              onChange={(v) => update("heroImage", v)}
              aspect="aspect-[4/5]"
            />
            <Field
              label="Título principal"
              value={content.heroTitle}
              onChange={(v) => update("heroTitle", v)}
            />
            <TextArea
              label="Subtítulo"
              value={content.heroSubtitle}
              onChange={(v) => update("heroSubtitle", v)}
              rows={2}
            />
            <Field
              label="Ubicación"
              value={content.heroLocation}
              onChange={(v) => update("heroLocation", v)}
            />
          </>
        )}

        {section === "location" && (
          <>
            <Field
              label="Título de ubicación"
              value={content.locationTitle}
              onChange={(v) => update("locationTitle", v)}
            />
            <TextArea
              label="Dirección / Zona"
              value={content.locationAddress}
              onChange={(v) => update("locationAddress", v)}
              rows={2}
            />
            <TextArea
              label="Días y horarios"
              value={content.locationSchedule}
              onChange={(v) => update("locationSchedule", v)}
              rows={2}
            />
            <TextArea
              label="Modalidades disponibles"
              value={content.locationModalities}
              onChange={(v) => update("locationModalities", v)}
              rows={2}
            />
          </>
        )}

        {section === "contact" && (
          <>
            <Field
              label="Título de contacto"
              value={content.contactTitle}
              onChange={(v) => update("contactTitle", v)}
            />
            <TextArea
              label="Texto de contacto"
              value={content.contactText}
              onChange={(v) => update("contactText", v)}
              rows={3}
            />
            <TextArea
              label="Texto de 'Cómo trabajamos'"
              value={content.howWeWorkText}
              onChange={(v) => update("howWeWorkText", v)}
              rows={3}
            />
          </>
        )}
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6600] text-white text-sm font-semibold rounded-lg hover:bg-[#e65c00] transition-colors disabled:opacity-50"
      >
        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        Guardar cambios
      </button>
    </div>
  );
}