import { ICenter, IRequestPath } from "pages/map";

declare global {
  interface Window {
    Tmapv2: any;
    fetchWalkLoad: (param: IRequestPath) => Promise<void> | undefined;
    walkLoad: (param: any) => Promise<void> | undefined;
    handleChangeCenter: (param: ICenter) => void | undefined;
  }
}

export {};
