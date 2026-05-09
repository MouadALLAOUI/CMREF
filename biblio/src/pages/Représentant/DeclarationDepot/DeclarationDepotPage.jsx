import { useEffect, useState, useMemo } from "react";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import depotService from "../../../api/services/depotService";
import representantService from "../../../api/services/representantService";
import { Package, CheckCircle2, XCircle } from "lucide-react";
import SectionContainer from "../../../components/ui/SectionContainer";

function DeclarationDepotPage() {
    const [rows, setRows] = useState([]);
    const [repDepots, setRepDepots] = useState([]);
    const [representants, setRepresentants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRep, setSelectedRep] = useState("");

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [depotsRes, repsRes] = await Promise.all([
                depotService.getAll(),
                representantService.getAll(),
            ]);
            setRows(depotsRes);
            setRepresentants(repsRes);
        } catch (error) {
            logger("Error fetching depots:", error);
            toast.error("Erreur lors du chargement des données");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRepDepots = async (repId) => {
        if (!repId) {
            setRepDepots([]);
            return;
        }
        try {
            const res = await representantService.getDepot(repId);
            setRepDepots(Array.isArray(res) ? res : [res]);
        } catch (error) {
            logger("Error fetching rep depots:", error);
            toast.error("Erreur lors du chargement des dépôts du représentant");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleValidateDepot = async (depotId, validated) => {
        try {
            await depotService.update(depotId, { valide: validated });
            toast.success(validated ? "Dépôt validé" : "Dépôt invalidé");
            if (selectedRep) {
                fetchRepDepots(selectedRep);
            }
            fetchData();
        } catch (error) {
            logger("Error updating depot validation:", error);
            toast.error("Erreur lors de la mise à jour");
        }
    };

    const columns = [
        { header: "Representant", accessor: "representant.nom", type: "hidden" },
        { header: "Livre", accessor: "livre.titre", color: "#f00" },
        { header: "Quantité", accessor: "-quantite_balance" },
        { header: "Statut", accessor: "status", type: "bool" },
    ];

    const repDepotColumns = useMemo(() => [
        { header: "Livre", accessor: "livre.titre", color: "#0ea5e9" },
        { header: "Quantité Déclarée", accessor: "quantite" },
        { header: "Quantité Balance", accessor: "quantite_balance" },
        { 
            header: "Validé", 
            accessor: "valide", 
            type: "bool",
            onClick: (row) => handleValidateDepot(row.id, !row.valide),
            render: (value, row) => (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleValidateDepot(row.id, !value);
                    }}
                    className="hover:scale-110 transition-transform"
                >
                    {value ? (
                        <CheckCircle2 className="text-emerald-600 w-6 h-6" />
                    ) : (
                        <XCircle className="text-red-400 w-6 h-6" />
                    )}
                </button>
            ),
        },
    ], [selectedRep, repDepots]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Déclaration dépôt</h1>
                    <p className="text-sm text-slate-500 mt-1">Gérez les déclarations de dépôts et validations</p>
                </div>
            </div>

            {/* Part 1: Global Depot Declarations */}
            <SectionContainer
                title="Déclarations globales"
                icon={Package}
                headerColor="bg-[#0ea5e9]"
            >
                <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                    <MyTable
                        data={rows}
                        columns={columns}
                        pageSize={5}
                        actions={[]}
                        variant="slate"
                        isLoading={isLoading}
                        enableSearch
                        defaultFilterColumn={{ header: "Representant", accessor: "representant.nom" }}
                        enableCategoricalFilter
                        enableSorting
                    />
                </div>
            </SectionContainer>

            {/* Part 2: Per-Representative Depot List with Validation */}
            <SectionContainer
                title="Liste des dépôts représentants"
                icon={CheckCircle2}
                headerColor="bg-[#10b981]"
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-semibold text-slate-700">Sélectionner un représentant:</label>
                        <select
                            value={selectedRep}
                            onChange={(e) => {
                                setSelectedRep(e.target.value);
                                fetchRepDepots(e.target.value);
                            }}
                            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                            <option value="">-- Choisir un représentant --</option>
                            {representants.map((rep) => (
                                <option key={rep.id} value={rep.id}>
                                    {rep.nom}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedRep && (
                        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                            <MyTable
                                data={repDepots}
                                columns={repDepotColumns}
                                pageSize={10}
                                actions={[]}
                                variant="slate"
                                isLoading={isLoading}
                                enableSearch
                                enableSorting
                                defaultFilterColumn={{ header: "Livre", accessor: "livre.titre" }}
                                enableCategoricalFilter
                            />
                        </div>
                    )}

                    {!selectedRep && (
                        <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">Sélectionnez un représentant pour voir ses dépôts</p>
                        </div>
                    )}
                </div>
            </SectionContainer>
        </div>
    );
}

export default DeclarationDepotPage;
