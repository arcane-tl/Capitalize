// app/styles.ts
import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Matches container background
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9', // Optional: light background for consistency
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Darker text for readability
  },
  text: {
    fontSize: 16,
    color: '#666', // Softer color for secondary text
  },
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  tabIcon: {
    fontSize: 20, // For emoji or text-based icons
  },
});