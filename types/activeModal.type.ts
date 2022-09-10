import { ModalsEnum } from './enum/modals.enum';

export type ActiveModalType = {
  modal: ModalsEnum;
  data: { [key: string]: any };
} | null;
