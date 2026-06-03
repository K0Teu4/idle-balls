export class IncomeTracker {

    private readonly samples: {
        time: number;
        amount: number;
    }[] = [];

    private readonly windowMs = 30_000;

    record(amount: number): void {

        const now = Date.now();

        this.samples.push({
            time: now,
            amount
        });

        this.prune(now);
    }

    getPerSecond(): number {

        this.prune(Date.now());

        if (this.samples.length === 0) {
            return 0;
        }

        const total =
            this.samples.reduce(
                (sum, s) => sum + s.amount,
                0
            );

        const oldest =
            this.samples[0]!.time;

        const span =
            Math.max(
                1000,
                Date.now() - oldest
            );

        return total / (span / 1000);
    }

    private prune(now: number): void {

        const cutoff =
            now - this.windowMs;

        while (
            this.samples.length > 0 &&
            this.samples[0]!.time < cutoff
        ) {

            this.samples.shift();
        }
    }
}
