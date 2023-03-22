// import Binance, { BinanceApiClient } from 'binance-api-node';
import { BinanceExchangeInfo } from "../interface";
import Binance, { Binance as BinanceClient, CandleChartInterval_LT, CandleChartResult } from 'binance-api-node';



export class BinanceApi {
    private api: BinanceClient;

    constructor() {
        this.api = Binance();
    }

    public async getExchangeInfo(): Promise<BinanceExchangeInfo> {
        try {
            const exchangeInfo = await this.api.exchangeInfo();
            return exchangeInfo;
        } catch (error) {
            console.error('Error while getting list of cryptocurrency pairs:', error);
            throw new Error("Error while getting list of cryptocurrency pairs");
        }
    }

    public async getCandles(symbol: string, interval: CandleChartInterval_LT, startTime?: number, endTime?: number): Promise<CandleChartResult[]> {
        try {
            const ops = startTime ? { startTime, endTime } : undefined;
            const candles = await this.api.candles({
                symbol: symbol,
                interval,
                limit: 1,
                ...ops,
            });
            return candles;
        } catch (error) {
            console.error(`Error while getting 24-hour trading volume for ${symbol}:`, error);
            throw new Error(`Error while getting 24-hour trading volume for ${symbol}`);
        }
    }
}