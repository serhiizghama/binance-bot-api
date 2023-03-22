
export const USDT = "usdt"
export interface ITickerPrice {
    symbol: string;
    price: number;
}

export interface ITicker24hr {
    symbol: string;
    priceChange: string;
    priceChangePercent: string;
    weightedAvgPrice: string;
    prevClosePrice: string;
    lastPrice: string;
    lastQty: string;
    bidPrice: string;
    bidQty: string;
    askPrice: string;
    askQty: string;
    openPrice: string;
    highPrice: string;
    lowPrice: string;
    volume: string;
    quoteVolume: string;
    openTime: number;
    closeTime: number;
    firstId: number;
    lastId: number;
    count: number;
}

export interface BinanceExchangeInfo {
    timezone: string;
    serverTime: number;
    rateLimits: {
        rateLimitType: string;
        interval: string;
        intervalNum: number;
        limit: number;
    }[];
    exchangeFilters: {
        filterType: string;
        minPrice?: string;
        maxPrice?: string;
        tickSize?: string;
        multiplierUp?: string;
        multiplierDown?: string;
        avgPriceMins?: number;
        minQty?: string;
        maxQty?: string;
        stepSize?: string;
        minNotional?: string;
        applyToMarket?: boolean;
        limit?: number;
        maxNumOrders?: number;
        maxNumAlgoOrders?: number;
    }[];
    symbols: {
        symbol: string;
        status: string;
        baseAsset: string;
        baseAssetPrecision: number;
        quoteAsset: string;
        quotePrecision: number;
        quoteAssetPrecision: number;
        baseCommissionPrecision: number;
        quoteCommissionPrecision: number;
        orderTypes: string[];
        icebergAllowed: boolean;
        ocoAllowed: boolean;
        quoteOrderQtyMarketAllowed: boolean;
        isSpotTradingAllowed: boolean;
        isMarginTradingAllowed: boolean;
        filters: {
            filterType: string;
            minPrice?: string;
            maxPrice?: string;
            tickSize?: string;
            multiplierUp?: string;
            multiplierDown?: string;
            avgPriceMins?: number;
            minQty?: string;
            maxQty?: string;
            stepSize?: string;
            minNotional?: string;
            applyToMarket?: boolean;
            limit?: number;
            maxNumOrders?: number;
            maxNumAlgoOrders?: number;
        }[];
        permissions: string[];
    }[];
}
