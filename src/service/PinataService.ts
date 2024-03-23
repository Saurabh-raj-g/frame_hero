import { PinataFDK } from "pinata-fdk";
import { PinataUserData } from "../types/PinataUserDataType";

export default class PinataService {
    private static readonly  pinataFDK: PinataFDK = new PinataFDK({
        pinata_jwt: process.env.PINATA_JWT!,
        pinata_gateway: process.env.PINATA_GATEWAY!, 
    });

    // public static async userByFid(fid:number): Promise<UserData> {
    //     const userData = await this.pinataFDK.getUserByFid(20591);
    //     return userData;
    // }

    public static async userByFid(fid:number): Promise<PinataUserData> {
        const options = {method: 'GET', headers: {Authorization: `Bearer ${process.env.PINATA_JWT}`}};

        const userData = await fetch(`https://api.pinata.cloud/v3/farcaster/users/${fid}`, options) ;
        return await userData.json();
    }
}
