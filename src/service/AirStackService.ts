import axios from 'axios';


export default class AirStackService {
  

    public static async userByFid(fid:number) {
        const input: FarcasterUserDetailsInput = {
            fid: 602,
        };
        const { data, error }: FarcasterUserDetailsOutput =
        await getFarcasterUserDetails(input);
        
        if (error) throw new Error(error);
        return data;
    }
    }
   
