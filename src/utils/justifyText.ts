export function justifyText(text: string): string {
    console.log('Starting text justification');
    const words = text.split(/\s+/);
    let line = '';
    const lines = [];
  
    for (const word of words) {
      if ((line + word).length > 80) {
        const spacesToAdd = 80 - line.length;
        const gaps = line.split(' ').length - 1;
        if (gaps > 0) {
          const extraSpacePerGap = Math.floor(spacesToAdd / gaps);
          const remainder = spacesToAdd % gaps;
  
          line = line.replace(/ /g, (match, offset) =>
            offset < remainder ? ' '.repeat(extraSpacePerGap + 2) : ' '.repeat(extraSpacePerGap + 1)
          );
        }
        lines.push(line);
        line = word;
      } else {
        line += (line ? ' ' : '') + word;
      }
    }
    lines.push(line);
    console.log('Finished text justification');
    return lines.join('\n');
  }
  