import { ref, set, update, remove, push, get } from 'firebase/database';
import { database } from './database/firebaseConfig';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { setLogLevel } from 'firebase/app';
import * as FileSystem from 'expo-file-system';
import { getAuth } from 'firebase/auth';

// Enable Firebase debug logging
setLogLevel('debug');

// Initialize the Realtime Database instance
const db = database;

// Initialize Firebase Storage
const storage = getStorage();
storage.maxUploadRetryTime = 600000;

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
      return snapshot.val(); // Return the user data
    } else {
      throw new Error('User data not found');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

/**
 * Upload a file from the user's device to Firebase Storage
 * @param fileUri - The URI of the file to upload
 * @param fileName - The name of the file
 * @param uid - The user's unique ID
 * @returns The download URL of the uploaded file
 */
export const uploadFile = async (fileUri: string, fileName: string, uid: string) => {
  try {
    // Verify the file exists
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      throw new Error(`File does not exist at ${fileUri}`);
    }

    // Create a reference to the file in Firebase Storage (for download URL later)
    const fileRef = storageRef(storage, `uploads/${uid}/${fileName}`);

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
    }
    const idToken = await user.getIdToken();

    // Construct the upload URL with uploadType and name parameters
    const bucket = fileRef.bucket;
    const objectPath = `uploads/${uid}/${fileName}`;
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(objectPath)}`;

    // Upload the file using fetch with POST
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'image/jpeg', // MIME type for JPEG images
        'Content-Length': binaryData.byteLength.toString(), // Size of the binary data
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
      console.error('Error fetching user data:', error.message);
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
    return newEventRef.key; // Return the Firebase-generated key
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

// Add a new asset with the provided ID and data
export const addAsset = async (assetId: string, assetData: any) => {
  try {
    await set(ref(db, `assets/${assetId}`), assetData);
  } catch (error) {
    console.error('Error adding asset:', error);
    throw error;
  }
};

// Update asset data for the specified ID
export const updateAsset = async (assetId: string, assetData: any) => {
  try {
    await update(ref(db, `assets/${assetId}`), assetData);
  } catch (error) {
    console.error('Error updating asset:', error);
    throw error;
  }
};

// Remove an asset by ID (basic removal)
export const removeAsset = async (assetId: string) => {
  try {
    await remove(ref(db, `assets/${assetId}`));
  } catch (error) {
    console.error('Error removing asset:', error);
    throw error;
  }
};

// Add an event under an asset, returning the generated event ID
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

// Update a specific asset event
export const updateAssetEvent = async (assetId: string, eventId: string, eventData: any) => {
  try {
    await update(ref(db, `assets/${assetId}/events/${eventId}`), eventData);
  } catch (error) {
    console.error('Error updating asset event:', error);
    throw error;
  }
};

// Remove a specific asset event
export const removeAssetEvent = async (assetId: string, eventId: string) => {
  try {
    await remove(ref(db, `assets/${assetId}/events/${eventId}`));
  } catch (error) {
    console.error('Error removing asset event:', error);
    throw error;
  }
};

// Add a file under an asset, returning the generated file ID
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

// Update a specific asset file
export const updateAssetFile = async (assetId: string, fileId: string, fileData: any) => {
  try {
    await update(ref(db, `assets/${assetId}/files/${fileId}`), fileData);
  } catch (error) {
    console.error('Error updating asset file:', error);
    throw error;
  }
};

// Remove a specific asset file
export const removeAssetFile = async (assetId: string, fileId: string) => {
  try {
    await remove(ref(db, `assets/${assetId}/files/${fileId}`));
  } catch (error) {
    console.error('Error removing asset file:', error);
    throw error;
  }
};

// Remove an asset completely, including shares and user access
export const removeAssetCompletely = async (assetId: string) => {
  try {
    // Fetch UIDs from assetShares
    const assetSharesRef = ref(db, `assetShares/${assetId}`);
    const snapshot = await get(assetSharesRef);
    const uids = snapshot.exists() ? Object.keys(snapshot.val()) : [];

    // Prepare multi-path updates
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

// Add a new service provider with the provided ID and data
export const addServiceProvider = async (spId: string, spData: any) => {
  try {
    await set(ref(db, `serviceProviders/${spId}`), spData);
  } catch (error) {
    console.error('Error adding service provider:', error);
    throw error;
  }
};

// Update service provider data for the specified ID
export const updateServiceProvider = async (spId: string, spData: any) => {
  try {
    await update(ref(db, `serviceProviders/${spId}`), spData);
  } catch (error) {
    console.error('Error updating service provider:', error);
    throw error;
  }
};

// Remove a service provider by ID
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

// Add a new service with the provided ID and data
export const addService = async (serviceId: string, serviceData: any) => {
  try {
    await set(ref(db, `services/${serviceId}`), serviceData);
  } catch (error) {
    console.error('Error adding service:', error);
    throw error;
  }
};

// Update service data for the specified ID
export const updateService = async (serviceId: string, serviceData: any) => {
  try {
    await update(ref(db, `services/${serviceId}`), serviceData);
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

// Remove a service by ID
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

// Grant access to an asset for a user
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

// Update access permission for a user's asset
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

// Revoke access to an asset for a user
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
 * @param logEntry - The log entry data (e.g., { name: 'Logout', time: 'timestamp', status: 'success' })
 * @returns The Firebase-generated key for the log entry
 */
export const addAuditLogEntry = async (uid: string, logEntry: any): Promise<string | null> => {
  try {
    const auditLogRef = ref(db, `users/${uid}/auditLog`);
    const newLogRef = push(auditLogRef); // Create a new entry in the audit log
    await set(newLogRef, logEntry); // Save the log entry data
    return newLogRef.key; // Return the Firebase-generated key
  } catch (error) {
    console.error('Error adding audit log entry:', error);
    throw error;
  }
};