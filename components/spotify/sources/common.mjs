import spotify from "../spotify.app.mjs";

export default {
  props: {
    spotify,
    timer: {
      label: "Polling interval",
      description: "How often to poll the Spotify API for new events",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  methods: {
    daysAgo(days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);
      return daysAgo;
    },
  },
};
