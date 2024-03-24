import {Collection, ObjectId, WithId } from 'mongodb';
import { connectToDatabase } from '../service/MongoService';
import UserInterface from '../models/interfaces/UserInterface';

export  default class UserRepository {
    private readonly collectionName = 'users';
    private collection: Collection<UserInterface> | null = null;

    private async setCollection() {
        if (this.collection) {
            return;
        }
        const db = await connectToDatabase();
        this.collection = db.collection<UserInterface>(this.collectionName);
    }

    public async create(user: UserInterface): Promise<WithId<UserInterface> | null> {
        try {
            await this.setCollection();
            if (!this.collection) {
                throw new Error('Collection not set');
            }
            const result = await this.collection.insertOne(user);
            if(!result.acknowledged) {
                throw new Error('User not inserted');
            }
            const data = await this.collection.findOne({_id: result.insertedId});
            return data;
        } catch (error) {
            throw new Error(`Error creating user: , ${error}`);
        }
    }

    public async findById(id: ObjectId): Promise<WithId<UserInterface> | null> {
        try {
            await this.setCollection();
            if (!this.collection) {
                throw new Error('Collection not set');
            }
            const data = await this.collection.findOne({_id:id});
            return data;
        } catch (error) {
            throw new Error(`Error getting user: , ${error}`);
        }
    }

    public async findByFid(fId: number): Promise<WithId<UserInterface> | null> {
        try {
            await this.setCollection();
            if (!this.collection) {
                throw new Error('Collection not set');
            }
            const data = await this.collection.findOne({'forcaster.fid': fId});
            return data;
        } catch (error) {
            throw new Error(`Error getting user: , ${error}`);
        }
    }

    public async findByWalletAdsress(address: number): Promise<WithId<UserInterface> | null> {
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


    public async update(user: UserInterface, id:string): Promise<WithId<UserInterface> | null> {
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

