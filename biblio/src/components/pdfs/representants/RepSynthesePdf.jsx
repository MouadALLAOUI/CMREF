import React from 'react';
import { Document, Text, View, StyleSheet } from '@react-pdf/renderer';
import PdfPageLayout from '../../template/pdfs/PdfPageLayout';
import { currencyFormat } from '../../../lib/utilities';

const styles = StyleSheet.create({
  title: { fontSize: 14, marginBottom: 8, textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' },
  subtitle: { fontSize: 9, marginBottom: 12, textAlign: 'center', color: '#6b7280' },
  sectionTitle: { fontSize: 10, marginBottom: 6, fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: '#eff6ff', padding: 4, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  table: { display: 'table', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 12 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', minHeight: 20, alignItems: 'center' },
  tableHeader: { backgroundColor: '#1e40af' },
  tableCellHeader: { color: '#ffffff', fontSize: 7, fontWeight: 'bold', padding: 3 },
  tableCell: { fontSize: 7, padding: 3, color: '#374151' },
  totalRow: { backgroundColor: '#eff6ff', borderTopWidth: 1, borderTopColor: '#93c5fd', minHeight: 22 },
  kpiSection: { marginBottom: 10, padding: 6, backgroundColor: '#eff6ff', borderRadius: 4, borderLeftWidth: 3, borderLeftColor: '#3b82f6' },
  kpiRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  kpiLabel: { fontSize: 8, color: '#374151' },
  kpiValue: { fontSize: 8, fontWeight: 'bold' },
});

const RepSynthesePdf = ({ title, categoryData, kpis, repName }) => (
  <Document>
    <PdfPageLayout orientation="landscape">
      <Text style={styles.title}>{title}</Text>
      {repName && <Text style={styles.subtitle}>Représentant : {repName}</Text>}

      <View style={styles.kpiSection}>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Crédit :</Text>
          <Text style={[styles.kpiValue, { color: '#2563eb' }]}>{currencyFormat(kpis.credit)}</Text>
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Avance :</Text>
          <Text style={[styles.kpiValue, { color: '#059669' }]}>{currencyFormat(kpis.avance)}</Text>
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Reste :</Text>
          <Text style={[styles.kpiValue, { color: '#dc2626' }]}>{currencyFormat(kpis.reste)}</Text>
        </View>
        <View style={styles.kpiRow}>
          <Text style={styles.kpiLabel}>Recouvrement :</Text>
          <Text style={[styles.kpiValue, { color: '#d97706' }]}>{kpis.recouvrement}%</Text>
        </View>
      </View>

      {categoryData.map((group, gIdx) => (
        <View key={gIdx} style={{ marginBottom: 12 }}>
          <Text style={styles.sectionTitle}>Catégorie : {group.categoryName}</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]} fixed>
              <View style={{ width: '15%' }}><Text style={styles.tableCellHeader}>Type</Text></View>
              <View style={{ width: '15%' }}><Text style={styles.tableCellHeader}>Sous-type</Text></View>
              {group.books.map((book, i) => (
                <View key={i} style={{ width: `${Math.floor(60 / Math.max(group.books.length, 1))}%` }}>
                  <Text style={styles.tableCellHeader}>{book.code}</Text>
                </View>
              ))}
            </View>
            <View style={styles.tableRow}>
              <View style={{ width: '15%' }}><Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Livraison</Text></View>
              <View style={{ width: '15%' }}><Text style={styles.tableCell}>Livre</Text></View>
              {group.books.map((book, i) => (
                <View key={i} style={{ width: `${Math.floor(60 / Math.max(group.books.length, 1))}%` }}>
                  <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{book.livraison}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      ))}
    </PdfPageLayout>
  </Document>
);

export default RepSynthesePdf;
