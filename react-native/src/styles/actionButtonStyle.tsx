import { StyleSheet } from 'react-native'

export const actionButtonStyles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  centeredRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonRowSingle: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  placeholder: {
    flex: 1,
  },
  backButton: {
    flex: 1,
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4293FF',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#4293FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 1,
    height: 52,
    backgroundColor: '#4293FF',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonSingle: {
    flex: 0,
    minWidth: 180,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});