import { getDatabase, ref, set, update, remove, push, get } from 'firebase/database';
import { database } from './database/firebaseConfig';

// Initialize the Realtime Database instance
const db = getDatabase(database);

/**
 * User-related functions
 */

/**
 * Check if a user exists in the Realtime Database
 * @param uid - The user's unique ID
 * @returns A boolean indicating whether the user exists
 */
export const checkUserExists = async (uid: string): Promise<boolean> => {
  try {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    return snapshot.exists(); // Returns true if user data exists, false otherwise
  } catch (error) {
    console.error('Error checking if user exists:', error);
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