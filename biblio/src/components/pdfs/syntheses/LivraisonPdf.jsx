import React from 'react';
import { Document, Text, View, StyleSheet } from '@react-pdf/renderer';
import PdfPageLayout from '../../template/pdfs/PdfPageLayout';
import { currencyFormat } from '../../../lib/utilities';

const styles = StyleSheet.create({
  title: { fontSize: 16, marginBottom: 8, textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' },
  subtitle: { fontSize: 10, marginBottom: 15, textAlign: 'center', color: '#6b7280' },
  sectionTitle: { fontSize: 12, marginBottom: 8, fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: '#f3f4f6', padding: 6, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  table: { display: 'table', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 15 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', minHeight: 22, alignItems: 'center' },
  tableHeader: { backgroundColor: '#111827' },
  tableCellHeader: { color: '#ffffff', fontSize: 8, fontWeight: 'bold', padding: 4 },
  tableCell: { fontSize: 8, padding: 4, color: '#374151' },
  totalRow: { backgroundColor: '#f9fafb', borderTopWidth: 1, borderTopColor: '#d1d5db', minHeight: 24 },
  kpiSection: { marginBottom: 12, padding: 8, backgroundColor: '#eff6ff', borderRadius: 4, borderLeftWidth: 3, borderLeftColor: '#3b82f6' },
  kpiRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  kpiLabel: { fontSize: 9, color: '#374151' },
  kpiValue: { fontSize: 9, fontWeight: 'bold' },
});

const LivraisonPdf = ({ title, categorySections, summaryRows, kpis, labelField, seasonLabel }) => (
  <Document>
    <PdfPageLayout orientation="landscape">
      <Text style={styles.title}>{title}</Text>
      {seasonLabel && <Text style={styles.subtitle}>{seasonLabel}</Text>}

      <View style={styles.kpiSection}>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>{labelField === 'rep' ? 'Représentants' : 'Fournisseurs'} :</Text>
          <Text style={styles.kpiValue}>{kpis.reps || kpis.fournisseurs}</Text>
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Quantité totale :</Text>
          <Text style={styles.kpiValue}>{kpis.quantite}</Text>
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Montant estimé :</Text>
          <Text style={[styles.kpiValue, { color: '#2563eb' }]}>{currencyFormat(kpis.montant)}</Text>
        </View>
      </View>

      {categorySections.map((section) => (
        <View key={section.category} style={{ marginBottom: 15 }}>
          <Text style={styles.sectionTitle}>Catégorie : {section.category}</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]} fixed>
              <View style={{ width: '22%' }}><Text style={styles.tableCellHeader}>Ouvrage</Text></View>
              <View style={{ width: '10%' }}><Text style={styles.tableCellHeader}>Code</Text></View>
              {summaryRows.map((r) => (
                <View key={r.id} style={{ width: `${Math.floor(56 / Math.max(summaryRows.length, 1))}%` }}>
                  <Text style={styles.tableCellHeader}>{labelField === 'rep' ? r.rep : r.fournisseur}</Text>
                </View>
              ))}
              <View style={{ width: '8%' }}><Text style={styles.tableCellHeader}>Total</Text></View>
            </View>
            {section.books.map((book, idx) => (
              <View key={idx} style={styles.tableRow} wrap={false}>
                <View style={{ width: '22%' }}><Text style={styles.tableCell}>{book.titre}</Text></View>
                <View style={{ width: '10%' }}><Text style={styles.tableCell}>{book.code}</Text></View>
                {summaryRows.map((r) => (
                  <View key={r.id} style={{ width: `${Math.floor(56 / Math.max(summaryRows.length, 1))}%` }}>
                    <Text style={styles.tableCell}>{(labelField === 'rep' ? book.repQty : book.impQty)?.[r.id] || 0}</Text>
                  </View>
                ))}
                <View style={{ width: '8%' }}><Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{book.total}</Text></View>
              </View>
            ))}
          </View>
        </View>
      ))}

      {summaryRows.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Détail par {labelField === 'rep' ? 'représentant' : 'fournisseur'}</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]} fixed>
              <View style={{ width: '25%' }}><Text style={styles.tableCellHeader}>{labelField === 'rep' ? 'Représentant' : 'Fournisseur'}</Text></View>
              <View style={{ width: '12%' }}><Text style={styles.tableCellHeader}>Nb BL</Text></View>
              <View style={{ width: '15%' }}><Text style={styles.tableCellHeader}>Quantité</Text></View>
              <View style={{ width: '20%' }}><Text style={styles.tableCellHeader}>Montant (DH)</Text></View>
              <View style={{ width: '18%' }}><Text style={styles.tableCellHeader}>{labelField === 'rep' ? 'Dernière émission' : 'Dernière réception'}</Text></View>
            </View>
            {summaryRows.map((row, idx) => (
              <View key={idx} style={styles.tableRow} wrap={false}>
                <View style={{ width: '25%' }}><Text style={styles.tableCell}>{labelField === 'rep' ? row.rep : row.fournisseur}</Text></View>
                <View style={{ width: '12%' }}><Text style={styles.tableCell}>{row.nbBL}</Text></View>
                <View style={{ width: '15%' }}><Text style={styles.tableCell}>{row.nbLivres}</Text></View>
                <View style={{ width: '20%' }}><Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{currencyFormat(row.montant)}</Text></View>
                <View style={{ width: '18%' }}><Text style={styles.tableCell}>{row.date}</Text></View>
              </View>
            ))}
          </View>
        </View>
      )}
    </PdfPageLayout>
  </Document>
);

export default LivraisonPdf;
