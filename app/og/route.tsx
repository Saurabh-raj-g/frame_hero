import { NftImageBG } from '@/src/service/ImageService';
import { ImageResponse } from 'next/og';

export async function GET(request: Request) {
  return new ImageResponse(
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
            @username
            <br />
            @gender
            <br />
            @region
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
            @luck -
            <br />
            @intelligence -
            <br />
            @power -
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