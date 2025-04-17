import { ref, set, update, remove, push, get } from 'firebase/database';
import { StorageReference, getStorage, ref as storageRef, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';
import { getAuth } from 'firebase/auth';
import { firebaseConfig, database } from '@/components/database/FirebaseConfig';

// Initialize the Realtime Database instance
const db = database;

// Initialize Firebase Storage
const storage = getStorage();

/**
 * Recursively delete all files and subfolders under a given storage reference.
 * @param folderRef - The storage reference to the folder to delete.
 */
const deleteStorageFolderRecursively = async (folderRef: StorageReference) => {
  try {
    const listResult = await listAll(folderRef);
    await Promise.all(listResult.items.map((itemRef) => deleteObject(itemRef)));
    await Promise.all(listResult.prefixes.map((prefixRef) => deleteStorageFolderRecursively(prefixRef)));
  } catch (error) {
    console.error('Error deleting storage folder:', error);
    throw error;
  }
};

/**
 * Fetch a specific asset from the Realtime Database
 * @param uid - The user's unique ID
 * @param assetId - The asset's unique ID
 * @returns The asset data as an object
 */
export const fetchAssetData = async (uid: string, assetId: string): Promise<any> => {
  try {
    const assetRef = ref(db, `users/${uid}/assets/${assetId}`);
    const snapshot = await get(assetRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error('Asset not found');
    }
  } catch (error) {
    console.error('Error fetching asset data:', error);
    throw error;
  }
};

/**
 * Fetch the list of asset categories from the Realtime Database
 * @returns An array of category names
 */
export const fetchAssetCategories = async (): Promise<string[]> => {
  try {
    const categoriesRef = ref(db, 'assetCategories');
    const snapshot = await get(categoriesRef);
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching asset categories:', error);
    throw error;
  }
};

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
      const snapshot = await get(itemRef);
      if (snapshot.exists()) {
        const assetData = snapshot.val();
        const files = assetData.files || {};
        const fileList = Array.isArray(files) ? files : Object.values(files);
        for (const file of fileList) {
          const fileRef = storageRef(storage, file.path);
          await deleteObject(fileRef);
        }
      }
    }

    console.log(`Deleting ${itemType} with ID: ${itemId}`);
    await remove(itemRef);
  } catch (error) {
    console.error(`Error deleting ${itemType}:`, error);
    throw error;
  }
};

/**
 * Delete an item from the database and recursively delete all associated files and subfolders from storage.
 * @param userUID - The user's unique ID
 * @param itemType - The type of item to delete (e.g., 'assets')
 * @param itemId - The ID of the item to delete
 */
export const deleteItemRecursively = async (userUID: string, itemType: string, itemId: string) => {
  try {
    const itemRef = ref(db, `users/${userUID}/${itemType}/${itemId}`);

    if (itemType === 'assets') {
      // Delete the entire storage directory for the asset
      const assetFolderRef = storageRef(storage, `users/${userUID}/assets/${itemId}/`);
      console.log(`Deleting storage folder: ${assetFolderRef}`);
      await deleteStorageFolderRecursively(assetFolderRef);
    }

    // Remove the item from the database
    console.log(`Recursively deleting ${itemType} with ID: ${itemId}`);
    await remove(itemRef);
  } catch (error) {
    console.error(`Error deleting ${itemType} recursively:`, error);
    throw error;
  }
};

/**
 * Upload a file from the user's device to Firebase Storage and optionally add its metadata to the asset's files in the database.
 * @param fileUri - The URI of the file to upload
 * @param fileName - The name of the file
 * @param uid - The user's unique ID
 * @param objectPath - The path where the file will be stored
 * @param fileType - (Optional) The MIME type of the file
 * @param assetId - (Optional) The asset's unique ID to add the file metadata to
 * @param addToDatabase - (Optional) Whether to add the file metadata to the database
 * @returns An object containing the download URL and, if added to the database, the file ID and file data
 */
