import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const homeStyles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    marginBottom: 30,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  userInfo: {
    marginTop: 10,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 5,
  },
  infoValue: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 2,
  },
  feedContainer: {
    flex: 1,
  },
  signOutButton: {
    borderRadius: 15,
    overflow: 'hidden',
    width: '100%',
    marginTop: 20,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  signOutText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 