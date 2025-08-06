export function hslToHex(hsl) {
    let regex = /hsl\s*\(\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)\s*%\s*,\s*([+-]?\d+(?:\.\d+)?)\s*%\s*\)/;
    let match = hsl.match(regex);

    if (match) {
        let h = match[1];
        let s = match[2];
        let l = match[3];

        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    return '#ffffff';
}
