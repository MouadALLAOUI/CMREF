import { useState, useEffect, useMemo } from "react";
import { Button } from "../../../components/ui/button";
import FormInputRow from "../../../components/ui/FormInputRaw";
import { Send, Mail, Paperclip, Loader2, Users, UserCheck } from "lucide-react";
import emailService from "../../../api/services/emailService";
import representantService from "../../../api/services/representantService";
import imprimeurService from "../../../api/services/imprimeurService";
import clientService from "../../../api/services/clientService";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";

const SimpleEmailPage = () => {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const [reps, fournisseurs, clients] = await Promise.all([
          representantService.getAll().catch(() => []),
          imprimeurService.getAll().catch(() => []),
          clientService.getAll().catch(() => []),
        ]);

        const all = [
          ...reps.map(r => ({ id: r.id, nom: r.nom, email: r.email, type: "Représentant" })),
          ...fournisseurs.map(f => ({ id: f.id, nom: f.nom || f.raison_sociale, email: f.directeur_email || f.email, type: "Fournisseur" })),
          ...clients.filter(c => c.email).map(c => ({ id: c.id, nom: c.raison_sociale || c.nom, email: c.email, type: "Client" })),
        ].filter(r => r.email);

        setRecipients(all);
      } catch (error) {
        logger("Error fetching recipients:", error)("error");
      }
    };
    fetchRecipients();
  }, []);

  const filteredRecipients = useMemo(() => {
    if (!searchQuery) return recipients;
    const q = searchQuery.toLowerCase();
    return recipients.filter(r =>
      r.nom?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.type?.toLowerCase().includes(q)
    );
  }, [recipients, searchQuery]);

  const handleSelectRecipient = (recipient) => {
    if (selectedRecipients.some(r => r.id === recipient.id)) {
      setSelectedRecipients(prev => prev.filter(r => r.id !== recipient.id));
    } else {
      setSelectedRecipients(prev => [...prev, recipient]);
    }
  };

  const handleRemoveRecipient = (id) => {
    setSelectedRecipients(prev => prev.filter(r => r.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toEmail = selectedRecipients.length > 0
      ? selectedRecipients.map(r => r.email).join(",")
      : formData.to;

    if (!toEmail || !formData.subject || !formData.message) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await emailService.send({
        to: toEmail,
        subject: formData.subject,
        message: formData.message,
      });
      toast.success(response.message || "Email envoyé avec succès !");
      setFormData({ to: "", subject: "", message: "" });
      setSelectedRecipients([]);
      setSearchQuery("");
    } catch (error) {
      logger("Error sending email:", error)("error");
      toast.error("Erreur lors de l'envoi de l'email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <Mail size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Messagerie Rapide</h1>
          <p className="text-slate-500 text-sm">Envoyez un email direct à vos collaborateurs ou partenaires.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Destinataires</label>
              <input
                type="text"
                placeholder="Rechercher un destinataire..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                disabled={isLoading}
              />
              {selectedRecipients.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedRecipients.map(r => (
                    <span key={r.id} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                      {r.nom} ({r.type})
                      <button type="button" onClick={() => handleRemoveRecipient(r.id)} className="text-slate-400 hover:text-red-500">&times;</button>
                    </span>
                  ))}
                </div>
              )}
              {searchQuery && filteredRecipients.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredRecipients.slice(0, 10).map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => { handleSelectRecipient(r); setSearchQuery(""); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center justify-between ${selectedRecipients.some(s => s.id === r.id) ? 'bg-slate-50' : ''}`}
                    >
                      <span className="font-medium">{r.nom}</span>
                      <span className="text-slate-400 text-xs">{r.email} &middot; {r.type}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInputRow
                label="À (Email direct)"
                placeholder="exemple@mail.com"
                value={formData.to}
                onChange={(v) => setFormData({ ...formData, to: v })}
                disabled={isLoading || selectedRecipients.length > 0}
              />
              <FormInputRow
                label="Objet"
                placeholder="Sujet de votre message"
                value={formData.subject}
                onChange={(v) => setFormData({ ...formData, subject: v })}
                disabled={isLoading}
                required
              />
            </div>

            <FormInputRow
              label="Corps du message"
              inputType="textarea"
              placeholder="Saisissez votre message ici..."
              value={formData.message}
              onChange={(v) => setFormData({ ...formData, message: v })}
              disabled={isLoading}
              required
            />

            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <Button disabled variant="outline" className="flex items-center gap-2">
                <Paperclip size={18} /> Joindre un fichier
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-slate-900 text-white flex items-center gap-2 px-8 h-12 font-bold hover:bg-black transition-all shadow-md disabled:bg-slate-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Envoyer le message
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <Users size={18} className="text-slate-600" />
              <h2 className="text-sm font-bold text-slate-700 uppercase">Destinataires disponibles</h2>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recipients.length === 0 ? (
                <p className="text-sm text-slate-400 italic">Chargement...</p>
              ) : (
                recipients.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleSelectRecipient(r)}
                    className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${selectedRecipients.some(s => s.id === r.id) ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'}`}
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck size={14} className={selectedRecipients.some(s => s.id === r.id) ? 'text-white' : 'text-slate-400'} />
                      <div>
                        <p className={`font-medium ${selectedRecipients.some(s => s.id === r.id) ? 'text-white' : 'text-slate-700'}`}>{r.nom}</p>
                        <p className={`text-xs ${selectedRecipients.some(s => s.id === r.id) ? 'text-slate-300' : 'text-slate-400'}`}>{r.email}</p>
                        <p className={`text-xs ${selectedRecipients.some(s => s.id === r.id) ? 'text-slate-300' : 'text-slate-400'}`}>{r.type}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleEmailPage;
