export class AchievementPointManager {

    private points = 0;

    add(
        amount: number
    ): void {

        this.points += amount;
    }

    getPoints(): number {

        return this.points;
    }

    setPoints(
        points: number
    ): void {

        this.points = points;
    }
}