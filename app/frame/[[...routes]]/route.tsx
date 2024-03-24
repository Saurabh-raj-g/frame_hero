/** @jsxImportSource frog/jsx */

import User from '@/src/models/user'
import UserRepository from '@/src/repositories/userRepository'
import GenerateImageData, { BigTextStyle, NftImageBG } from '@/src/service/ImageService'
import PinataService from '@/src/service/PinataService'
import RandomAttributesValueService from '@/src/service/RandomAttributesValueService'
import { ForcasterType } from '@/src/types/ForcasterType'
import { State } from '@/src/types/StateType'
import { ValueObjectType } from '@/src/types/ValueObjectType'
import Country from '@/src/valueObject/Country'
import Gender from '@/src/valueObject/Gender'
import RandomAttributes from '@/src/valueObject/RandomAttributes'
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
    action: '/start-game',
    image: `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_DOMAIN}/ipfs/QmXANHJNRPo3Zs9UCwbKadbzdrQyS4tJb5c8wvTcXbrRJy`,
    intents: [
      <Button value="ok">Start game</Button>,
    ],
  })
})

app.frame('/start-game', async (c) => {
  let state = c.previousState;
  const { buttonValue, inputText, status, frameData, deriveState } = c;

  if (status === 'response' && buttonValue === 'ok') {
    const userReposiotry = new UserRepository();
    const user = await userReposiotry.findByFid(frameData?.fid!);
    if (!user) {
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
      const saved = await userReposiotry.create(newUser);
      if (!saved) { throw new Error('user not saved') };
      state = deriveState(previousState => {
        previousState.user = saved;
      })
    }
    else {
      state = deriveState(previousState => {
        previousState.user = user;
      })
    }
  }

  // get user data
  // if already have nft
  // redirect to dashboard
  return c.res({
    action: !c.previousState.user?.nft?.id ? '/region' : '/dashboard',
    // action: '/dashboard',
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

          <div style={BigTextStyle}>
            Fetching user data
            Checking for NFT ....
          </div>
        </div>
      </div>

    ),
    intents: [
      <Button> Next</Button >,
    ],
  })
})

app.frame('/region', async (c) => {
  let state = c.previousState;


  return c.res({
    action: '/sex',
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
        <img
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          src={`${process.env.NEXT_PUBLIC_PINATA_GATEWAY_DOMAIN}/ipfs/QmTohucBEeSic2oQUFMfpx8BnADcud6iRMEric4Jzfjq2F`}
          alt="Background Image"
        />
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

          <div style={BigTextStyle}>

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

app.frame('/sex', (c) => {
  const { inputText, deriveState } = c;
  const state = deriveState(previousState => {
    const country = Country.fromId<Country>(parseInt(inputText!));
    previousState.country = country.isUnknown() ? Country.internet().toJson() : country.toJson();
  })

  return c.res({
    action: '/attributes',
    image: (
      <div style={NftImageBG}>
        <div style={{
          display: "flex",
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(90deg, rgb(255, 77, 77), rgb(249, 203, 40))',
          backgroundClip: 'text',
          color: 'transparent',
          fontSize: 60
        }}>
          Area -- {state.country?.label}
          <br />
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

app.frame('/attributes', (c) => {
  const { buttonValue, deriveState, previousState } = c
  let randomAttributes: { name: ValueObjectType; value: number }[] = [];
  if (buttonValue !== 'respin' && previousState.spins === MAX_SPINS) {
    const attributes = RandomAttributesValueService.getAttributeWithValue();
    randomAttributes = attributes.map(attr => {
      const obj = RandomAttributes.fromName<RandomAttributes>(attr.name);
      if (obj.isUnknown()) { throw new Error("invalid attribute") }
      return { name: obj.toJson(), value: attr.value }
    })
    previousState.randomeAttributes = randomAttributes;
  }

  const state = deriveState(previousState => {
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
        <div style={{
          fontSize: 40,
          alignContent: 'center',
          ...BigTextStyle
        }}>
          Your attributes (random)
          {
            randomAttributes.map((attr, index) => (
              <div key={index}>
                {attr.name.label + " : " + attr.value}
              </div>
            ))
          }
        </div>
        <div style={{ fontSize: 40 }}>
          {state.spins ?
            `spins remaining : ${state.spins}`
            : 'No spins remaining'
          }
        </div>
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
            fontSize: 40,
            marginTop: 20,
            ...BigTextStyle
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
          <div style={{ fontSize: '70', ...BigTextStyle }}>
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
    image: (
      <div style={NftImageBG}>
        <div style={BigTextStyle}>
          Dashboard
        </div>
      </div>
    ),
    intents: [
      <Button action='/leaderboard'>Leaderboard</Button>,
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
