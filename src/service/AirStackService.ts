import axios from 'axios';


export default class AirStackService {
  

    // public static async userByFid(fid:number) {
    //     const input: FarcasterUserDetailsInput = {
    //         fid: 602,
    //     };
    //     const { data, error }: FarcasterUserDetailsOutput =
    //     await getFarcasterUserDetails(input);
        
    //     if (error) throw new Error(error);
    //     return data;
    // }


    public static async userByFid(fid:number) {

        const options = {
            method: 'GET',
            url: `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
            headers: {accept: 'application/json', api_key: process.env.NYNAR_API_KEY}
          };
          
          const response = await axios
            .request(options);

            return response.data;
           
    }
    }
   
