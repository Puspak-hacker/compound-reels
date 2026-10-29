import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, FlatList, ActivityIndicator } from 'react-native';

const { height, width } = Dimensions.get('window');

// Popular PubChem CIDs
const CIDS = [224, 2519, 2244, 5793, 702, 1183, 962, 1983, 6322];

export default function App() {
  const [compounds, setCompounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompounds();
  }, []);

  const fetchCompounds = async () => {
    try {
      const response = await fetch(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${CIDS.join(',')}/property/IUPACName,MolecularFormula,MolecularWeight/JSON`
      );
      const data = await response.json();
      const items = data.PropertyTable.Properties.map(item => ({
        cid: item.CID,
        name: item.IUPACName || 'Unknown',
        formula: item.MolecularFormula || 'N/A',
        weight: item.MolecularWeight || 'N/A',
        image: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${item.CID}/PNG?image_size=large`
      }));
      setCompounds(items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00ffff" />
      </View>
    );
  }

  return (
    <FlatList
      data={compounds}
      pagingEnabled
      decelerationRate="fast"
      snapToInterval={height}
      keyExtractor={(item) => item.cid.toString()}
      renderItem={({ item }) => (
        <View style={styles.reelContainer}>
          <View style={styles.imageCard}>
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
          </View>
          <View style={styles.metaContainer}>
            <Text style={styles.cid}>CID: {item.cid}</Text>
            <Text style={styles.formula}>{item.formula}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.weight}>Mol. Wt: {item.weight} g/mol</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  reelContainer: {
    width: width,
    height: height,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  imageCard: {
    width: width * 0.85,
    height: height * 0.45,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10
  },
  image: {
    width: '100%',
    height: '100%'
  },
  metaContainer: {
    position: 'absolute',
    bottom: 50,
    left: 25,
    right: 25
  },
  cid: {
    color: '#00ffff',
    fontWeight: 'bold',
    fontSize: 14
  },
  formula: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 32,
    marginVertical: 4
  },
  name: {
    color: '#ccc',
    fontSize: 14
  },
  weight: {
    color: '#ffdd00',
    marginTop: 6,
    fontSize: 12
  }
});