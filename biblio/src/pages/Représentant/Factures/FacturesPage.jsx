import { useEffect, useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import factService from "../../../api/services/factService";
import factSequenceService from "../../../api/services/factSequenceService";
import representantService from "../../../api/services/representantService";
import { cn } from "../../../lib/utils";
import { FileText, Save } from "lucide-react";
import FormInputRow from "../../../components/ui/FormInputRaw";
import SectionContainer from "../../../components/ui/SectionContainer";

function FacturesPage() {
    const [rows, setRows] = useState([]);
    const [representants, setRepresentants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRepId, setSelectedRepId] = useState("");

    // Robust check for selected representative
    const isRepSelected = useMemo(() =>
        selectedRepId && selectedRepId !== "" && selectedRepId !== "none" && selectedRepId !== "null" && selectedRepId !== "undefined",
        [selectedRepId]);

    // 1. Définition de la source de données filtrée (ou non)
    const filteredData = useMemo(() => {
        console.log(isRepSelected);
        if (!isRepSelected) return rows; // Si aucun rep n'est sélectionné, on retourne tout
        return rows.filter(row => row.rep_id === selectedRepId);
    }, [rows, selectedRepId, isRepSelected]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [res, reps] = await Promise.all([
                factService.getAll(),
                representantService.getAll(),
            ]);

            logger({ res });

            //             {
            //     "id": "019d972f-fb06-7022-8b04-5615d3916e50",
            //     "rep_id": "019d972f-7a6a-73fd-b014-5abb8b38c62c",
            //     "sequence_id": "019d972f-615f-7054-8a42-fc55b549ca2d",
            //     "year_session": "2012",
            //     "number": 3411,
            //     "fact_number": "FACT-7332",
            //     "date_facture": "2022-03-07",
            //     "total_ht": "4594.04",
            //     "tva_rate": "20.00",
            //     "total_ttc": "5512.85",
            //     "reste_a_payer": "0.00",
            //     "status": "Annulée",
            //     "remarques": "Doloribus asperiores aut consequuntur iure.",
            //     "created_at": "2026-04-16T16:46:37.000000Z",
            //     "updated_at": "2026-04-16T16:46:37.000000Z",
            //     "type": "MSM",
            //     "representant": {
            //         "id": "019d972f-7a6a-73fd-b014-5abb8b38c62c",
            //         "destination_id": "019d972f-56b2-72a0-9247-d4d30433295e",
            //         "nom": "Étienne Huet",
            //         "cin": "hd619060",
            //         "tel": "07 88 47 67 95",
            //         "email": "cmorvan@example.com",
            //         "adresse": "15, chemin Thomas Jourdan\n65486 De Oliveira-sur-Lelievre",
            //         "code_postale": "20695",
            //         "ville": "Blanc",
            //         "lieu_de_travail": "Etienne Samson SA",
            //         "login": "nicolas.olivie",
            //         "bl_count": 0,
            //         "remb_count": 0,
            //         "created_at": "2026-04-16T16:46:04.000000Z",
            //         "updated_at": "2026-04-16T16:46:04.000000Z"
            //     },
            //     "sequence": {
            //         "id": "019d972f-615f-7054-8a42-fc55b549ca2d",
            //         "nom": "4233-3656",
            //         "dernier_numero": 0,
            //         "est_active": 1,
            //         "created_at": "2026-04-16T16:45:57.000000Z",
            //         "updated_at": "2026-04-16T16:45:57.000000Z"
            //     },
            //     "details": [
            //         {
            //             "id": "019d9730-0167-70ae-8f8a-1fb0efdb2ad0",
            //             "fact_id": "019d972f-fb06-7022-8b04-5615d3916e50",
            //             "livre_id": "019d972f-572f-736a-9d5f-08dea5f75d89",
            //             "quantite": 100,
            //             "prix_unitaire_ht": "27.32",
            //             "remise": "10.85",
            //             "total_ligne_ht": "2435.58",
            //             "created_at": "2026-04-16T16:46:38.000000Z",
            //             "updated_at": "2026-04-16T16:46:38.000000Z",
            //             "livre": {
            //                 "id": "019d972f-572f-736a-9d5f-08dea5f75d89",
            //                 "titre": "Vel rerum aspernatur.",
            //                 "code": "82324742",
            //                 "categorie_id": "019d972f-5422-73a0-a771-1f31ee334a50",
            //                 "prix_achat": "24.53",
            //                 "prix_vente": "172.13",
            //                 "prix_public": "103.81",
            //                 "nb_pages": 288,
            //                 "color_code": "#b78c9e",
            //                 "description": "Maxime unde ea ea aut. Iste aperiam doloremque sed in necessitatibus deleniti quia. Eius aliquam qui aut voluptate ipsam iusto illum. Minus eos ullam vitae ut maiores alias accusantium. Corporis sed aspernatur at recusandae iste nam ut.",
            //                 "annee_publication": "2005",
            //                 "created_at": "2026-04-16T16:45:55.000000Z",
            //                 "updated_at": "2026-04-16T16:45:55.000000Z",
            //                 "category": {
            //                     "id": "019d972f-5422-73a0-a771-1f31ee334a50",
            //                     "libelle": "Robotos",
            //                     "description": "Matériel de robotique et informatique",
            //                     "created_at": "2026-04-16T16:45:54.000000Z",
            //                     "updated_at": "2026-04-16T16:45:54.000000Z"
            //                 }
            //             }
            //         }
            //     ]
            // }
            setRows(res);
            setRepresentants(reps);
        } catch (error) {
            logger("Error fetching factures:", error);
            toast.error("Erreur lors du chargement des données");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                const bookTitle = detail.livre?.titre || "Livre inconnu";

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
        return {
            netTotal,
            repayments: 2000,
        };
    }, [filteredData]);

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
        // { header: "Imprimer", accessor: "id", type: "action", action: "print" },
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
