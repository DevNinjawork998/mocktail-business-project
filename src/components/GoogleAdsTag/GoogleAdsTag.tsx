import Script from "next/script";

/** Google Ads gtag (AW-…). Override with NEXT_PUBLIC_GOOGLE_ADS_AW_ID in env if needed. */
const GOOGLE_ADS_AW_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_AW_ID;

export default function GoogleAdsTag(): React.JSX.Element | null {
  if (!GOOGLE_ADS_AW_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GOOGLE_ADS_AW_ID)}`}
        strategy="lazyOnload"
      />
      <Script id="google-ads-gtag-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_AW_ID}');
        `}
      </Script>
    </>
  );
}
