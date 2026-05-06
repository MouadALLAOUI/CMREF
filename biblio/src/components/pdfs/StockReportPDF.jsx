import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import PdfPageLayout from '../template/pdfs/PdfPageLayout';

// Create styles mimicking your screenshots
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  titleContainer: { textAlign: 'center', marginBottom: 20 },
  title: { fontSize: 24, marginBottom: 5 },
  subtitle: { fontSize: 24 },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  tableRow: { flexDirection: 'row' },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#38bdf8' }, // Tailwind light blue

  // Zone Columns (4 cols)
  colZone: { width: '25%', borderStyle: 'solid', borderWidth: 1, borderColor: '#e5e7eb', padding: 8 },

  // Global Columns (6 cols)
  colGlobalLivre: { width: '10%', borderStyle: 'solid', borderWidth: 1, borderColor: '#e5e7eb', padding: 8 },
  colGlobalLarge: { width: '22.5%', borderStyle: 'solid', borderWidth: 1, borderColor: '#e5e7eb', padding: 8 },
  colGlobalSmall: { width: '15%', borderStyle: 'solid', borderWidth: 1, borderColor: '#e5e7eb', padding: 8 },

  textHeader: { margin: 'auto', fontSize: 10, fontWeight: 'bold', color: '#4b5563' },
  textCell: { margin: 'auto', fontSize: 10, color: '#374151' }
});

const StockReportPDF = ({ destinationName, groupedData }) => {
  const isGlobal = !destinationName || destinationName === "MSM-Medias";

  return (
    <Document>
      {groupedData.map((categoryGroup, index) => (
        <PdfPageLayout key={index} size="A4" orientation="landscape">
          {/* Header specific to this category's page */}
          <View style={styles.titleContainer}>
            {isGlobal ? (
              <>
                <Text style={styles.title}>Categorie : {categoryGroup.categoryName}</Text>
                <Text style={styles.subtitle}>Année : 26/27</Text>
              </>
            ) : (
              <>
                <Text style={styles.title}>Zone : {destinationName}</Text>
                <Text style={styles.subtitle}>Categorie : {categoryGroup.categoryName}</Text>
              </>
            )}
          </View>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeaderRow}>
              {isGlobal ? (
                <>
                  <View style={styles.colGlobalLivre}><Text style={styles.textHeader}>Livre</Text></View>
                  <View style={styles.colGlobalLarge}><Text style={styles.textHeader}>Stock de départ</Text></View>
                  <View style={styles.colGlobalLarge}><Text style={styles.textHeader}>Stock actuel</Text></View>
                  <View style={styles.colGlobalSmall}><Text style={styles.textHeader}>Livraison</Text></View>
                  <View style={styles.colGlobalSmall}><Text style={styles.textHeader}>Spécimen</Text></View>
                  <View style={styles.colGlobalSmall}><Text style={styles.textHeader}>Rejet</Text></View>
                </>
              ) : (
                <>
                  <View style={styles.colZone}><Text style={styles.textHeader}>Livre</Text></View>
                  <View style={styles.colZone}><Text style={styles.textHeader}>Achat</Text></View>
                  <View style={styles.colZone}><Text style={styles.textHeader}>Vente</Text></View>
                  <View style={styles.colZone}><Text style={styles.textHeader}>Stock</Text></View>
                </>
              )}
            </View>

            {/* Loop through the books ONLY for this specific category */}
            {categoryGroup.books.map((row, idx) => (
              <View style={styles.tableRow} key={idx}>
                {isGlobal ? (
                  <>
                    <View style={styles.colGlobalLivre}><Text style={styles.textCell}>{row.livre}</Text></View>
                    <View style={styles.colGlobalLarge}><Text style={styles.textCell}>{row.stockDepart || ''}</Text></View>
                    <View style={styles.colGlobalLarge}><Text style={styles.textCell}>{row.stock}</Text></View>
                    <View style={styles.colGlobalSmall}><Text style={styles.textCell}>{row.livraison}</Text></View>
                    <View style={styles.colGlobalSmall}><Text style={styles.textCell}>{row.specimen}</Text></View>
                    <View style={styles.colGlobalSmall}><Text style={styles.textCell}>{row.rejet}</Text></View>
                  </>
                ) : (
                  <>
                    <View style={styles.colZone}><Text style={styles.textCell}>{row.livre}</Text></View>
                    <View style={styles.colZone}><Text style={styles.textCell}>{row.achat}</Text></View>
                    <View style={styles.colZone}><Text style={styles.textCell}>{row.vente}</Text></View>
                    <View style={styles.colZone}><Text style={styles.textCell}>{row.stock}</Text></View>
                  </>
                )}
              </View>
            ))}
          </View>
        </PdfPageLayout>
      ))}
    </Document>
  );
};

export default StockReportPDF;