/** @jsxImportSource frog/jsx */

import User from '@/src/models/user'
import { connectToDatabase } from '@/src/service/MongoService'
import RandomAttributesValueService from '@/src/service/RandomAttributesValueService'
import { createUser } from '@/src/service/users.service'
import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { pinata } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'

type State = {
  spins: number
}

const app = new Frog<{ State: State }>({
  assetsPath: '/',
  basePath: '/frame',
  initialState: {
    spins: 3
  }
  // hub: pinata()
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', async (c) => {
  
  const { buttonValue, inputText, status } = c
  const newUser: User = {
    name: 'John2 Doe',
    email: 'john@example.com',
    password: 'password123',
  };
  //await createUser(newUser)


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

app.frame('/area', (c) => {
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
      <div style={{ color: 'white', display: 'flex', flexDirection:"column", fontSize: 60 }}>
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
