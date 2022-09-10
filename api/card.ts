import { CardResponseDto } from '~/dto/card.response.dto';
import { CardStatusEnum } from '~/types/enum/cardStatus.enum';

export const cardList = (): CardResponseDto[] => [
  {
    id: 'open',
    status: 'open' as CardStatusEnum.open,
    result: [
      {
        name: 'Min Investment',
        value: '0.01 BNB',
      },
      {
        name: 'Max Investment',
        value: '1000 BNB',
      },
    ],
  },
  {
    id: 'empty',
    status: 'empty' as CardStatusEnum.empty,
  },
];
