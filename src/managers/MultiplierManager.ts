export class MultiplierManager {
private level = 0;

setLevel(
    level: number
): void {

    this.level = level;
}

getLevel(): number {

    return this.level;
}

getMultiplier(): number {

    const linear =
        0.05 * this.level;

    const logPart =
        0.5 * Math.log(1 + 0.2 * this.level);

    return Number(
        (1 + linear + logPart).toFixed(2)
    );
}

getCost(): number {

    return Math.floor(
        50 *
        Math.pow(
            2,
            this.level
        )
    );
}

buy(): void {

    this.level++;
}
}