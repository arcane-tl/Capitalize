// CustomStyles.ts
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from './Styles';

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
    backgroundColor: colors.modalBackground, // Theme-agnostic
  } as ViewStyle,
  modalContent: {
    width: 300,
    borderRadius: 10,
    padding: 20,
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
    backgroundColor: colors.modalBackground, // Theme-agnostic
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
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  cancelButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  } as ViewStyle,
  uploadButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
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
  } as ViewStyle,
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
  } as ViewStyle,
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
  } as ViewStyle,
  modifyText: {
    fontWeight: 'bold',
    marginLeft: 5,
  } as TextStyle,
  deleteText: {
    fontWeight: 'bold',
    marginLeft: 5,
  } as TextStyle,
});