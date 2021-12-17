import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import { readData } from '../components/FirebaseApi'

//const tempData = readData('users', '');
//console.log('--------------------------- TESTDATA START ------------------------\n');
//console.log('--------------------------- TESTDATA END ------------------------');

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGLQhaeGfO3ojdXQh7W5Oh25mocJZ3YDNxuA&usqp=CAU',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
    imageUrl: 'https://cdn.nettiauto.com/live/2021/05/21/f3ffec9ff10dbd5c-medium.jpg',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
    imageUrl: 'https://cdn.nettivene.com/live/2021/09/16/396776437f288cf9-large.jpg',
  },
];
//console.log(DATA);

const Item = ({ title, img }) => (
  <View style={styles.item}>
    <View style={{flex: 1, flexDirection: 'column', paddingRight: 10,}}>
      <Image
        source={{
          uri: `${img}`
        }}
        style={{
          height: 100,
          resizeMode: 'contain'}}
      />
    </View>
    <View style={{flex: 1, paddingLeft: 10, flexDirection: 'column'}}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.basic}>This is a basic description of the item with some short text.</Text>
      <Text style={styles.basic}></Text>
      <Text style={styles.basic}>Value in euros €</Text>
      <Text style={styles.basic}>Monthly upkeep in euros €</Text>
      <Text style={styles.basic}>Guarantee info: x years</Text>
    </View>
  </View>
);

const Assets = (props) => {
  const renderItem = ({ item }) => <Item
    title={item.title}
    img={item.imageUrl}
  />;
  return (
    <View style={styles.container}>
      <FlatList data={DATA} renderItem={renderItem} keyExtractor={item => item.id} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    textAlign: 'center',
    alignContent: 'center',
  },
  item: {
    backgroundColor: 'white',
    padding: 5,
    marginVertical: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
  },
  title: {
    fontSize: 20,
    textAlign: 'left',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  basic: {
    fontSize: 10,
    textAlign: 'left',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

export default Assets;