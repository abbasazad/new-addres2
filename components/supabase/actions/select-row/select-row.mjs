import supabase from "../../supabase.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "supabase-select-row",
  name: "Select Row",
  type: "action",
  version: "0.0.3",
  description: "Selects row(s) in a database. [See the docs here](https://supabase.com/docs/reference/javascript/select)",
  props: {
    supabase,
    table: {
      propDefinition: [
        supabase,
        "table",
      ],
    },
    column: {
      propDefinition: [
        supabase,
        "column",
      ],
      optional: true,
    },
    filter: {
      propDefinition: [
        supabase,
        "filter",
      ],
      optional: true,
    },
    value: {
      propDefinition: [
        supabase,
        "value",
      ],
      optional: true,
    },
    orderBy: {
      propDefinition: [
        supabase,
        "column",
      ],
      label: "Order By",
      description: "Column name to order by",
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "Sort ascending or descending",
      options: [
        "ascending",
        "descending",
      ],
      optional: true,
      default: "ascending",
    },
    max: {
      type: "integer",
      label: "Max",
      description: "Maximum number of rows to return",
      default: 20,
    },
  },
  async run({ $ }) {
    const {
      table,
      column,
      filter,
      value,
      orderBy,
      sortOrder,
      max,
    } = this;

    if ((column || filter || value) && !(column && filter && value)) {
      throw new ConfigurationError("If `column`, `filter`, or `value` is used, all three must be entered");
    }

    const response = await this.supabase.selectRow({
      table,
      column,
      filter,
      value,
      orderBy,
      sortOrder,
      max,
    });
    if (response) {
      $.export("$summary", `Successfully retrieved ${response.length} rows from table ${table}`);
    }
    return response;
  },
};
