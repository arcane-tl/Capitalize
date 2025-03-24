import React, { useEffect, useState } from 'react';
import * as firebase from 'firebase/app';
import * as fireauth from 'firebase/auth';
import * as firedata from 'firebase/database';
import { firebaseConfig } from '../database/firebaseConfig';
firebase.initializeApp(firebaseConfig)

const serverUrl = 'https://capitalize-39317-default-rtdb.europe-west1.firebasedatabase.app/logins/';
const auth = fireauth.getAuth();
const user = auth.currentUser;
//console.log('Current Firebase user: ', user);

const currentDB = firedata.getDatabase();
const dbRef = firedata.ref(currentDB);

export function updateData(path, key, value) {
  console.log('Writing data to firebase database: ', dbRef);
  console.log('Writing key to firebase: ', key);
  console.log('Writing value to firebase: ', value);

  let timestamp = new Date();
  let data = {[timestamp]: {[key]: value}};
  console.log('timestamp: ', timestamp);

  firedata.update(firedata.child(dbRef, `${path}`), data);
}

export const readData = async (path, key) => {
  console.log('Running read data from Firebase.')
  const [data, setData] = useState([]);

  useEffect(() => {
    firedata.get(firedata.child(dbRef, `${path}/${key}`)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        snapshot.forEach((item) => {
          const tempData = item.val();
          console.log('DATA: ', tempData)
          setData([...data, tempData]);
        });
      } else {
        console.log("ERROR readData: No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }, []);
}

export function addData(path, key, value) {
  console.log('Replacing data in firebase database: ', dbRef);
  console.log('Replacing key: ', key, ' value with: ', value);

  let data = {[key]: value};

  firedata.set(firedata.child(dbRef, `${path}`), data);
}