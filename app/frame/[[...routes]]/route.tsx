/** @jsxImportSource frog/jsx */

import RandomAttributesValueService from '@/src/service/RandomAttributesValueService'
import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { pinata } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { CSSProperties } from 'hono/jsx'

type State = {
  spins: number
}

const app = new Frog<{ State: State }>({
  assetsPath: '/',
  basePath: '/frame',
  initialState: {
    spins: 3
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

  const { buttonValue, inputText, status } = c



  return c.res({
    action: '/area',
    image: `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_DOMAIN}/ipfs/QmXANHJNRPo3Zs9UCwbKadbzdrQyS4tJb5c8wvTcXbrRJy`,
    intents: [
      <Button value="ok">Start game</Button>,
    ],
  })
})

app.frame('/area', (c) => {
  const { frameData } = c;
  // const { fid } = frameData;
  console.log(frameData?.fid);


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

export const NftImageBG = {
  height: '100%',
  width: '100%',
  display: 'flex',
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  backgroundColor: 'white',
  backgroundImage: 'radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)',
  backgroundSize: '100px 100px',
} as CSSProperties

app.frame('/avatar-gender', (c) => {
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
      <Button value="anonymous">Anon</Button>,


    ],
  })
})

app.frame('/attributes', (c) => {
  const { buttonValue, deriveState } = c
  const state = deriveState(previousState => {
    if (buttonValue === 'respin') previousState.spins--
  })
  const data = RandomAttributesValueService.getAttributeWithValue();

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
          data.map((attr, index) => (
            <div key={index}>
              {attr.name + " : " + attr.value}
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
      <div style={NftImageBG}>
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
