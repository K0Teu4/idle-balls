export class EconomyManager {

    private money = 10;

    setMoney(
        money: number
    ): void {

        this.money = money;
    }

    addMoney(
        amount: number
    ): void {

        this.money += amount;
    }

    spendMoney(
        amount: number
    ): boolean {

        if (
            this.money < amount
        ) {
            return false;
        }

        this.money -= amount;

        return true;
    }

    canAfford(
        amount: number
    ): boolean {

        return this.money >= amount;
    }

    getMoney(): number {

        return this.money;
    }
}