import { StyleSheet } from 'react-native';

export const preferenceRegisterStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFDD48',
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingVertical: 24,
  },
  questionBlock: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 18,
    marginTop: 28,
    paddingBottom: 24,
  },
  questionImageWrapper: {
    width: '100%',
    maxWidth: 240,
    alignItems: 'center',
  },
  questionImage: {
    width: '100%',
    height: 44,
  },
  answerCard: {
    width: '100%',
    maxWidth: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 6,
    borderColor: '#443322',
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#443322',
    textAlign: 'center',
    lineHeight: 34,
  },
  hiddenTitle: {
    opacity: 0,
  },
  textInput: {
    minHeight: 44,
    fontSize: 20,
    fontWeight: '800',
    color: '#443322',
    textAlign: 'center',
    padding: 0,
  },
  errorText: {
    marginTop: 10,
    color: '#D60000',
    fontSize: 14,
    textAlign: 'center',
  },
  bottomArea: {
    paddingBottom: 0,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#443322',
  },
  inactiveDot: {
    backgroundColor: '#FFFFFF',
    opacity: 0.85,
  },
  buttonArea: {
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
    marginTop: 16,
  },
});
