import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import logger from "../../../lib/logger";
import { MyTable } from "../../../components/ui/myTable";
import depotService from "../../../api/services/depotService";

function DeclarationDepotPage() {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await depotService.getAll();
            // console.log(res)
            setRows(res);
        } catch (error) {
            logger("Error fetching depots:", error);
            toast.error("Erreur lors du chargement des données");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { header: "Representant", accessor: "representant.nom", type: "hidden" },
        { header: "Livre", accessor: "livre.titre", color: "#f00" },
        { header: "Quantité", accessor: "-quantite_balance" },
        { header: "Statut", accessor: "status", type: "bool" },
    ];
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Déclaration dépôt</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
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
                    enableSelection
                />
            </div>
        </div>
    );
}

export default DeclarationDepotPage;
