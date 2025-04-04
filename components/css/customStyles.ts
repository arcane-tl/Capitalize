import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useThemeStyles } from '@/components/ThemeUtils';

// Define tab screen options as plain objects
export const lightTabScreenOptions = {
  headerStyle: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  headerTintColor: 'rgba(0, 0, 0, 1)',
  tabBarStyle: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderTopColor: 'rgba(204, 204, 204, 1)',
  },
  tabBarActiveTintColor: 'rgba(66, 133, 244, 1)',
  tabBarInactiveTintColor: 'rgba(102, 102, 102, 1)',
};

export const darkTabScreenOptions = {
  headerStyle: {
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  headerTintColor: 'rgba(255, 255, 255, 1)',
  tabBarStyle: {
    backgroundColor: 'rgba(0, 0, 0, 1)',
    borderTopColor: 'rgba(51, 51, 51, 1)',
  },
  tabBarActiveTintColor: 'rgba(66, 133, 244, 1)',
  tabBarInactiveTintColor: 'rgba(136, 136, 136, 1)',
};

export const profileStyles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
  } as ViewStyle,
  buttonText: {
    marginLeft: 10,
  } as TextStyle,
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(55, 55, 55, 0.6)',
  } as ViewStyle,
  modalContent: {
    width: 300,
    borderRadius: 10,
    padding: 20,
    opacity: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  modalCloseText: {
    marginTop: 20,
    fontWeight: 'bold',
  } as TextStyle,
});

export const assetModalStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(55, 55, 55, 0.7)',
  } as ViewStyle,
  contentContainer: {
    width: '90%',
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  } as ViewStyle,
  innerContentContainer: {
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
    marginTop: 40,
  } as ViewStyle,
  modalTitleText: {
    fontWeight: 'bold',
  } as TextStyle,
  headerContainer: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    marginTop: 20,
    width: '100%',
    borderRadius: 20,
    flexDirection: 'row',
  } as ViewStyle,
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 20,
  } as ViewStyle,
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 20,
  } as ViewStyle,
  addButton: {
    borderWidth: 2, // Outline thickness
    borderColor: 'rgba(66, 133, 244, 1)', // Outline color
    borderRadius: 20, // Rounded corners
    paddingVertical: 5, // Vertical padding for the button
    paddingHorizontal: 10, // Horizontal padding for the button
    alignItems: 'center', // Center the text
    justifyContent: 'center', // Center the text
    backgroundColor: 'rgba(66, 133, 244, 1)', // Optional: Transparent background
  } as ViewStyle,
  cancelButton: {
    borderWidth: 1, // Outline thickness
    borderRadius: 20, // Rounded corners
    paddingVertical: 5, // Vertical padding for the button
    paddingHorizontal: 10, // Horizontal padding for the button
    alignItems: 'center', // Center the text
    justifyContent: 'center', // Center the text
    backgroundColor: 'transparent', // Optional: Transparent background
  } as ViewStyle,
  uploadButton: {
    borderWidth: 1, // Outline thickness
    borderRadius: 20, // Rounded corners
    paddingVertical: 5, // Vertical padding for the button
    paddingHorizontal: 10, // Horizontal padding for the button
    alignItems: 'center', // Center the text
    justifyContent: 'center', // Center the text
    backgroundColor: 'transparent', // Optional: Transparent background
  } as ViewStyle,
});

export const assetListStyle = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  screenContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 15,
  } as ViewStyle,
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  } as ViewStyle,
  assetImage: {
    width: 85,
    height: 85,
    borderRadius: 20,
  },
  detailsContainer: {
    marginLeft: 20,
  } as ViewStyle,
  assetName: {
    fontSize: 16,
    fontWeight: 'bold',
  } as TextStyle,
  assetDescription: {
    fontSize: 14,
  } as TextStyle,
});

export const swipeMenuStyle = StyleSheet.create({
  swipeContainer: {
    position: 'relative',
  } as ViewStyle,
  modifyBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 10,
    right: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 10,
    borderRadius: 10,
  },
  deleteBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 10,
    right: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
    borderRadius: 10,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  modifyText: {
    fontWeight: 'bold',
    marginLeft: 5,
  },
  deleteText: {
    fontWeight: 'bold',
    marginLeft: 5,
  },
});