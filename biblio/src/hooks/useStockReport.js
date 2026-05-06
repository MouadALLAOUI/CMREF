// src/hooks/useStockReport.js
import { useState, useEffect, useMemo } from "react";
import destinationService from "../api/services/destinationService";
import categoryService from "../api/services/categoryService";
import livreService from "../api/services/livreService";
import toast from "react-hot-toast";

export function useStockReport(selectedDestinationId) {
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [livres, setLivres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. FETCH DATA ONCE
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [destRes, catRes, livRes] = await Promise.all([
          destinationService.getAll(),
          categoryService.getAll(),
          livreService.getAll()
        ]);
        setDestinations(destRes);
        setCategories(catRes);
        setLivres(livRes);
      } catch (error) {
        console.error("Error fetching report data:", error);
        toast.error("Erreur lors du chargement des données de stock");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // 2. CALCULATE AND GROUP DATA
  const groupedReportData = useMemo(() => {
    if (!categories.length || !livres.length) return [];

    const categoryMap = {};

    categories.forEach(cat => {
      categoryMap[cat.id] = { categoryName: cat.libelle, booksMap: {} };
    });

    livres.forEach(livre => {
      if (categoryMap[livre.categorie_id]) {
        categoryMap[livre.categorie_id].booksMap[livre.code] = {
          livre: livre.code, achat: 0, vente: 0, stock: 0, stockDepart: 0, livraison: 0, specimen: 0, rejet: 0
        };
      }
    });

    const initBook = (code, catId, defaultCatName = "Autre") => {
      const id = catId || "unknown";
      if (!categoryMap[id]) categoryMap[id] = { categoryName: defaultCatName, booksMap: {} };
      if (!categoryMap[id].booksMap[code]) {
        categoryMap[id].booksMap[code] = { livre: code, achat: 0, vente: 0, stock: 0, stockDepart: 0, livraison: 0, specimen: 0, rejet: 0 };
      }
      return categoryMap[id].booksMap[code];
    };

    const targets = selectedDestinationId
      ? destinations.filter(d => d.id === selectedDestinationId)
      : destinations;

    targets.forEach(dest => {
      if (dest.ventes) {
        dest.ventes.forEach(vente => {
          const code = vente.livre?.code || vente.livre_id;
          const catId = vente.livre?.categorie_id;
          const catName = vente.livre?.category?.libelle;
          const bookRow = initBook(code, catId, catName);
          bookRow.vente += Number(vente.quantite || 0);
        });
      }
      if (dest.livraisons) {
        dest.livraisons.forEach(livraison => {
          if (livraison.items) {
            livraison.items.forEach(item => {
              const code = item.livre?.code || item.livre_id;
              const catId = item.livre?.categorie_id;
              const catName = item.livre?.category?.libelle;
              const bookRow = initBook(code, catId, catName);

              const qte = Number(item.quantite || 0);
              if (livraison.type === 'Specimen') bookRow.specimen += qte;
              else if (livraison.type === 'Retour') bookRow.rejet += qte;
              else {
                bookRow.achat += qte;
                bookRow.livraison += qte;
              }
            });
          }
        });
      }
    });

    return Object.values(categoryMap).map(cat => {
      const booksArray = Object.values(cat.booksMap).map(row => ({
        ...row,
        stock: row.achat - row.vente - row.specimen + row.rejet
      })).sort((a, b) => a.livre.localeCompare(b.livre));
      return { categoryName: cat.categoryName, books: booksArray };
    }).filter(cat => cat.books.length > 0);

  }, [destinations, selectedDestinationId, categories, livres]);

  // 3. CALCULATE TOTALS
  const totalGlobalStock = useMemo(() => {
    return groupedReportData.reduce((total, cat) => {
      return total + cat.books.reduce((sum, book) => sum + book.stock, 0);
    }, 0);
  }, [groupedReportData]);

  // 4. RETURN EVERYTHING THE UI NEEDS
  return {
    destinations,
    groupedReportData,
    totalGlobalStock,
    isLoading
  };
}