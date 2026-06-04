const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

export function fmt(n: number): string {
    if (!isFinite(n) || isNaN(n)) return '0';
    if (n < 0) return '-' + fmt(-n);

    let idx = 0;
    let val = n;
    while (val >= 1000 && idx < SUFFIXES.length - 1) {
        val /= 1000;
        idx++;
    }

    if (idx === 0) return Math.floor(val).toLocaleString();

    if (val >= 100) return val.toFixed(1) + SUFFIXES[idx];
    if (val >= 10) return val.toFixed(2) + SUFFIXES[idx];
    return val.toFixed(3) + SUFFIXES[idx];
}

export function fmtRate(n: number): string {
    if (n === 0) return '0/s';
    const sign = n < 0 ? '~' : '+';
    return sign + fmt(Math.abs(n)) + '/s';
}

export function fmtPct(n: number, decimals = 0): string {
    return n.toFixed(decimals) + '%';
}
