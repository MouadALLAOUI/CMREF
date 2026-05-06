import React from "react";
import { BlobProvider } from "@react-pdf/renderer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "../../ui/dialog"; // Adjust this path to where your Dialog component is saved

export default function PdfDialogViewer({ open, onOpenChange, document, title, trigger }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* asChild allows the DialogTrigger to pass its click events to YOUR custom button */}
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      {/* We override the default max-w-lg to max-w-5xl so the PDF has room to breathe */}
      <DialogContent className="max-w-5xl w-[95vw] h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">
            Aperçu du document PDF généré.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 w-full bg-gray-100 rounded-md overflow-hidden relative">
          <BlobProvider document={document}>
            {({ url, loading, error }) => {
              if (loading) {
                return (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-500">
                    <div className="animate-pulse">Génération du PDF en cours...</div>
                  </div>
                );
              }
              if (error) {
                return (
                  <div className="absolute inset-0 flex items-center justify-center text-red-500">
                    Erreur lors de la création du PDF
                  </div>
                );
              }
              return (
                <iframe
                  src={url}
                  title={title}
                  className="w-full h-full border-none"
                />
              );
            }}
          </BlobProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}