import { CSSProperties } from 'hono/jsx';
import { ImageResponse } from 'next/og';
import { State } from '../types/StateType';

export const config = {
  runtime: 'edge',
};

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

export const BigTextStyle = {
  display: "flex",
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundImage: 'linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))',
  backgroundClip: 'text',
  color: 'transparent',
  fontSize: 60
} as CSSProperties

function GenerateImageData(state: State) {
  return new ImageResponse(
    // return 
    (
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
            src={state.user?.forcaster.pfpUrl}
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
            backgroundImage: 'linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))',
            backgroundClip: 'text',
            color: 'transparent', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
          }}>
            {state.user?.forcaster.username}
            <br />
            {state.gender?.label}
            <br />
            {state.country?.label}
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
            backgroundImage: 'linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))',
            backgroundClip: 'text',
            color: 'transparent', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          }}>
            {
              state.randomeAttributes.map((attr, index) => (
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
    {
      width: 1910,
      height: 1000,
    },
  );
}

export default GenerateImageData;