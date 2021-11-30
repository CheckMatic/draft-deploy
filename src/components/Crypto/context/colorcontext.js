import { createContext } from "react";

export const CryptoColorContext = createContext({
  didRedirect: false,
  playerDidRedirect: () => {},
  playerDidNotRedirect: () => {},
});
