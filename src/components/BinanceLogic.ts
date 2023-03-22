import { BinanceApi } from "./binanceApi";


export class BinanceLogic {
    private api: BinanceApi | undefined;
    private volatility: any;
    private updateDate: Date = new Date();

    public async getVolatility() {
        if (!this.volatility) {
            await this.calculator();
        }
        return this.volatility;
    }

    public async worker() {
        while (true) {
            await this.calculator();
            this.updateDate = new Date();
            console.log("start sleep");
            await new Promise(resolve => setTimeout(resolve, 200000));
            console.log("end sleep");
        }
    }

    public async calculator() {
        console.log("inside calculator");
        const result: any[] = [];
        const listOfPairs = await this.getSymbolCurrency();
        // const firstTenElements = listOfPairs.slice(0, 5);
        const firstTenElements = listOfPairs;
        const listOfPairsVolume = await this.addVolumeToPairs(firstTenElements);

        for (const pair of Object.keys(listOfPairsVolume)) {
            const volume = listOfPairsVolume[pair];
            const endTime: number = Date.now();
            const startTime: number = Date.now() - 3600 * 1000;

            let summa = 0;
            let count = 0;

            const candles = await this.getApi().getCandles(pair, "5m", startTime, endTime);
            for (const candle of candles) {
                const high = +candle.high;
                const low = +candle.low;
                const average = (high - low) * 100 / high;
                summa += average;
                count += 1
            }

            if (summa !== 0 || count != 0) {
                result.push({
                    pair,
                    volume,
                    averagePercent: summa / count,
                })
            }


        }
        this.volatility = result;
        return result;
    }

    public getUpdateDate(): Date {
        return this.updateDate;
    }

    private async getSymbolCurrency() {
        const info = await this.getApi().getExchangeInfo();
        const symbols = info.symbols;
        const currency: string[] = [];
        for (const symbol of symbols) {
            const quoteAsset = symbol.quoteAsset;
            // if (quoteAsset === "BTC" || quoteAsset === "USDT" || quoteAsset === "BUSD") {
            if (quoteAsset === "BTC" || quoteAsset === "USDT") {
                currency.push(symbol.symbol);
            }
        }
        return currency;
    }

    private async addVolumeToPairs(pairs: string[]) {
        const pairsVolume: { [key: string]: string } = {};
        for (const pair of pairs) {
            const candle = await this.getApi().getCandles(pair, "1d");
            pairsVolume[pair] = candle[0].volume;
        }

        return pairsVolume;
    }

    private getApi() {
        if (!this.api) {
            this.api = new BinanceApi();
        }
        return this.api;
    }

}