export const uploadFile = async (
  fileUri: string,
  fileName: string,
  uid: string,
  objectPath: string,
  fileType: string | null = null,
  assetId?: string,
  addToDatabase: boolean = false
): Promise<{
  downloadURL: string;
  fileId?: string;
  fileData?: any;
}> => {
  try {
    console.log(`Starting upload for file: ${fileName}`);

    // Check if file exists
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      throw new Error(`File does not exist at ${fileUri}`);
    }
    console.log(`File confirmed at ${fileUri}`);

    const fullPath = `${objectPath}/${fileName}`;
    console.log(`Storage path: ${fullPath}`);

    // Reference to Firebase Storage
    const fileRef = storageRef(storage, fullPath);

    // Read file as Base64
    const fileData = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log(`File read as Base64`);

    // Convert Base64 to binary
    const binaryData = Uint8Array.from(atob(fileData), (char) => char.charCodeAt(0));

    // Authenticate user
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || user.uid !== uid) {
      throw new Error('User authentication failed');
    }
    const idToken = await user.getIdToken();
    console.log(`User authenticated, ID token obtained`);

    // Prepare upload URL
    const bucket = firebaseConfig.storageBucket;
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(fullPath)}`;

    // Upload file
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
        ...(fileType ? { 'Content-Type': fileType } : {}),
        'Content-Length': binaryData.byteLength.toString(),
      },
      body: binaryData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Storage upload failed: ${response.status} - ${errorText}`);
    }
    console.log(`File uploaded to Storage`);

    // Get download URL
    const downloadURL = await getDownloadURL(fileRef);
    console.log(`Download URL: ${downloadURL}`);

    // Add to database if required
    if (assetId && addToDatabase) {
      console.log(`Updating database for asset: ${assetId}`);
      const dbPath = `users/${uid}/assets/${assetId}/files`;
      const fileRef = ref(db, dbPath);
      const newFileRef = push(fileRef);
      const fileData = {
        name: fileName,
        url: downloadURL,
        path: fullPath,
        type: fileType || 'application/octet-stream',
      };

      try {
        await set(newFileRef, fileData);
        console.log(`Database updated, file ID: ${newFileRef.key}`);
        return { downloadURL, fileId: newFileRef.key, fileData };
      } catch (dbError) {
        throw new Error(`Database update failed: ${(dbError as Error).message}`);
      }
    }

    console.log(`Upload complete, no database update required`);
    return { downloadURL };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Upload error for ${fileName}: ${errorMessage}`);
    throw new Error(`Failed to upload file: ${fileName} - ${errorMessage}`);
  }
};

/**
 * Update an asset's files by deleting specified files and uploading new ones.
 * @param uid - The user's unique ID
 * @param assetId - The asset's unique ID
 * @param filesToDelete - Array of file IDs to delete
 * @param newFiles - Array of new files to upload
 */
export const updateAssetFiles = async (
  uid: string,
  assetId: string,
  filesToDelete: string[],
  newFiles: { uri: string; name: string; type: string | null }[]
): Promise<void> => {
  const assetFilesRef = ref(db, `users/${uid}/assets/${assetId}/files`);
  const snapshot = await get(assetFilesRef);
  const filesData = snapshot.exists() ? snapshot.val() : {};

  // Delete files
  await Promise.all(filesToDelete.map(async (fileId) => {
    const file = filesData[fileId];
    if (file && file.path) {
      try {
        console.log(`Deleting file from storage: ${fileId}`);
        await deleteObject(storageRef(storage, file.path));
        console.log(`Deleting file metadata from database: ${fileId}`);
        await remove(ref(db, `users/${uid}/assets/${assetId}/files/${fileId}`));
      } catch (error) {
        console.warn(`Failed to delete file ${fileId}:`, error);
      }
    }
  }));

  // Upload new files
  await Promise.all(newFiles.map(async (file) => {
    try {
      console.log(`Uploading new file: ${file.name}`);
      await uploadFile(
        file.uri,
        file.name,
        uid,
        `users/${uid}/assets/${assetId}/files`,
        file.type,
        assetId,
        true // addToDatabase
      );
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
      throw error;
    }
  }));
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

export const updateAsset = async (uid: string, assetId: string, assetData: any) => {
  try {
    await update(ref(db, `users/${uid}/assets/${assetId}`), assetData);
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