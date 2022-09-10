import { format } from 'date-fns';

export const getFormatDate = (date: Date, formatStr: string = 'd LLLL y   p') =>
  format(date, formatStr);
