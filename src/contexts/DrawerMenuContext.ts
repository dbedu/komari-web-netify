import { createContext, type Dispatch, type SetStateAction } from "react";

interface DrawerMenuContextType {
  openMenu: string | null;
  setOpenMenu: Dispatch<SetStateAction<string | null>>;
}

export const DrawerMenuContext = createContext<DrawerMenuContextType>({
  openMenu: null,
  setOpenMenu: () => {},
});