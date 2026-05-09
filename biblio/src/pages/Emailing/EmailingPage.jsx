import { useState } from "react";
import { Button } from "../../components/ui/button";
import FormInputRow from "../../components/ui/FormInputRaw";
import { Send, Mail, Paperclip, Users, UserX } from "lucide-react";
import toast from "react-hot-toast";
import logger from "../../lib/logger";

const EmailingPage = () => {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: "",
    recipientType: "representant",
    recipientId: ""
  });
  const [isSending, setIsSending] = useState(false);

  // Mock data - replace with actual API calls
  const representants = [
    { id: "1", nom: "Jean Dupont", email: "jean.dupont@example.com" },
    { id: "2", nom: "Marie Martin", email: "marie.martin@example.com" },
  ];

  const handleSend = async () => {
    if (!formData.to || !formData.subject || !formData.message) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSending(true);
    try {
      // TODO: Replace with actual API call
      // await emailService.send(formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      toast.success("Email envoyé avec succès");
      setFormData({
        to: "",
        subject: "",
        message: "",
        recipientType: "representant",
        recipientId: ""
      });
    } catch (error) {
      logger("Error sending email:", error);
      toast.error("Erreur lors de l'envoi de l'email");
    } finally {
      setIsSending(false);
    }
  };

  const handleSelectRecipient = (repId) => {
    const rep = representants.find(r => r.id === repId);
    if (rep) {
      setFormData({
        ...formData,
        recipientId: repId,
        to: rep.email
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Mail size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Messagerie</h1>
            <p className="text-slate-500 text-sm">Envoyez des emails aux représentants et clients</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Email Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInputRow
              label="À (Destinataire)"
              placeholder="exemple@mail.com"
              value={formData.to}
              onChange={(v) => setFormData({ ...formData, to: v })}
              layout="col"
            />
            <FormInputRow
              label="Objet"
              placeholder="Sujet de votre message"
              value={formData.subject}
              onChange={(v) => setFormData({ ...formData, subject: v })}
              layout="col"
            />
          </div>

          <FormInputRow
            label="Corps du message"
            inputType="textarea"
            placeholder="Saisissez votre message ici..."
            value={formData.message}
            onChange={(v) => setFormData({ ...formData, message: v })}
            layout="col"
            rows={8}
          />

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button disabled variant="outline" className="flex items-center gap-2 text-slate-500">
              <Paperclip size={18} /> Joindre un fichier
            </Button>
            <Button 
              onClick={handleSend}
              disabled={isSending}
              className="bg-slate-900 text-white flex items-center gap-2 px-8 h-12 font-bold hover:bg-black transition-all shadow-md disabled:opacity-50"
            >
              {isSending ? "Envoi en cours..." : (
                <>
                  <Send size={18} /> Envoyer le message
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Recipients Sidebar */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Users size={18} className="text-blue-600" />
              <h3 className="font-bold text-slate-800">Représentants</h3>
            </div>
            <div className="space-y-2">
              {representants.map(rep => (
                <button
                  key={rep.id}
                  onClick={() => handleSelectRecipient(rep.id)}
                  className={`w-full p-3 rounded-lg text-left text-sm transition-colors flex items-center justify-between ${
                    formData.recipientId === rep.id
                      ? "bg-blue-50 border-blue-200 border"
                      : "bg-slate-50 hover:bg-slate-100 border-transparent border"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-slate-800">{rep.nom}</p>
                    <p className="text-xs text-slate-500">{rep.email}</p>
                  </div>
                  {formData.recipientId === rep.id && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
            <div className="flex items-start gap-2">
              <UserX size={18} className="text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-800 text-sm">Intégration API à finaliser</h4>
                <p className="text-xs text-amber-700 mt-1">
                  Endpoints nécessaires:<br/>
                  • GET /api/representants<br/>
                  • POST /api/emails/send<br/>
                  • GET /api/emails/history
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailingPage;
