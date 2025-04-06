import { ref, set, update, remove, push, get } from 'firebase/database';
import { database } from './database/FirebaseConfig';
import { getStorage, ref as storageRef, getDownloadURL, deleteObject } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './database/FirebaseConfig';

// Initialize the Realtime Database instance
const db = database;

// Initialize Firebase Storage
const storage = getStorage();

/**
 * Fetch user data from the Realtime Database
 * @param uid - The user's unique ID
 * @returns The user data as an object
 */
export const fetchUserData = async (uid: string): Promise<any> => {
  try {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error('User data not found');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

/**
 * Delete an item from the database and, if applicable, its associated files from storage.
 * @param userUID - The user's unique ID
 * @param itemType - The type of item to delete (e.g., 'assets', 'events')
 * @param itemId - The ID of the item to delete
 */
export const deleteItem = async (userUID: string, itemType: string, itemId: string) => {
  try {
    const itemRef = ref(db, `users/${userUID}/${itemType}/${itemId}`);

    if (itemType === 'assets') {
      // Fetch the asset data to get the files array
      const snapshot = await get(itemRef);
      if (snapshot.exists()) {
        const assetData = snapshot.val();
        const files = assetData.files || [];
        for (const file of files) {
          const fileRef = storageRef(storage, file.path);
          await deleteObject(fileRef);
        }
      }
    }

    // Remove the item from the database
    await remove(itemRef);
  } catch (error) {
    console.error(`Error deleting ${itemType}:`, error);
    throw error;
  }
};

/**
 * Upload a file from the user's device to Firebase Storage
 * @param fileUri - The URI of the file to upload
 * @param fileName - The name of the file
 * @param uid - The user's unique ID
 * @param objectPath - The path where the file will be stored
 * @returns The download URL of the uploaded file
 */
export const uploadFile = async (fileUri: string, fileName: string, uid: string, objectPath: string) => {
  try {
    // Verify the file exists
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      throw new Error(`File does not exist at ${fileUri}`);
    }
    console.log(`Object Path: ${objectPath}`);
    console.log(`File Name: ${fileName}`);
    objectPath = objectPath + '/' + fileName;

    // Create a reference to the file in Firebase Storage
    const fileRef = storageRef(storage, `${objectPath}`);

    // Read the file as Base64
    const fileData = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert Base64 to Uint8Array for binary upload
    const binaryData = Uint8Array.from(atob(fileData), (char) => char.charCodeAt(0));

    // Get the current user's ID token for authentication
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User is not authenticated');
    } else if (user.uid !== uid) {
      throw new Error('User ID does not match the authenticated user');
    }
    const idToken = await user.getIdToken();
    console.log(`original filepath: ${fileUri} encoded uri: ${encodeURIComponent(objectPath)}`);

    // Construct the upload URL with uploadType and name parameters
    const bucket = firebaseConfig.storageBucket;
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(
      objectPath
    )}`;

    // Upload the file using fetch with POST
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
        'Content-Type': 'image/jpeg',
        'Content-Length': binaryData.byteLength.toString(),
      },
      body: binaryData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }

    // Get the download URL
    const downloadURL = await getDownloadURL(fileRef);

    return downloadURL;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error uploading file:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
    throw error;
  }
};

// Add a new user with the provided UID and data
export const addUser = async (uid: string, userData: any) => {
  try {
    await set(ref(db, `users/${uid}`), userData);
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

// Update user data for the specified UID
export const updateUser = async (uid: string, userData: any) => {
  try {
    await update(ref(db, `users/${uid}`), userData);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Remove a user by UID (basic removal)
export const removeUser = async (uid: string) => {
  try {
    await remove(ref(db, `users/${uid}`));
  } catch (error) {
    console.error('Error removing user:', error);
    throw error;
  }
};

// Add an event under a user, returning the generated event ID
export const addUserEvent = async (uid: string, eventData: any) => {
  try {
    const eventRef = ref(db, `users/${uid}/events`);
    const newEventRef = push(eventRef);
    await set(newEventRef, eventData);
    return newEventRef.key;
  } catch (error) {
    console.error('Error adding user event:', error);
    throw error;
  }
};

// Update a specific user event
export const updateUserEvent = async (uid: string, eventId: string, eventData: any) => {
  try {
    await update(ref(db, `users/${uid}/events/${eventId}`), eventData);
  } catch (error) {
    console.error('Error updating user event:', error);
    throw error;
  }
};

// Remove a specific user event
export const removeUserEvent = async (uid: string, eventId: string) => {
  try {
    await remove(ref(db, `users/${uid}/events/${eventId}`));
  } catch (error) {
    console.error('Error removing user event:', error);
    throw error;
  }
};

// Remove a user completely, including their assets access
export const removeUserCompletely = async (uid: string) => {
  try {
    // Fetch asset IDs from userAssets
    const userAssetsRef = ref(db, `userAssets/${uid}`);
    const snapshot = await get(userAssetsRef);
    const assetIds = snapshot.exists() ? Object.keys(snapshot.val()) : [];

    // Prepare multi-path updates
    const updates: { [key: string]: null } = {};
    updates[`users/${uid}`] = null;
    updates[`userAssets/${uid}`] = null;
    for (const assetId of assetIds) {
      updates[`assetShares/${assetId}/${uid}`] = null;
    }
    await update(ref(db), updates);
  } catch (error) {
    console.error('Error removing user completely:', error);
    throw error;
  }
};

/**
 * Asset-related functions
 */

export const addAsset = async (assetId: string, assetData: any) => {
  try {
    await set(ref(db, `assets/${assetId}`), assetData);
  } catch (error) {
    console.error('Error adding asset:', error);
    throw error;
  }
};

export const updateAsset = async (assetId: string, assetData: any) => {
  try {
    await update(ref(db, `assets/${assetId}`), assetData);
  } catch (error) {
    console.error('Error updating asset:', error);
    throw error;
  }
};

export const removeAsset = async (assetId: string) => {
  try {
    await remove(ref(db, `assets/${assetId}`));
  } catch (error) {
    console.error('Error removing asset:', error);
    throw error;
  }
};

export const addAssetEvent = async (assetId: string, eventData: any) => {
  try {
    const eventRef = ref(db, `assets/${assetId}/events`);
    const newEventRef = push(eventRef);
    await set(newEventRef, eventData);
    return newEventRef.key;
  } catch (error) {
    console.error('Error adding asset event:', error);
    throw error;
  }
};

export const updateAssetEvent = async (assetId: string, eventId: string, eventData: any) => {
  try {
    await update(ref(db, `assets/${assetId}/events/${eventId}`), eventData);
  } catch (error) {
    console.error('Error updating asset event:', error);
    throw error;
  }
};

export const removeAssetEvent = async (assetId: string, eventId: string) => {
  try {
    await remove(ref(db, `assets/${assetId}/events/${eventId}`));
  } catch (error) {
    console.error('Error removing asset event:', error);
    throw error;
  }
};

export const addAssetFile = async (assetId: string, fileData: any) => {
  try {
    const fileRef = ref(db, `assets/${assetId}/files`);
    const newFileRef = push(fileRef);
    await set(newFileRef, fileData);
    return newFileRef.key;
  } catch (error) {
    console.error('Error adding asset file:', error);
    throw error;
  }
};

export const updateAssetFile = async (assetId: string, fileId: string, fileData: any) => {
  try {
    await update(ref(db, `assets/${assetId}/files/${fileId}`), fileData);
  } catch (error) {
    console.error('Error updating asset file:', error);
    throw error;
  }
};

export const removeAssetFile = async (assetId: string, fileId: string) => {
  try {
    await remove(ref(db, `assets/${assetId}/files/${fileId}`));
  } catch (error) {
    console.error('Error removing asset file:', error);
    throw error;
  }
};

export const removeAssetCompletely = async (assetId: string) => {
  try {
    const assetSharesRef = ref(db, `assetShares/${assetId}`);
    const snapshot = await get(assetSharesRef);
    const uids = snapshot.exists() ? Object.keys(snapshot.val()) : [];

    const updates: { [key: string]: null } = {};
    updates[`assets/${assetId}`] = null;
    updates[`assetShares/${assetId}`] = null;
    for (const uid of uids) {
      updates[`userAssets/${uid}/${assetId}`] = null;
    }
    await update(ref(db), updates);
  } catch (error) {
    console.error('Error removing asset completely:', error);
    throw error;
  }
};

/**
 * Service Provider-related functions
 */

export const addServiceProvider = async (spId: string, spData: any) => {
  try {
    await set(ref(db, `serviceProviders/${spId}`), spData);
  } catch (error) {
    console.error('Error adding service provider:', error);
    throw error;
  }
};

export const updateServiceProvider = async (spId: string, spData: any) => {
  try {
    await update(ref(db, `serviceProviders/${spId}`), spData);
  } catch (error) {
    console.error('Error updating service provider:', error);
    throw error;
  }
};

export const removeServiceProvider = async (spId: string) => {
  try {
    await remove(ref(db, `serviceProviders/${spId}`));
  } catch (error) {
    console.error('Error removing service provider:', error);
    throw error;
  }
};

/**
 * Service-related functions
 */

export const addService = async (serviceId: string, serviceData: any) => {
  try {
    await set(ref(db, `services/${serviceId}`), serviceData);
  } catch (error) {
    console.error('Error adding service:', error);
    throw error;
  }
};

export const updateService = async (serviceId: string, serviceData: any) => {
  try {
    await update(ref(db, `services/${serviceId}`), serviceData);
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

export const removeService = async (serviceId: string) => {
  try {
    await remove(ref(db, `services/${serviceId}`));
  } catch (error) {
    console.error('Error removing service:', error);
    throw error;
  }
};

/**
 * Asset Access-related functions
 */

export const grantAssetAccess = async (uid: string, assetId: string, permission: string) => {
  try {
    const updates: { [key: string]: string } = {};
    updates[`userAssets/${uid}/${assetId}`] = permission;
    updates[`assetShares/${assetId}/${uid}`] = permission;
    await update(ref(db), updates);
  } catch (error) {
    console.error('Error granting asset access:', error);
    throw error;
  }
};

export const updateAssetAccess = async (uid: string, assetId: string, permission: string) => {
  try {
    const updates: { [key: string]: string } = {};
    updates[`userAssets/${uid}/${assetId}`] = permission;
    updates[`assetShares/${assetId}/${uid}`] = permission;
    await update(ref(db), updates);
  } catch (error) {
    console.error('Error updating asset access:', error);
    throw error;
  }
};

export const revokeAssetAccess = async (uid: string, assetId: string) => {
  try {
    const updates: { [key: string]: null } = {};
    updates[`userAssets/${uid}/${assetId}`] = null;
    updates[`assetShares/${assetId}/${uid}`] = null;
    await update(ref(db), updates);
  } catch (error) {
    console.error('Error revoking asset access:', error);
    throw error;
  }
};

/**
 * Add an entry to the audit log under the user's data
 * @param uid - The user's unique ID
 * @param logEntry - The log entry data
 * @returns The Firebase-generated key for the log entry
 */
export const addAuditLogEntry = async (uid: string, logEntry: any): Promise<string | null> => {
  try {
    const auditLogRef = ref(db, `users/${uid}/auditLog`);
    const newLogRef = push(auditLogRef);
    await set(newLogRef, logEntry);
    return newLogRef.key;
  } catch (error) {
    console.error('Error adding audit log entry:', error);
    throw error;
  }
};