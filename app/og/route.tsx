import { ImageResponse } from 'next/og';
import { NftImageBG } from '../frame/[[...routes]]/route';
// App router includes @vercel/og.
// No need to install it.

export const runtime = 'edge';

export async function GET(request: Request) {


  return new ImageResponse(
    (
      <div style={NftImageBG}>


      </div>
    ),
    {
      width: 1910,
      height: 1000,
    },
  );
}