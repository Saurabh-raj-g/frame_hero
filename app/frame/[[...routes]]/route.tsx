/** @jsxImportSource frog/jsx */

import { abi } from '@/src/abi/ERC721abi'
import NFT from '@/src/models/nft'
import User from '@/src/models/user'
import UserRepository from '@/src/repositories/userRepository'
import AirStackService from '@/src/service/AirStackService'
import GenerateImageData, { BigTextStyle, NftImageBG, SmallTextStyle } from '@/src/service/ImageService'
import PinataService from '@/src/service/PinataService'
import RandomAttributesValueService from '@/src/service/RandomAttributesValueService'
import ThirdWebService from '@/src/service/ThirdWebService'
import { ForcasterType } from '@/src/types/ForcasterType'
import { State } from '@/src/types/StateType'
import { ValueObjectType } from '@/src/types/ValueObjectType'
import Chain from '@/src/valueObject/Chain'
import Country from '@/src/valueObject/Country'
import Gender from '@/src/valueObject/Gender'
import RandomAttributes from '@/src/valueObject/RandomAttributes'
import { ThirdwebSDK } from '@thirdweb-dev/sdk'
import { Button, Frog, parseEther, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { pinata } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'

import { Web3 } from 'web3';

const provider = new Web3(process.env.ALCHEMY_BASE_RPC!);
const web3 = new Web3(provider);

const MAX_SPINS = 3;


const app = new Frog<{ State: State }>({
  assetsPath: '/',
  basePath: '/frame',
  initialState: {
    spins: MAX_SPINS,
    user: null,
    country: null,
    gender: null,
    role: null,
    randomeAttributes: [],
    isUserTempLoaded: false,
    imageurl: null,
    imageCID: null,
    metadataCID: null,
    tokenID: null
  },
  verify: 'silent',
  // hub: {
  //   apiUrl: "https://hubs.airstack.xyz",
  //   fetchOptions: {
  //     headers: {
  //       "x-airstack-hubs": process.env.AIRSTACK_API_KEY as string,
  //     }
  //   }
  // }
  hub: pinata()
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', async (c) => {
  const { status } = c;

  return c.res({
    action: '/area',
    image: `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_DOMAIN}/ipfs/QmXANHJNRPo3Zs9UCwbKadbzdrQyS4tJb5c8wvTcXbrRJy`,
    intents: [
      <Button value="ok">Start game</Button>,
      <Button action='/dashboard'>Already have NFT</Button>,
    ],
  })
})

app.frame('/area', async (c) => {
  let state = c.previousState;
  const { buttonValue, status, frameData } = c;

  if (status === 'response' && buttonValue === 'ok') {
    // const userReposiotry = new UserRepository();
    // const user = await userReposiotry.findByFid(frameData?.fid!);
    // if (user) {
    //   state = deriveState(previousState => {
    //     previousState.user = user;
    //   })
    // }

    // const forcaster: ForcasterType = {
    //   fid: frameData?.fid!,
    //   name: forCasterData?.profileName!,
    //   username: forCasterData?.profileName!,
    //   walletAddress: forCasterData?.userAssociatedAddresses![0]!,
    //   pfpUrl: forCasterData?.profileImage?.medium!,
    // }

  }

  // get user data
  // if already have nft
  // redirect to dashboard
  return c.res({
    action: '/avatar-gender',
    image: (
      <div
        style={NftImageBG}
      >
        <img
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          src={`${process.env.NEXT_PUBLIC_PINATA_GATEWAY_DOMAIN}/ipfs/QmYECGo4UcG9aWK1t6Eo38f8wokhFvk6mYWTGiV1ANeznM`}
          alt="Background Image"
        />
        <div style={{
          position: 'absolute', top: 20,
          display: 'flex',
          fontSize: 50,
          // backgroundColor: 'white',
          width: '50%',
          height: '80%',
          // backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={SmallTextStyle}>
            {
              Country.getResourceArray().map((attr, index) => (
                <div key={index}>
                  {attr.id + " : " + attr.label}
                </div>
              ))
            }
          </div>
        </div>

      </div>

    ),
    intents: [
      <TextInput placeholder="Enter your number..." />,
      <Button> Next</Button >,
    ],
  })
})


app.frame('/avatar-gender', async (c) => {
  let state = c.previousState;
  const { inputText, deriveState, previousState, frameData } = c;
  if (!previousState.user) {
    // create user
    const forCasterData = await PinataService.userByFid(frameData?.fid!);

    const forcaster: ForcasterType = {
      fid: forCasterData.data.fid,
      name: forCasterData.data.display_name,
      username: forCasterData.data.username,
      walletAddress: forCasterData.data.custody_address,
      pfpUrl: forCasterData.data.pfp_url,
    }
    const newUser = new User(forcaster, null, 0).getUser();
    state = deriveState(previousState => {
      previousState.user = newUser;
      previousState.isUserTempLoaded = true;
    });

  };
  state = deriveState(previousState => {
    const country = Country.fromId<Country>(parseInt(inputText!));
    previousState.country = country.isUnknown() ? Country.internet().toJson() : country.toJson();
  })

  return c.res({
    action: '/attributes',
    image: `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_DOMAIN}/ipfs/QmVyHHPZWeWuYrDw49hMT7EhrJ1MPZuTW5uL5J32NtwuUe`,
    intents: [
      <Button value="male">Male</Button>,
      <Button value="female">Female</Button>,
      <Button value="annonymous">Anon</Button>,
    ],
  })
})

app.frame('/attributes', async (c) => {
  let state = c.previousState;
  const { buttonValue, deriveState, previousState } = c

  let randomAttributes: { name: ValueObjectType; value: number }[] = [];
  // const userReposiotry = new UserRepository();
  if (previousState.isUserTempLoaded) {
    // const saved = await userReposiotry.create(previousState.user!);
    // if (!saved) { throw new Error('user not saved') };
    state = deriveState(previousState => {
      // previousState.user = saved;
      previousState.isUserTempLoaded = false;
    });
  }

  if (buttonValue !== 'respin' && previousState.spins === MAX_SPINS) {
    const attributes = RandomAttributesValueService.getAttributeWithValue();
    randomAttributes = attributes.map(attr => {
      const obj = RandomAttributes.fromName<RandomAttributes>(attr.name);
      if (obj.isUnknown()) { throw new Error("invalid attribute") }
      return { name: obj.toJson(), value: attr.value }
    })
    state = deriveState(previousState => {
      previousState.randomeAttributes = randomAttributes;
    });
  }

  state = deriveState(previousState => {
    if (buttonValue !== 'respin') {
      const gender = Gender.fromName<Gender>(buttonValue!);
      if (gender.isUnknown()) { throw new Error("invalid gender") }
      previousState.gender = gender.toJson();
    }
    if (buttonValue === 'respin' && previousState.spins > 0) {
      previousState.spins--;
      const attributes = RandomAttributesValueService.getAttributeWithValue();
      randomAttributes = attributes.map(attr => {
        const obj = RandomAttributes.fromName<RandomAttributes>(attr.name);
        if (obj.isUnknown()) { throw new Error("invalid attribute") }
        return { name: obj.toJson(), value: attr.value }
      })
      previousState.randomeAttributes = randomAttributes;
    }
  })

  // middleware
  //getrandom attributes

  // if ok go to nft preview and mint txn

  // if (buttonValue === `respin` && spins > 0) {
  //   // getrandom attributes
  //   spins -= 1
  // }

  return c.res({
    image: (
      <div style={NftImageBG}>
        <img
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          src={`${process.env.NEXT_PUBLIC_PINATA_GATEWAY_DOMAIN}/ipfs/QmUWfNA76aWk9Ppsx8tVVWrKzi7CNQoczUg9JUaMpqkocx`}
          alt="Background Image"
        />
        <div style={{
          position: 'absolute', top: 20,
          display: 'flex',
          fontSize: 50,
          // backgroundColor: 'white',
          width: '50%',
          height: '80%',
          // backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={SmallTextStyle}>
            choices :
            {state.country?.label!}
            ,
            {state.gender?.label!}
          </div>
          <div style={{
            fontSize: 40,
            alignContent: 'center',
            ...BigTextStyle
          }}>
            {
              randomAttributes.map((attr, index) => (
                <div key={index}>
                  {attr.name.label + " : " + attr.value}
                </div>
              ))
            }
          </div>
          <div style={SmallTextStyle}>
            {state.spins ?
              `spins remaining : ${state.spins}`
              : 'No spins remaining'
            }
          </div>
        </div>
      </div>
    ),
    intents: [
      <Button value="nft" action='/building-image'>Preview NFT</Button>,
      <Button value="respin" action={state.spins ? '/attributes' : '/building-image'}>{state.spins ? 'Retry' : 'No more changes!!'}</Button>
    ],
  })
})

app.frame('/building-image', async (c) => {
  const { previousState } = c;

  try {
    const svg = GenerateImageData(c.previousState)
    const arrayBuffer = await svg.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' }
    );

    const data = new FormData();
    data.append("file", blob);

    const pinataMetadata = JSON.stringify({
      name: `nft_${c.previousState.user?.forcaster.fid}.jpg`,
    });
    data.append("pinataMetadata", pinataMetadata);
    const upload = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_API_JWT}`,
        },
        body: data,
      }
    );
    const uploadRes = await upload.json();
    console.log(uploadRes);
    previousState.imageCID = uploadRes.IpfsHash

    const imageurl = `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_DOMAIN}/ipfs/${uploadRes.IpfsHash}`
    console.log(imageurl)
    previousState.imageurl = imageurl;

  } catch (error) {
    console.log(error);
  }

  return c.res({
    image: `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_DOMAIN}/ipfs/QmRf4aKknnwE216jyRDS8NwxdbsyJYDm18p3xubLubJzoA`,
    intents: [
      <Button action="/nft">SHOW</Button>,
    ],
  })
})

app.frame('/nft', async (c) => {
  const { previousState } = c;
  try {
    let attributes: { name: string; value: number }[] = [];
    c.previousState.randomeAttributes.forEach((attr) => {
      attributes.push({ name: attr.name.name, value: attr.value })
    })
    attributes.push({ name: previousState.country?.name!, value: 0 });
    attributes.push({ name: previousState.gender?.name!, value: 0 });

    const data = JSON.stringify({
      pinataContent: {
        name: `frame-hero--${previousState.user?.forcaster.username!}`,
        description: "Your NFT for playing our game - Frame Hero ",
        external_url: "https://pinata.cloud",
        image: `ipfs://${previousState.imageCID}`,
        // attributes        
      },
      pinataMetadata: {
        name: `nft_${c.previousState.user?.forcaster.fid}_metadata.json`
      }
    })

    try {
      const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.PINATA_API_JWT}`,
        },
        body: data
      });
      const metadataRes = await res.json();
      console.log(metadataRes);
      previousState.metadataCID = metadataRes.IpfsHash
    } catch (error) {
      console.log(error);
    }

    // const newNFT = new NFT(0, "Frame Hero", previousState.imageurl!, "This is a cool NFT", attributes).getNFT();
    // console.log("signedPayloadsvsv");
    // const thirdweb = new ThirdWebService(Chain.baseSepolia());
    // console.log("signedPayloadsvchhjasv");
    // const signedPayload = await thirdweb.getSignatureForMinting(newNFT, c.previousState.user?.forcaster.walletAddress!);
    // console.log("signedPayload", signedPayload);
    // const sdk = new ThirdwebSDK("base-sepolia-testnet", {
    //   clientId: process.env.THIRDWEB_CLIENT_KEY!,
    // });
    // const contract = await sdk.getContract(process.env.NFT_COLLECTION_ADDRESS!, "nft-collection");
    // const minted = await contract.signature.mint(signedPayload)
    // console.log(minted.id._hex);
  } catch (error) {
    console.log(error);
  }

  return c.res({
    action: '/dashboard',
    image: previousState.imageurl!,
    intents: [
      <Button.Transaction target="/mint">Mint</Button.Transaction>,
    ],
  })
})

app.transaction('/mint', (c) => {
  const { previousState, address } = c
  console.log(previousState.user?.forcaster.walletAddress!)
  // Contract transaction response.
  return c.contract({
    abi,
    chainId: 'eip155:84532',
    functionName: 'safeMint',
    args: [
      // previousState.user?.forcaster.walletAddress! as '0x', // custody address farcaster
      address as '0x',
      `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_DOMAIN}/ipfs/${previousState.metadataCID}`
    ],
    to: process.env.NFT_COLLECTION_ADDRESS as '0x',
  })
})

app.frame('/dashboard', (c) => {
  const { transactionId, previousState } = c
  previousState.txnID = transactionId!

  return c.res({
    image: (
      <div style={NftImageBG}>
        <img
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          src={`${process.env.NEXT_PUBLIC_PINATA_GATEWAY_DOMAIN}/ipfs/QmZ3LfCrpsPdg7h3kohnE1LfnVVCsE58VDKoSZYKKpMC26`}
          alt="Background Image"
        />
        <div style={SmallTextStyle}>
          {transactionId && `Transaction ID: ${transactionId}`}
        </div>
      </div>
    ),
    intents: [
      <Button action='/leaderboard'>Leaderboard</Button>,
      <Button action='/my-nft'>View NFT</Button>,
      <Button action='/daily-quest'>Daily Quest</Button>,
    ],
  })
})


app.frame('/leaderboard', (c) => {
  return c.res({
    image: (
      <div style={NftImageBG}>
        <div style={BigTextStyle}>
          Leaderboard
        </div>
      </div>
    ),
    intents: [
      <Button value="1">1</Button>,
      <Button action='/dashboard'>back</Button>,
    ],
  })
})

app.frame('/my-nft', async (c) => {
  const { previousState } = c

  if (previousState.txnID) {
    const receipt = await web3.eth.getTransactionReceipt(previousState.txnID as '0x')
    const tokenId = Web3.utils.hexToNumber(receipt.logs[0].topics ? receipt.logs[0].topics[3] as '0x' : '0x')
    previousState.tokenID = tokenId as number
  }

  const url = `https://testnets.opensea.io/assets/base-sepolia/${process.env.NFT_COLLECTION_ADDRESS}/${previousState.tokenID}`
  return c.res({
    image: `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_DOMAIN}/ipfs/${c.previousState.imageCID!}`,
    intents: [
      <Button.Redirect location={url}>
        View on opensea
      </Button.Redirect>,
      <Button action='/dashboard'>back</Button>,
    ],
  })
})

app.frame('/daily-quest', (c) => {
  return c.res({
    image: (
      <div style={NftImageBG}>
        <div style={BigTextStyle}>
          Daily quest
        </div>
      </div>
    ),
    intents: [
      <Button value="1">1</Button>,
      <Button action='/dashboard'>back</Button>,
    ],
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
