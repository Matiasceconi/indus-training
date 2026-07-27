import { useState } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { useToast } from "@/components/ui/use-toast";

export default function ImageUpload({ value, onChange, label, aspect = "aspect-[4/3]" }) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onChange(file_url);
      toast({ title: "Imagen subida correctamente" });
    } catch (err) {
      toast({ title: "Error al subir la imagen", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-[#121212] mb-2">{label}</label>
      )}
      <div className={`relative rounded-xl overflow-hidden border border-black/10 bg-[#F5F5F5] ${aspect}`}>
        {value ? (
          <>
            <Image src={value} fittingType="fill" className="w-full h-full" alt={label || "Imagen"} />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#121212]/30">
            <Upload size={32} />
          </div>
        )}
      </div>
      <label className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#FF6600] text-white text-sm font-semibold rounded-lg cursor-pointer hover:bg-[#e65c00] transition-colors">
        {uploading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Subiendo...
          </>
        ) : (
          <>
            <Upload size={16} />
            {value ? "Cambiar imagen" : "Subir imagen"}
          </>
        )}
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
      </label>
    </div>
  );
}