export class AchievementPointManager {

    private points = 0;

    add(amount: number): void {

        this.points += amount;
    }

    spend(amount: number): boolean {

        if (this.points < amount) {
            return false;
        }

        this.points -= amount;
        return true;
    }

    getPoints(): number {

        return this.points;
    }

    setPoints(points: number): void {

        this.points = points;
    }
}
