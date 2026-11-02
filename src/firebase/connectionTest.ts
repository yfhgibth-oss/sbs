import { doc, getDocFromServer } from 'firebase/firestore';
import { db } from './config';

export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'settings', 'test_connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration or internet connection.');
      return false;
    }
    // Any other response means we connected to the Firestore backend
    return true;
  }
}
