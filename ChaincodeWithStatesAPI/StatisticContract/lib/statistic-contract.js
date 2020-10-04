'use strict';

const { Contract, Context } = require('fabric-contract-api');

const Statistic = require('./statistic.js');
const Stat = require('./stats.js');
const StatisticList = require('./statisticList.js');

class StatisticContext extends Context {
    constructor() {
        super();
        this.statisticList = new StatisticList(this);
    }
}

class StatisticContract extends Contract {

    constructor() {
        super('org.secureclinic.statistic');
    }

    createContext() {
        return new StatisticContext();
    }

    async instantiate(ctx) {
        let stat = Stat.createInstance(Date.now(), 0, 0);
        let statistic1 = Statistic.createInstance('AA', [stat]);
        let statistic2 = Statistic.createInstance('AD', [stat]);
        await ctx.statisticList.addStatistic(statistic1);
        await ctx.statisticList.addStatistic(statistic2);
    }

    async addStatistic(ctx, statistic) {
        const modeledStatistic = Statistic.fromJSON(statistic, Statistic);
        const statisticExists = await ctx.statisticList.statisticExists(modeledStatistic.getHospitalCode());
        if (!statisticExists) {
            const statisticData = await ctx.statisticList.addStatistic(modeledStatistic);
            return statisticData;
        } else {
            throw new Error(`Statistic with hospitalCode ${modeledStatistic.hospitalCode} already exists!`);
        }
    }

    async getStatistic(ctx, hospitalCode) {
        let statisticData = await ctx.statisticList.getStatistic(hospitalCode);
        return statisticData;
    }

    async updateStatistic(ctx, newStatistic) {
        const modeledStatistic = Statistic.fromJSON(newStatistic, Statistic);
        let statistic = await ctx.statisticList.updateStatistic(modeledStatistic);
        return statistic;
    }

    async removeStatistic(ctx, hospitalCode) {
        let statisticRemoved = await ctx.statisticList.removeStatistic(hospitalCode);
        return statisticRemoved;
    }

    async getAllStatistics(ctx) {
        let allStatistics = await ctx.statisticList.getAllStatistics();
        return new (Statistic)(allStatistics);
    }

}
module.exports = StatisticContract;