import { axios } from "@pipedream/platform";
import loopmessage from "../../loopmessage.app.mjs";

export default {
  key: "loopmessage-new-alert-received",
  name: "New Alert Received",
  description: "Emit new event when an alert is received via webhook. [See the documentation](https://docs.loopmessage.com/imessage-conversation-api/messaging/webhooks)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    loopmessage,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    alertType: {
      propDefinition: [
        loopmessage,
        "alertType",
      ],
    },
    senderName: {
      propDefinition: [
        loopmessage,
        "senderName",
      ],
    },
  },
  hooks: {
    async activate() {
      // Logic for activation can be added here if needed
    },
    async deactivate() {
      // Logic for deactivation can be added here if needed
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;

    // Signature validation logic should be implemented here if the app supports it

    this.$emit(body, {
      id: body.webhook_id,
      summary: `New alert received: ${body.alert_type} from ${body.sender_name}`,
      ts: Date.parse(body.created_at), // Assuming 'created_at' is a field in the webhook body
    });

    this.http.respond({
      status: 200,
    });
  },
};
