import User from '../models/user';
import {Collection, WithId } from 'mongodb';
import { connectToDatabase } from '../service/MongoService';

export  default class UserRepository {
    private readonly collectionName = 'users';
    private collection: Collection<User> | null = null;

    private async setCollection() {
        if (this.collection) {
            return;
        }
        const db = await connectToDatabase();
        this.collection = db.collection<User>(this.collectionName);
    }

    public async create(user: User): Promise<WithId<User> | null> {
        try {
            await this.setCollection();
            if (!this.collection) {
                throw new Error('Collection not set');
            }
            const result = await this.collection.insertOne(user);
            if(!result.acknowledged) {
                throw new Error('User not inserted');
            }
            const data = await this.collection.findOne({id: result.insertedId.id});
            return data;
        } catch (error) {
            throw new Error(`Error creating user: , ${error}`);
        }
    }

    public async findById(id: string): Promise<WithId<User> | null> {
        try {
            await this.setCollection();
            if (!this.collection) {
                throw new Error('Collection not set');
            }
            const data = await this.collection.findOne({id});
            return data;
        } catch (error) {
            throw new Error(`Error getting user: , ${error}`);
        }
    }

    public async findByFid(fId: number): Promise<WithId<User> | null> {
        try {
            await this.setCollection();
            if (!this.collection) {
                throw new Error('Collection not set');
            }
            const data = await this.collection.findOne({forcaster: {fid:fId}});
            return data;
        } catch (error) {
            throw new Error(`Error getting user: , ${error}`);
        }
    }

    public async findByWalletAdsress(address: number): Promise<WithId<User> | null> {
        try {
            await this.setCollection();
            if (!this.collection) {
                throw new Error('Collection not set');
            }
            const data = await this.collection.findOne({forcaster: {walletAddress:address}});
            return data;
        } catch (error) {
            throw new Error(`Error getting user: , ${error}`);
        }
    }


    public async update(user: User, id:string): Promise<WithId<User> | null> {
        try {
            await this.setCollection();
            if (!this.collection) {
                throw new Error('Collection not set');
            }
            const result = await this.collection.findOneAndUpdate({id}, {$set: user});
            return result;
        } catch (error) {
            throw new Error(`Error updating user: , ${error}`);
        }
    }
      
}

