import Script from "next/script";

export default function GoogleAdsense() {
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3984797860990299"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
