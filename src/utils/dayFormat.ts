import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

// 设置为中文
dayjs.locale('zh-cn');
// 加载插件
dayjs.extend(relativeTime);

export default function dayFormat(date: string | number | Date) {
  return dayjs(date).fromNow();
}
