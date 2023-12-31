import mysql from "../mysql.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    mysql,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastResult() {
      return this.db.get("lastResult");
    },
    /**
     * Sets lastResult in db. Since results are ordered by the specified column,
     * we can assume the maximum result for that column is in the first row returned.
     * @param {object} rows - The rows returned to be emitted.
     * @param {string} column - Name of the table column to order by
     */
    _setLastResult(rows, column) {
      if (rows.length) {
        this.db.set("lastResult", rows[0][column]);
      }
    },
    iterateAndEmitEvents(results = []) {
      results.forEach((result) => {
        const meta = this.generateMeta(result);
        this.$emit(result, meta);
      });
    },
    /**
     * Used by components that call listRows(). Gets lastResult,
     * gets rows, sets lastResult, and returns rows.
     * @param {string} column - Name of the table column to order by
     */
    async listRowResults(column) {
      const { table } = this;

      let lastResult = this._getLastResult();
      const rows = await this.mysql.listRows({
        table,
        column,
        lastResult,
      });
      this._setLastResult(rows, column);
      this.iterateAndEmitEvents(rows);
    },
    async listTopRows(column, maxCount = 10) {
      const rows = await this.mysql.listMaxRows({
        table: this.table,
        column,
        maxCount,
      });
      this._setLastResult(rows, column);
      this.iterateAndEmitEvents(rows);
    },
  },
  async run() {
    await this.listResults();
  },
};
