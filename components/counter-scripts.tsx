"use client"

import Script from "next/script"

export function CounterScripts() {
  return (
    <>
      <Script
        id="free-counter-auth"
        strategy="afterInteractive"
        src="https://www.freevisitorcounters.com/auth.php?id=26983c836e9d44b4918cb74f28d2084bb0df4c6a"
      />
      <Script
        id="free-counter"
        strategy="afterInteractive"
        src="https://www.freevisitorcounters.com/en/home/counter/1343620/t/6"
      />
    </>
  )
}
