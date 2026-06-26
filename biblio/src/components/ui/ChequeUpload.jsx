import { useState } from "react";
import { Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

function ChequeUpload({ value, onChange, isView, label = "Image du chèque" }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await api.post("/upload-cheque", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = res?.data?.data || res?.data || res;
      onChange(data.path);
      setPreview(data.url || data.path);
      toast.success("Image uploadée avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'upload de l'image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    setPreview(null);
  };

  const imageUrl = preview
    ? (preview.startsWith("http") ? preview : `${process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:8000"}/storage/${preview}`)
    : null;

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-700 uppercase">{label}</label>
      {imageUrl ? (
        <div className="relative inline-block">
          <img
            src={imageUrl}
            alt="Chèque"
            className="max-h-48 rounded-xl border border-slate-200 object-contain bg-slate-50"
          />
          {!isView && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        !isView && (
          <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
            <div className="flex flex-col items-center gap-1 text-slate-400">
              <Upload size={20} />
              <span className="text-xs font-medium">{uploading ? "Upload..." : "Cliquer pour uploader"}</span>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFile}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )
      )}
      {isView && !imageUrl && (
        <p className="text-sm text-slate-400 italic">Aucune image</p>
      )}
    </div>
  );
}

export default ChequeUpload;
