'use strict';

const StateList = require('./StateApi/statelist.js');
const Statistic = require('./statistic');

class StatisticList extends StateList {

    constructor(ctx) {
        super(ctx,'org.secureclinic.statisticlist');
        this.use(Statistic);
    }

    async addStatistic(statistic) {
        return this.addState(statistic);
    }

    async getStatistic(hospitalCode) {
        return this.getState(hospitalCode);
    }

    async statisticExists(hospitalCode) {
        return this.stateExists(hospitalCode);
    }

    async updateStatistic(statistic) {
        return this.updateState(statistic);
    }

    async removeStatistic(hospitalCode) {
        return this.deleteState(hospitalCode);
    }

    async getAllStatistics() {
        return this.getAllStates();
    }
}

module.exports = StatisticList;