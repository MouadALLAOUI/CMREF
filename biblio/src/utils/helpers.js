/**
 * Shared utility functions for CMREF application
 * Centralizes repeated logic across components
 */

import { currencyFormat, dateFormat } from '../lib/utilities';

/**
 * Format money value with DH suffix
 * @param {number|string} value - The value to format
 * @returns {string} Formatted currency string
 */
export const formatMoney = (value) => {
  return currencyFormat(value);
};

/**
 * Calculate recouvrement (collection rate)
 * @param {number} collected - Amount collected
 * @param {number} total - Total amount
 * @returns {number} Percentage (0-100)
 */
export const calculateRecouvrement = (collected, total) => {
  if (!total || total === 0) return 0;
  return Math.round((collected / total) * 100);
};

/**
 * Get season header display string
 * @param {string} season - Season identifier (e.g., "2024/2025")
 * @returns {string} Formatted season header
 */
export const getSeasonHeader = (season) => {
  if (!season) return 'Saison non définie';
  return `Saison ${season}`;
};

/**
 * Check if date is within last 15 minutes (online status)
 * @param {string|Date} lastActivity - Last activity timestamp
 * @returns {boolean} True if online
 */
export const isOnline = (lastActivity) => {
  if (!lastActivity) return false;
  const lastActivityDate = new Date(lastActivity);
  if (isNaN(lastActivityDate.getTime())) return false;
  const diffInMinutes = (new Date().getTime() - lastActivityDate.getTime()) / (1000 * 60);
  return diffInMinutes >= 0 && diffInMinutes < 15;
};

/**
 * Safely parse number from various input types
 * @param {any} value - Value to parse
 * @returns {number} Parsed number or 0
 */
export const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

/**
 * Group array by key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Map} Map of grouped items
 */
export const groupBy = (array, key) => {
  return array.reduce((acc, item) => {
    const groupKey = item[key];
    if (!acc.has(groupKey)) {
      acc.set(groupKey, []);
    }
    acc.get(groupKey).push(item);
    return acc;
  }, new Map());
};

/**
 * Calculate totals for financial summary with breakdown by type
 * @param {Array} items - Array of items with montant and type_versement properties
 * @returns {Object} Object with totalCredit, totalAvance, totalReste
 */
export const calculateFinancialSummary = (items) => {
  let totalCredit = 0;
  let totalAvance = 0;
  
  items.forEach(item => {
    const montant = toNumber(item.montant);
    const type = item.type_versement || '';
    
    // Credit: payments received (statut_recu or statut_accepte)
    if (item.statut_recu || item.statut_accepte) {
      totalCredit += montant;
    }
    
    // Avance: advance payments (type_versement === 'Versement' or 'Virement')
    if (type === 'Versement' || type === 'Virement') {
      totalAvance += montant;
    }
  });
  
  const totalReste = totalCredit - totalAvance;
  
  return { totalCredit, totalAvance, totalReste };
};

/**
 * Validate required form fields
 * @param {Object} formData - Form data object
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} { valid, errors }
 */
export const validateForm = (formData, requiredFields) => {
  const errors = {};
  requiredFields.forEach(field => {
    if (!formData[field] && formData[field] !== 0 && formData[field] !== false) {
      errors[field] = 'Ce champ est requis';
    }
  });
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Debounce function for search inputs
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Export table data to CSV
 * @param {Array} data - Data to export
 * @param {Array} columns - Column definitions
 * @param {string} filename - Output filename
 */
export const exportToCSV = (data, columns, filename = 'export.csv') => {
  const headers = columns.filter(col => col.type !== 'hidden').map(col => col.header);
  const rows = data.map(row => 
    columns.filter(col => col.type !== 'hidden').map(col => {
      const value = row[col.accessor] || '';
      return `"${String(value).replace(/"/g, '""')}"`;
    })
  );
  
  const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

/**
 * Get entity type label
 * @param {string} entityType - Entity type code
 * @returns {string} Human-readable label
 */
export const getEntityTypeLabel = (entityType) => {
  const labels = {
    'MSM-MEDIAS': 'MSM MÉDIAS',
    'WATANIYA': 'Wataniya',
  };
  return labels[entityType] || entityType;
};

/**
 * Calculate BL synthesis metrics per representative
 * @param {Array} blItems - BL line items
 * @returns {Array} Synthesis data per rep
 */
export const calculateBLSynthesis = (blItems) => {
  const grouped = new Map();
  
  for (const item of blItems) {
    const livraison = item.livraison;
    const repId = livraison?.rep_id || livraison?.representant?.id;
    if (!repId) continue;
    
    const repNom = livraison?.representant?.nom || repId;
    const qty = toNumber(item.quantite);
    const unit = toNumber(item.livre?.prix_vente ?? item.livre?.prix_public ?? 0);
    const total = qty * unit;
    
    const prev = grouped.get(repId) || {
      id: repId,
      rep: repNom,
      totalBL: 0,
      totalMontant: 0,
      lastUpdate: '',
      blNumbers: new Set(),
    };
    
    prev.totalMontant += total;
    if (livraison?.bl_number) prev.blNumbers.add(String(livraison.bl_number));
    prev.totalBL = prev.blNumbers.size;
    if (livraison?.date_emission && (!prev.lastUpdate || String(livraison.date_emission) > String(prev.lastUpdate))) {
      prev.lastUpdate = livraison.date_emission;
    }
    grouped.set(repId, prev);
  }
  
  return Array.from(grouped.values()).sort((a, b) => b.totalMontant - a.totalMontant);
};
