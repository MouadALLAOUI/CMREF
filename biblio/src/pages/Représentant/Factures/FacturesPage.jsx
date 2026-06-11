import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import factService from "../../../api/services/factService";
import representantService from "../../../api/services/representantService";
import repRemboursementService from "../../../api/services/repRemboursementService";
import useAppStore from "../../../store/useAppStore";
import { FileText, Save } from "lucide-react";
import FormInputRow from "../../../components/ui/FormInputRaw";
import SectionContainer from "../../../components/ui/SectionContainer";

function FacturesPage() {
    const { activeSeason } = useAppStore();
    const [rows, setRows] = useState([]);
    const [representants, setRepresentants] = useState([]);
    const [repRemboursements, setRepRemboursements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRepId, setSelectedRepId] = useState("");

    // Robust check for selected representative
    const isRepSelected = useMemo(() =>
        selectedRepId && selectedRepId !== "" && selectedRepId !== "none" && selectedRepId !== "null" && selectedRepId !== "undefined",
        [selectedRepId]);

    // 1. Définition de la source de données filtrée (ou non)
    const filteredData = useMemo(() => {
        if (!isRepSelected) return rows; // Si aucun rep n'est sélectionné, on retourne tout
        return rows.filter(row => row.rep_id === selectedRepId);
    }, [rows, selectedRepId, isRepSelected]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const seasonParams = activeSeason?.label ? { annee: activeSeason.label } : {};
            const [res, reps, rembRes] = await Promise.all([
                factService.getAll(seasonParams),
                representantService.getAll(),
                repRemboursementService.getAll(seasonParams),
            ]);

            setRows(res);
            setRepresentants(reps);
            setRepRemboursements(rembRes);
        } catch (error) {
            logger("Error fetching factures:", error);
            toast.error("Erreur lors du chargement des données");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeSeason?.label]);

    // 4. Handle action click
    const handleAction = (action, row) => {
        if (action === "imp") {
            // Handle imp action
            toast.success(`Impression de la facture ${row.id}`);
        }
    };

    // 0. Options for the representative select
    const repOptions = useMemo(() =>
        representants.map(r => ({ label: r.nom, value: r.id })),
        [representants]);

    // 1. Grouping for Section A: Quantities delivered by category
    const quantitiesByCategory = useMemo(() => {
        const categories = {};
        filteredData.forEach(fact => {
            fact.details?.forEach(detail => {
                const category = detail.livre?.category?.libelle || "Non classé";
                const bookTitle = detail.livre?.code || "Livre inconnu";

                if (!categories[category]) categories[category] = {};
                if (!categories[category][bookTitle]) categories[category][bookTitle] = 0;

                categories[category][bookTitle] += detail.quantite || 0;
            });
        });
        return categories;
    }, [filteredData]);

    // 2. Balance calculation for Section B
    const balance = useMemo(() => {
        const msmRows = filteredData.filter(f => f.type === 'MSM');
        const netTotal = msmRows.reduce((acc, curr) => acc + parseFloat(curr.total_ttc || 0), 0);
        const filteredRepIds = isRepSelected ? [selectedRepId] : representants.map(r => r.id);
        const totalRepayments = repRemboursements
            .filter(r => filteredRepIds.includes(r.rep_id))
            .reduce((acc, curr) => acc + parseFloat(curr.montant || 0), 0);
        return {
            netTotal,
            repayments: totalRepayments,
        };
    }, [filteredData, repRemboursements, representants, isRepSelected, selectedRepId]);

    // 3. Filtered rows for Section C
    // 4. Filtrage par type pour les tableaux MSM et Wataniya
    const msmRows = useMemo(() => filteredData.filter(f => f.type === 'MSM'), [filteredData]);
    const wataniyaRows = useMemo(() => filteredData.filter(f => f.type === 'Wataniya'), [filteredData]);

    const handleSaveAll = async () => {
        try {
            // Logic to send updates if rows were modified locally
            // For now, just a success message as a placeholder
            toast.success("Modifications enregistrées");
        } catch (error) {
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    const columns = [
        { header: "Représentant", accessor: "representant.nom" },
        { header: "Facture N°", accessor: "fact_number || num_facture" },
        { header: "Date", accessor: "date_facture", type: "date" },
        { header: "Client", accessor: "representant.nom" }, // Adjust if there's a client relation
        { header: "ICE", accessor: "representant.cin" }, // Adjust as needed
        { header: "Montant (DH)", accessor: "total_ht", type: "money" },
        { header: "Remise", accessor: "tva_rate", type: "rate" }, // Ensure remise is in data
        { header: "Net (DH)", accessor: "total_ttc", type: "money" },
        { header: "Livrée", accessor: "status", type: "status" },
    ];

    const SaveButton = () => (
        <Button onClick={handleSaveAll} className="bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-white rounded-lg px-6 font-bold text-xs uppercase tracking-tight h-9">
            <Save className="w-3.5 h-3.5 mr-2" />
            Enregistrer les modifications
        </Button>
    );

    return (
        <div className="space-y-10 pb-10">
            {/* SECTION A: Quantités livrées */}
            <SectionContainer title="Les qtés livrées en facture">
                <div className="max-w-xs">
                    <FormInputRow
                        label="Filtrer par représentant"
                        inputType="select"
                        items={repOptions}
                        value={selectedRepId}
                        onChange={setSelectedRepId}
                        allowEmpty
                    />
                </div>

                <div className="space-y-4">
                    {Object.entries(quantitiesByCategory).map(([category, books]) => (
                        <div key={category} className="border border-slate-100 rounded-xl overflow-hidden">
                            {/* Header de Catégorie */}
                            <div className="grid grid-cols-[200px_1fr] border-b border-slate-100 bg-slate-50/50">
                                <div className="px-4 py-3 font-bold text-slate-700 text-sm border-r border-slate-100">
                                    Catégorie : {category}
                                </div>
                                <div className="grid grid-cols-6 divide-x divide-slate-100">
                                    {Object.keys(books).map(book => (
                                        <div key={book} className="px-4 py-3 text-center text-xs font-bold text-slate-600 truncate">{book}</div>
                                    ))}
                                </div>
                            </div>

                            {/* Lignes de Données */}
                            <div className="grid grid-cols-[200px_1fr] bg-slate-50/30">
                                <div className="px-4 py-3 text-slate-500 text-xs border-r border-slate-100 flex items-center font-medium italic">Qté</div>
                                <div className="grid grid-cols-6 divide-x divide-slate-100">
                                    {Object.values(books).map((qty, i) => (
                                        <div key={i} className="px-4 py-3 text-center text-sm font-bold text-[#0a74b9]">{qty}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </SectionContainer>

            {/* SECTION B: Balance des factures */}
            <SectionContainer title="Balance des factures || Remboursements MSM-MEDIAS">
                {/* Zone de Filtre */}
                <div className="max-w-xs">
                    <FormInputRow
                        label="Filtrer par représentant"
                        inputType="select"
                        items={repOptions}
                        value={selectedRepId}
                        onChange={setSelectedRepId}
                        allowEmpty
                        emptyLabel="Afficher tous"
                    />
                </div>

                {/* Grille de Calcul */}
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-2 bg-slate-50/50 border-b border-slate-100">
                        <div className="px-6 py-3 text-center text-sm font-bold text-slate-700 border-r border-slate-100">
                            Montant Net des factures
                        </div>
                        <div className="px-6 py-3 text-center text-sm font-bold text-slate-700">
                            Somme des Remboursements
                        </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="px-6 py-4 text-center text-lg font-black text-slate-900 border-r border-slate-100">
                            {balance.netTotal.toLocaleString()} DH
                        </div>
                        <div className="px-6 py-4 text-center text-lg font-black text-[#0a74b9]">
                            {balance.repayments.toLocaleString()} DH
                        </div>
                    </div>
                </div>
            </SectionContainer>

            {/* SECTION C: Factures MSM-MEDIAS */}
            <SectionContainer
                title="Factures acceptées (MSM-MEDIAS)"
                icon={FileText}
                headerColor="bg-[#10b981]"
                footerActions={<SaveButton />}
            >
                <div className="flex items-end justify-between gap-4 mb-4">
                    <div className="w-full max-w-xs">
                        <FormInputRow
                            label="Filtrer par représentant"
                            inputType="select"
                            items={repOptions}
                            value={selectedRepId}
                            onChange={setSelectedRepId}
                            allowEmpty
                            emptyLabel="Afficher tous"
                        />
                    </div>
                    <SaveButton />
                </div>

                <MyTable
                    data={msmRows}
                    columns={columns}
                    actions={["imp"]}
                    onAction={handleAction}
                    pageSize={10}
                    variant="slate"
                    isLoading={isLoading}
                    enableSearch
                    enableSorting
                />
            </SectionContainer>

            {/* SECTION D: Factures Wataniya */}
            <SectionContainer
                title="Factures acceptées (Wataniya)"
                icon={FileText}
                headerColor="bg-[#1ebba3]" // On peut changer la couleur
                footerActions={<SaveButton />}
            >
                {/* Le contenu spécifique à Wataniya ici */}
                <MyTable data={wataniyaRows} columns={columns} /* ... */ />
            </SectionContainer>
        </div>
    );
}



export default FacturesPage;
