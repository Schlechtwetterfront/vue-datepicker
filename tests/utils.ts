export function dateMatches(a: Date, b: Date) {
    return (
        a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear()
    );
}

export function year(y: number) {
    return new Date(y, 0, 1);
}

export function month(y: number, m: number) {
    return new Date(y, m, 1);
}
