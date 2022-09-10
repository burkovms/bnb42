import { CardStatusEnum } from '~/types/enum/cardStatus.enum';

export interface CardData {
  name: string;
  value: any;
  key?: number | string;
  сoin?: string;
}
export interface CardResponseDto {
  id: string;
  status:
    | CardStatusEnum.open
    | CardStatusEnum.active
    | CardStatusEnum.complete
    | CardStatusEnum.empty;
  data?: CardData[];
  result?: CardData[];
}
