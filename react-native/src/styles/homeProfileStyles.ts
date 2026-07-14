// styles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
export const CARD_WIDTH = width * 0.92;

export const screanStyles = StyleSheet.create({
container: {
    flexGrow: 1,
    backgroundColor: '#ffdd48',
    alignItems: 'center',
    paddingVertical: 20,
  },
});

export const baseStyles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#d2d6d9',
    borderRadius: 8,
    borderWidth: 5,
    borderColor: '#4a4d4e',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#000',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 2,
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: width * 0.28,
    height: width * 0.28,
    borderRadius: (width * 0.28) / 2,
    backgroundColor: '#fff',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoTable: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: '#8a9296',
    borderRadius: 8,
    padding: 10,
  },
  infoRow: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#fff',
    paddingVertical: 4,
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 10,
    color: '#fff',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'right',
    marginTop: -4,
  },
  bioSection: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  bioText: {
    fontSize: 17,
    color: '#000',
    lineHeight: 28,
    fontWeight: '600',
  },
  highlightText: {
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#000',
    paddingHorizontal: 4,
  },
  parameterSection: {
    flexDirection: 'row',
    backgroundColor: '#8a9296',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  parameterLeft: {
    flex: 1,
  },
  parameterTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  paramItem: {
    fontSize: 13,
    color: '#fff',
    marginBottom: 4,
  },
  chartContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
});