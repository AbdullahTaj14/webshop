"use client";

import * as React from "react";

interface PersistApi {
  hasHydrated: () => boolean;
  onFinishHydration: (callback: () => void) => () => void;
}

export function useHasHydrated(persist: PersistApi) {
  const [hasHydrated, setHasHydrated] = React.useState(false);

  // `persist` only exists in the browser — zustand's default storage factory
  // touches `window.localStorage` eagerly and is undefined on the server, so
  // it must never be read outside an effect (render runs during SSR too).
  React.useEffect(() => {
    function handleHydrated() {
      setHasHydrated(true);
    }
    if (persist.hasHydrated()) {
      handleHydrated();
      return;
    }
    return persist.onFinishHydration(handleHydrated);
  }, [persist]);

  return hasHydrated;
}
