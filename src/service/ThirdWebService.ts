import { NFT, ThirdwebSDK } from "@thirdweb-dev/sdk";
import Chain from "../valueObject/Chain";
import dotenv from "dotenv";
import { NFTType } from "../types/NFTType";
dotenv.config();

export default class ThirdWebService {
    private thirdWeb : ThirdwebSDK;
    constructor(chain :Chain){
        if (chain.isBaseSepolia()) {
            this.thirdWeb = ThirdwebSDK.fromPrivateKey(
                process.env.WALLET_PRIVATE_KEY!, // Your wallet's private key (only required for write operations)
                "",
                {
                    secretKey: process.env.TW_SECRET_KEY,
                }
            );
        }
        throw new Error(`Invalid chain: switch to ${Chain.baseSepolia().getLabel()}`)
       
    }
    

    private async getContract() {
        return await this.thirdWeb.getContract(process.env.NFT_COLLECTION_ADDRESS!,"nft-collection");
    }

    /**
     * get address of a contract
     * @returns 
     */
    public async getContractAddress(): Promise<string> {
        const contract =  await this.getContract();
        const address = contract.getAddress();
        return address;
    }
    public async getAppUri(): Promise<string> {
        const contract =  await this.getContract();
        const appURI = await contract.app.get(); // "ipfs://some_ipfs_hash";
        return appURI
    }

    /**
     * 
     * @param uri 
     * @returns 
     * @example
        public async setAppUri("ipfs://some_ipfs_hash")
     */
    public async setAppUri(uri:string): Promise<void> {
        const contract =  await this.getContract();
        const tx = await contract.app.set(uri); 
        
        if (tx.receipt ===null ||tx.receipt ===undefined) {
            throw new Error(`Failed to set app uri on the blockchain`);
        }
    }

    public async getContractMetaData(): Promise<any> {
        const contract =  await this.getContract();
        const metadata = await contract.metadata.get(); 
        return metadata;
    }
    
    /**
     * 
     * @param metadata   
       @example
        public async setContractMetaData({ name: "demo", description: "this is demo nft"})
    */
    public async setContractMetaData(metadata:any): Promise<void> {
        const contract =  await this.getContract();
        const tx = await contract.metadata.set(metadata);
        //const status = await this.checkTransactionStatus(tx.receipt.transactionHash);
        
        if (tx.receipt ===null ||tx.receipt ===undefined) {
            throw new Error(`Failed to set metadata on the blockchain`);
        }
    }

    /**
     * 
     * @param metadata 
       @example
       public async updateContractMetaData({ description: "this is demo nft"})
       
    */
    public async updateContractMetaData(metadata:any): Promise<void> {
        const contract =  await this.getContract();
        const tx = await contract.metadata.update(metadata);
        //const status = await this.checkTransactionStatus(tx.receipt.transactionHash);
        
        if (tx.receipt ===null ||tx.receipt ===undefined) {
            throw new Error(`Failed to update metadata on the blockchain`);
        }
    }
    /**
     * Get all owned NFT of a specific wallet
     * @param walletAddress 
     */
    public async getOwnedNFT(walletAddress:string) {
        
        const contract =  await this.getContract();
        const balance = await contract.erc721.getOwned(walletAddress);
        return balance;
    }

    /**
     * 
     * @param walletAddress Get NFT balance of a specific wallet

       @remarks — Get a wallets NFT balance (number of NFTs in this contract owned by the wallet).    
     * @returns 
     */
    public async balanceOf(walletAddress:string): Promise<number>{
        
        const contract =  await this.getContract();
        const balance = await contract.erc721.balanceOf(walletAddress);
        return Number(balance._hex);
    }

   /**
    * 
    * @returns Get all NFTs
    */
    public async getAllNFT() {
        const contract =  await this.getContract();
        const nfts = await contract.erc721.getAll();
        return nfts;
    }

    public async getAllOwners() {
        const contract =  await this.getContract();
        const owners = await contract.erc721.getAllOwners();
        return owners;
    }

    /**
     * Get a single NFT metadata
     * @param tokenId 
     * @returns 
     */
    public async getSigleNft(tokenId:number) {
        const contract =  await this.getContract();
        const nft = await contract.erc721.get(tokenId);
        return nft;
    }

    /**
     * 
     * @param metadata  
     * const metadata = {
            name: "Cool NFT",
            description: "This is a cool NFT",
            image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
       };
     * @returns 
     */
    public async getSignatureForMinting(metadata:NFTType, address:string) {
        const contract =  await this.getContract();
        const { attributes } = metadata;
        const attributesKeys = Object.keys(attributes);
        const payload = {
            metadata: {
              name: "Frame Hero",
              description: metadata.description,
              image: metadata.image, // This can be an image url or file
              attributes: attributesKeys.map((key) => {
                return {
                    key: {...metadata.attributes[key]}
                };
              }),
            },
            price: 0,
            to: address,
        }
      
        const signedPayload = await contract.erc721.signature.generate(payload);

        return signedPayload.payload;
    }

    public async burnNFT(tokenId:any) {
        const contract =  await this.getContract();
        const result = await contract.erc721.burn(tokenId);

        return result.receipt;
    }


    /**
     * Get the total count NFTs minted in this contract
     * @returns
     */
    public async totalSupplied(): Promise<number> {
        
        const contract =  await this.getContract();
        const balances  = await contract.erc721.totalCirculatingSupply();
        return Number(balances ._hex);
    }

    public async totalClaimed(): Promise<number> {
        const contract =  await this.getContract();
        const balances  = await contract.erc721.totalClaimedSupply();
        return Number(balances ._hex);
    }
    
    /**
     * Get the current owner address of the contract
     * @returns 
     */
    public async getOwner(): Promise<string> {
        const contract =  await this.getContract();
        const owner = await contract.owner.get();
        
        return owner;
    }

    /**
     * Set the new owner address of the contract
     * @param ownerAddress 
     */
    public async setOwner(ownerAddress: string): Promise<void> {
        const contract =  await this.getContract();
        const tx = await contract.owner.set(ownerAddress);
        //const status = await this.checkTransactionStatus(tx.receipt.transactionHash);
        
        if (tx.receipt ===null ||tx.receipt ===undefined) {
            throw new Error(`Failed to set owner on the blockchain`);
        }
    }

    /**
     * Get all members of the minter role
     * @returns 
     */
    public async getMinters(): Promise<string[]> {
        const contract =  await this.getContract();
        const mintersAddresses = await contract.roles.get("minter");
        return mintersAddresses;
    }

    /**
     * Grant minter role to a specific address
     * @param address 
     */
    public async addMinter(address:string): Promise<void> {
        const contract =  await this.getContract();
        const tx = await contract.roles.grant("minter",address);
        //const status = await this.checkTransactionStatus(tx.receipt.transactionHash);
        
        if (tx.receipt ===null ||tx.receipt ===undefined) {
            throw new Error(`Failed to add minter on the blockchain`);
        }
    }

    /**
     * Revoke minter role from a specific address
     * @param address 
     */

    public async removeMinter(address:string): Promise<void> {
        const contract =  await this.getContract();
        const tx = await contract.roles.revoke("minter",address);
        //const status = await this.checkTransactionStatus(tx.receipt.transactionHash);
        
        if (tx.receipt ===null ||tx.receipt ===undefined) {
            throw new Error(`Failed to remove minter on the blockchain`);
        }
    }
   
}


