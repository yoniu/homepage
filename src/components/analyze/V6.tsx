"use client";

import Script from "next/script";

export default function V6Analyze() {
  const enabled = process.env.NEXT_PUBLIC_ENABLE_V6_ANALYZE === 'true';
  const id = process.env.NEXT_PUBLIC_V6_ID;
  const ck = process.env.NEXT_PUBLIC_V6_CK;

  if (!enabled || !id || !ck) {
    return null;
  }

  return (
    <>
      <Script charSet="UTF-8" id="LA_COLLECT" src="//sdk.51.la/js-sdk-pro.min.js"></Script>
      <Script>
        {`
          function initLA() {
            if (typeof LA !== 'undefined') {
              LA.init({id:"${id}",ck:"${ck}",autoTrack:true,hashMode:true})
            } else {
              setTimeout(initLA, 100);
            }
          }
          initLA();
        `}
      </Script>
    </>
  )
}
