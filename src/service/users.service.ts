import User from '../models/user';
import { connectToDatabase } from './MongoService';

export async function createUser(user: User): Promise<void> {
  try {
    
    const db = await connectToDatabase();
    const collection = db.collection<User>('users');

    // Insert the new user document
    const result = await collection.insertOne(user);

    console.log('User inserted:', result.insertedId);
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

