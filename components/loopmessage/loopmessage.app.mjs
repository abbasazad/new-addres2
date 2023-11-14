import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "loopmessage",
  propDefinitions: {
    alertType: {
      type: "string",
      label: "Alert Type",
      description: "The type of alert received via webhook.",
      options: [
        {
          label: "Message Scheduled",
          value: "message_scheduled",
        },
        {
          label: "Conversation Initiated",
          value: "conversation_inited",
        },
        {
          label: "Message Failed",
          value: "message_failed",
        },
        {
          label: "Message Sent",
          value: "message_sent",
        },
        {
          label: "Message Inbound",
          value: "message_inbound",
        },
        {
          label: "Message Reaction",
          value: "message_reaction",
        },
        {
          label: "Message Timeout",
          value: "message_timeout",
        },
        {
          label: "Group Created",
          value: "group_created",
        },
        {
          label: "Inbound Call",
          value: "inbound_call",
        },
        {
          label: "Unknown Event",
          value: "unknown",
        },
      ],
      required: true,
    },
    senderName: {
      type: "string",
      label: "Sender Name",
      description: "The name of the sender associated with the alert.",
      required: true,
    },
  },
  methods: {
    getBaseUrl(api = constants.API.SERVER) {
      const baseUrl = `${constants.BASE_URL}${constants.VERSION_PATH}`;
      return baseUrl.replace(constants.API_PLACEHOLDER, api);
    },
    getUrl(path, api) {
      return `${this.getBaseUrl(api)}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.authorization_key}`,
        "Loop-Secret-Key": `${this.$auth.secret_api_key}`,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, api, ...args
    } = {}) {
      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, api),
        ...args,
      };
      return axios(step, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    sendMessage(args = {}) {
      return this.post({
        path: "/message/send/",
        ...args,
      });
    },
    singleLookup(args = {}) {
      return this.post({
        api: constants.API.LOOKUP,
        path: "/contact/lookup/",
        ...args,
      });
    },
  },
};
