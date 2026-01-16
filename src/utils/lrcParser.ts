/**
 * 解析 LRC 歌词文件
 * @param lrcContent LRC 文件内容
 * @returns 解析后的歌词数组，包含时间戳和歌词文本
 */
export function parseLrc(lrcContent: string): Array<{ time: number; text: string }> {
  const lines = lrcContent.split('\n');
  const lyrics: Array<{ time: number; text: string }> = [];

  // LRC 时间戳格式: [mm:ss.xx] 或 [mm:ss.xxx]
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;

  lines.forEach(line => {
    const match = line.match(timeRegex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = parseInt(match[3].padEnd(3, '0'), 10); // 补全为3位数
      const text = match[4].trim();

      const time = minutes * 60 + seconds + milliseconds / 1000;
      
      if (text) {
        lyrics.push({ time, text });
      }
    }
  });

  // 按时间排序
  return lyrics.sort((a, b) => a.time - b.time);
}

/**
 * 根据当前播放时间获取对应的歌词
 * @param lyrics 解析后的歌词数组
 * @param currentTime 当前播放时间（秒）
 * @returns 当前时间对应的歌词文本，如果没有则返回空字符串
 */
export function getCurrentLyric(lyrics: Array<{ time: number; text: string }>, currentTime: number): string {
  if (!lyrics || lyrics.length === 0) return '';

  // 找到当前时间对应的歌词
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (currentTime >= lyrics[i].time) {
      return lyrics[i].text;
    }
  }

  return '';
}
