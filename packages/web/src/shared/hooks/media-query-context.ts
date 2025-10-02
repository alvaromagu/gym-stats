import { createContext, useContext } from 'react';

type MediaQueryContextState = boolean;

export const MediaQueryContext = createContext<MediaQueryContextState>(true);

export function useMediaQueryContext() {
  const context = useContext(MediaQueryContext);
  return context;
}
