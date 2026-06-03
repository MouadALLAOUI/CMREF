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
  summarySection: { marginTop: 12, padding: 10, backgroundColor: '#f0f9ff', borderRadius: 4, borderLeftWidth: 3, borderLeftColor: '#3b82f6' },
  summaryTitle: { fontSize: 10, fontWeight: 'bold', marginBottom: 6, textTransform: 'uppercase' },
  kpiRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  kpiLabel: { fontSize: 9, color: '#374151' },
  kpiValue: { fontSize: 9, fontWeight: 'bold' },
});

const BalancePdf = ({ categorySections, summaryRows, kpis, seasonLabel }) => (
  <Document>
    <PdfPageLayout orientation="landscape">
      <Text style={styles.title}>Balance Générale</Text>
      {seasonLabel && <Text style={styles.subtitle}>{seasonLabel}</Text>}

      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Indicateurs Clés</Text>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Total ventes :</Text>
          <Text style={[styles.kpiValue, { color: '#059669' }]}>{currencyFormat(kpis.ventes)}</Text>
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Total achats :</Text>
          <Text style={[styles.kpiValue, { color: '#2563eb' }]}>{currencyFormat(kpis.achats)}</Text>
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Résultat net :</Text>
          <Text style={[styles.kpiValue, { color: '#111827' }]}>{currencyFormat(kpis.net)}</Text>
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Recouvrement :</Text>
          <Text style={[styles.kpiValue, { color: '#d97706' }]}>{kpis.recouvrement.toFixed(1)}%</Text>
        </View>
      </View>

      {categorySections.map((section) => (
        <View key={section.category} style={{ marginBottom: 15 }}>
          <Text style={styles.sectionTitle}>Balance — Catégorie : {section.category}</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]} fixed>
              <View style={{ width: '30%' }}><Text style={styles.tableCellHeader}>Ouvrage</Text></View>
              <View style={{ width: '10%' }}><Text style={styles.tableCellHeader}>Code</Text></View>
              <View style={{ width: '10%' }}><Text style={styles.tableCellHeader}>En stock</Text></View>
              <View style={{ width: '15%' }}><Text style={styles.tableCellHeader}>Livré (Fourn.)</Text></View>
              <View style={{ width: '10%' }}><Text style={styles.tableCellHeader}>Vendu</Text></View>
              <View style={{ width: '10%' }}><Text style={styles.tableCellHeader}>En dépôt</Text></View>
            </View>
            {section.books.map((book, idx) => (
              <View key={idx} style={styles.tableRow} wrap={false}>
                <View style={{ width: '30%' }}><Text style={styles.tableCell}>{book.titre}</Text></View>
                <View style={{ width: '10%' }}><Text style={styles.tableCell}>{book.code}</Text></View>
                <View style={{ width: '10%' }}><Text style={styles.tableCell}>{book.stock}</Text></View>
                <View style={{ width: '15%' }}><Text style={styles.tableCell}>{book.livraison}</Text></View>
                <View style={{ width: '10%' }}><Text style={styles.tableCell}>{book.vente}</Text></View>
                <View style={{ width: '10%' }}><Text style={styles.tableCell}>{book.depot}</Text></View>
              </View>
            ))}
            <View style={[styles.tableRow, styles.totalRow]}>
              <View style={{ width: '40%' }}><Text style={[styles.tableCell, { fontWeight: 'bold', textTransform: 'uppercase' }]}>Total {section.category}</Text></View>
              <View style={{ width: '10%' }}><Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{section.books.reduce((s, b) => s + b.stock, 0)}</Text></View>
              <View style={{ width: '15%' }}><Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{section.books.reduce((s, b) => s + b.livraison, 0)}</Text></View>
              <View style={{ width: '10%' }}><Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{section.books.reduce((s, b) => s + b.vente, 0)}</Text></View>
              <View style={{ width: '10%' }}><Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{section.books.reduce((s, b) => s + b.depot, 0)}</Text></View>
            </View>
          </View>
        </View>
      ))}

      {summaryRows.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Synthèse Financière</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]} fixed>
              <View style={{ width: '40%' }}><Text style={styles.tableCellHeader}>Indicateur</Text></View>
              <View style={{ width: '20%' }}><Text style={styles.tableCellHeader}>Débit (DH)</Text></View>
              <View style={{ width: '20%' }}><Text style={styles.tableCellHeader}>Crédit (DH)</Text></View>
              <View style={{ width: '20%' }}><Text style={styles.tableCellHeader}>Net (DH)</Text></View>
            </View>
            {summaryRows.map((row, idx) => (
              <View key={idx} style={styles.tableRow} wrap={false}>
                <View style={{ width: '40%' }}><Text style={styles.tableCell}>{row.compte}</Text></View>
                <View style={{ width: '20%' }}><Text style={styles.tableCell}>{row.debit > 0 ? currencyFormat(row.debit) : '—'}</Text></View>
                <View style={{ width: '20%' }}><Text style={styles.tableCell}>{row.credit > 0 ? currencyFormat(row.credit) : '—'}</Text></View>
                <View style={{ width: '20%' }}><Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{currencyFormat(row.solde)}</Text></View>
              </View>
            ))}
          </View>
        </View>
      )}
    </PdfPageLayout>
  </Document>
);

export default BalancePdf;
