import { MongoClient } from 'mongodb';

// User model for MongoDB operations
class User {
  constructor(db) {
    this.db = db;
    this.collection = db.collection('users');
  }

  // Create a new user
  async create(userData) {
    const { username, password } = userData;
    
    // Check if user already exists
    const existingUser = await this.collection.findOne({ username });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Store password in plain text as requested
    const newUser = {
      username,
      password, // Plain text storage
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await this.collection.insertOne(newUser);
    return { ...newUser, _id: result.insertedId };
  }

  // Find user by username
  async findByUsername(username) {
    return await this.collection.findOne({ username });
  }

  // Update user password
  async updatePassword(username, newPassword) {
    const result = await this.collection.updateOne(
      { username },
      { 
        $set: { 
          password: newPassword, // Plain text storage
          updatedAt: new Date()
        }
      }
    );
    return result.modifiedCount > 0;
  }

  // Get all users (for admin purposes)
  async findAll() {
    return await this.collection.find({}).toArray();
  }

  // Delete user
  async delete(username) {
    const result = await this.collection.deleteOne({ username });
    return result.deletedCount > 0;
  }
}

export default User;
