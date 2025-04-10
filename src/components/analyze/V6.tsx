"use client";

import Script from "next/script";

export default function V6Analyze() {
  return (
    <>
      <Script charSet="UTF-8" id="LA_COLLECT" src="//sdk.51.la/js-sdk-pro.min.js"></Script>
      <Script>
        {`
          function initLA() {
            if (typeof LA !== 'undefined') {
              LA.init({id:"${process.env.NEXT_PUBLIC_V6_ID as string}",ck:"${process.env.NEXT_PUBLIC_V6_CK as string}",autoTrack:true,hashMode:true})
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
