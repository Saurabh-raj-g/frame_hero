/** @jsxImportSource frog/jsx */

import UserInterface from '@/src/models/interfaces/UserInterface'
import User from '@/src/models/user'
import UserRepository from '@/src/repositories/userRepository'
import PinataService from '@/src/service/PinataService'
import RandomAttributesValueService from '@/src/service/RandomAttributesValueService'
import { ForcasterType } from '@/src/types/ForcasterType'
import Country from '@/src/valueObject/Country'
import Gender from '@/src/valueObject/Gender'
import RandomAttributes from '@/src/valueObject/RandomAttributes'
import Role from '@/src/valueObject/Role'
import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { pinata } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'

type State = {
  spins: number;
  user: UserInterface | null;
  country: Country | null;
  gender: Gender | null;
  role: Role | null;
  randomeAttributes: {name:RandomAttributes, value: number}[];
}
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
  const {status} = c;

  return c.res({
    action: '/area',
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            'linear-gradient(to right, #432889, #17101F)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {status === 'response'
            ? 'DESCIPTION TEXT, AGREE TO TNC'
            : 'Welcome to the frame quest!'}
        </div>
      </div>
    ),
    intents: [
      <Button value="ok">Start game</Button>,
    ],
  })
})

app.frame('/area', async(c) => {
  let state = c.previousState;
  const { buttonValue, inputText, status,frameData,deriveState  } = c;
  
  if(status === 'response' && buttonValue === 'ok'){
    const userReposiotry = new UserRepository();
    const user = await userReposiotry.findByFid(frameData?.fid!);
    if(!user){
      // create user
      const forCasterData =  await PinataService.userByFid(frameData?.fid!);
      const forcaster: ForcasterType = {
        fid: forCasterData.data.fid,
        name: forCasterData.data.display_name,
        username: forCasterData.data.username,
        walletAddress: forCasterData.data.custody_address,
        pfpUrl: forCasterData.data.pfp_url,
      }
      const newUser = new User(forcaster, null, 0).getUser();
      const saved = await userReposiotry.create(newUser);
      if(!saved){throw new Error('user not saved')};
      state = deriveState(previousState => {
        previousState.user = saved;
      })
    }
    else{
      state = deriveState(previousState => {
        previousState.user = user;
      })
    }

  }


  // get user data
  // if already have nft
  // redirect to dashboard
  return c.res({
    action: '/avatar-gender',
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        Choose ur region
        1- Asia
        2- Africa
        3- Europe
        4- NA
        5- SA
        6- Internet
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter your number..." />,

      <Button> Next</Button >,

    ],
  })
})

app.frame('/avatar-gender', (c) => {
  const {inputText, deriveState } = c;
  const state = deriveState(previousState => {
    const country = Country.fromId<Country>(parseInt(inputText!));
    if(country.isUnknown()){throw new Error("invalid country")}
    previousState.country = country;
  })
    
  return c.res({
    action: '/attributes',
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        Choose gender for ur avatar
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
  const { buttonValue, deriveState,previousState } = c
  let randomAttributes:  {name:RandomAttributes;value:number}[] =[];
  if(buttonValue !== 'respin' && previousState.spins === MAX_SPINS){
    const attributes   = RandomAttributesValueService.getAttributeWithValue();
    randomAttributes = attributes.map(attr => {
      const obj = RandomAttributes.fromName<RandomAttributes>(attr.name);
      if(obj.isUnknown()){throw new Error("invalid attribute")}
      return {name: obj, value: attr.value}
    })
    previousState.randomeAttributes = randomAttributes;
  }

  const state = deriveState(previousState => {
    if (buttonValue !== 'respin'){
      const gender = Gender.fromName<Gender>(buttonValue!);
      if(gender.isUnknown()){throw new Error("invalid gender")}
      previousState.gender = gender;
    }
    if(buttonValue === 'respin' && previousState.spins > 0){
      previousState.spins--;
      const attributes = RandomAttributesValueService.getAttributeWithValue();
      randomAttributes  = attributes.map(attr => {
        const obj = RandomAttributes.fromName<RandomAttributes>(attr.name);
        if(obj.isUnknown()){throw new Error("invalid attribute")}
        return {name: obj, value: attr.value}
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
      <div style={{ color: 'white', display: 'flex', flexDirection: "column", fontSize: 60 }}>
        Your attributes were randomly generated
        {
          randomAttributes.map((attr, index) => (
            <div key={index}>
              {attr['name'].getLabel() + " : " + attr.value}
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

      // <Button value="anonymous">Anon</Button>,


    ],
  })
})

app.frame('/nft', (c) => {
  return c.res({
    // action: '/attributes',
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        NFT
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
