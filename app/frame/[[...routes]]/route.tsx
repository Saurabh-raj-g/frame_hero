/** @jsxImportSource frog/jsx */

import NFT from '@/src/models/nft'
import User from '@/src/models/user'
import UserRepository from '@/src/repositories/userRepository'
import AirStackService from '@/src/service/AirStackService'
import GenerateImageData, { NftImageBG } from '@/src/service/ImageService'
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
import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { pinata } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'

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
    ],
  })
})

app.frame('/area', async (c) => {
  let state = c.previousState;
  const { buttonValue, inputText, status, frameData, deriveState } = c;

  if (status === 'response' && buttonValue === 'ok') {
    const userReposiotry = new UserRepository();
    const user = await userReposiotry.findByFid(frameData?.fid!);
    if(user){
      state = deriveState(previousState => {
        previousState.user = user;
      })
    }
    
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
        style={{
          display: 'flex',
          fontSize: 60,
          color: 'black',
          background: '#f6f6f6',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative', // Add this line
        }}
      >
        {/* <img
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          src={`${process.env.NEXT_PUBLIC_PINATA_GATEWAY_DOMAIN}/ipfs/QmTohucBEeSic2oQUFMfpx8BnADcud6iRMEric4Jzfjq2F`}
          alt="Background Image"
        /> */}
        <div style={{
          position: 'absolute', top: 10,
          display: 'flex',
          fontSize: 50,
          backgroundColor: 'white',
          width: '50%',
          height: '70%',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>

          <div style={{
            zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
            backgroundImage: 'linear-gradient(90deg, rgb(255, 77, 77), rgb(249, 203, 40))',
            backgroundClip: 'text',
            color: 'transparent', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
          }}>

            1- Asia
            <br />
            2- Africa
            <br />
            3- Europe
            <br />
            4- NA
            <br />
            5- SA
            <br />
            6- Internet
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


app.frame('/avatar-gender', async(c) => {
  let state = c.previousState;
  const { inputText, deriveState, previousState,frameData } = c;
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
    if (country.isUnknown()) { throw new Error("invalid country") }
    previousState.country = country.toJson();
  })

  return c.res({
    action: '/attributes',
    image: (
      <div style={NftImageBG}>
        <div style={{
          backgroundImage: 'linear-gradient(90deg, rgb(255, 77, 77), rgb(249, 203, 40))',
          backgroundClip: 'text',
          color: 'transparent',
          fontSize: 60
        }}>
          Choose gender for ur avatar
        </div>
      </div>
    ),
    intents: [
      <Button value="male">Male</Button>,
      <Button value="female">Female</Button>,
      <Button value="annonymous">Anon</Button>,
    ],
  })
})

app.frame('/attributes', async(c) => {
  let state = c.previousState;
  const { buttonValue, deriveState, previousState } = c

  let randomAttributes: { name: ValueObjectType; value: number }[] = [];
  const userReposiotry = new UserRepository();
  if(previousState.isUserTempLoaded){
    const saved = await userReposiotry.create(previousState.user!);
    if (!saved) { throw new Error('user not saved') };
    state = deriveState(previousState => {
      previousState.user = saved;
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

        Your attributes were randomly generated
        {
          randomAttributes.map((attr, index) => (
            <div key={index}>
              {attr.name.label + " : " + attr.value}
            </div>
          ))
        }

        {state.spins ?
          `spins remaining : ${state.spins}`
          : 'No spins remaining'
        }
      </div>
    ),
    intents: [
      <Button value="nft" action='/nft'>Preview NFT</Button>,
      <Button value="respin" action={state.spins ? '/attributes' : '/nft'}>{state.spins ? 'Retry' : 'No more changes!!'}</Button>
    ],
  })
})

app.frame('/nft', async (c) => {
  try {
    const {previousState} = c;
    const svg = GenerateImageData(c.previousState)
    const arrayBuffer = await svg.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' }
    );

    const data = new FormData();
    data.append("file", blob);

    const pinataMetadata = JSON.stringify({
      name: `nft_${c.previousState.user?.forcaster.fid}`,
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

    const imageurl = `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_DOMAIN}/ipfs/${uploadRes.IpfsHash}`
    console.log(imageurl)
    let attributes: {name:string; value:number}[] = [];
    c.previousState.randomeAttributes.forEach((attr) => {
      attributes.push({name:attr.name.name,value:attr.value})
    })
    attributes.push({name: c.previousState.country?.name!, value: 0});
    attributes.push({name: c.previousState.gender?.name!, value: 0});
    
    const newNFT =  new NFT(0, "Frame Hero", imageurl, "This is a cool NFT",attributes).getNFT();
    console.log("signedPayloadsvsv");
    const thirdweb = new ThirdWebService(Chain.baseSepolia());
    console.log("signedPayloadsvchhjasv");
    const signedPayload = await thirdweb.getSignatureForMinting(newNFT, c.previousState.user?.forcaster.walletAddress!);
    console.log("signedPayload", signedPayload);
    const sdk =  new ThirdwebSDK("base-sepolia-testnet", {
      clientId: process.env.THIRDWEB_CLIENT_KEY!,
    });
    const contract = await sdk.getContract(process.env.NFT_COLLECTION_ADDRESS!,"nft-collection");
    const minted = await contract.signature.mint(signedPayload)
    console.log(minted.id._hex);
  } catch (error) {
    console.log(error);
  }


  return c.res({
    // image: (
    //     svg.
    // ),
    image: (
      <div style={NftImageBG}>
        {/* farcaster pfp */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          display: 'flex',
          width: '30%',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <img
            width="256"
            height="256"
            src={`${process.env.NEXT_PUBLIC_PINATA_GATEWAY_DOMAIN}/ipfs/QmTohucBEeSic2oQUFMfpx8BnADcud6iRMEric4Jzfjq2F`}
            style={{
              borderRadius: 128,
            }}
          />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center', textAlign: 'center',
            fontSize: 40,
            marginTop: 20,
            backgroundImage: 'linear-gradient(90deg, rgb(255, 77, 77), rgb(249, 203, 40))',
            backgroundClip: 'text',
            color: 'transparent', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
          }}>
            {c.previousState.user?.forcaster.username}
            <br />
            {c.previousState.gender?.label}
            <br />
            {c.previousState.country?.label}

          </div>

        </div>

        <div style={{
          display: 'flex',
          width: '30%',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center', textAlign: 'center',
            fontSize: 70,
            marginTop: 20,
            backgroundImage: 'linear-gradient(90deg, rgb(255, 77, 77), rgb(249, 203, 40))',
            backgroundClip: 'text',
            color: 'transparent', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          }}>
            {
              c.previousState.randomeAttributes.map((attr, index) => (
                <div key={index}>
                  {attr.name.label + " : " + attr.value}
                </div>
              ))
            }

            <br />
            @roles -
          </div>

        </div>


      </div>
    ),
    intents: [
      <Button.Mint target="...">Mint</Button.Mint>,
    ],
  })
})

app.frame('/dashboard', (c) => {
  return c.res({
    // action: '/attributes',
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        Dashboard
      </div>
    ),
    intents: [
      <Button value="1">1</Button>,
      <Button value="2">2</Button>,


    ],
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
