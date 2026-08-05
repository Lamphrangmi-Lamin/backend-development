const apiAnalytics = {
  sk_test_abc123: {
    userId: 1,
    tier: "free",
    totalRequests: 142,
    endpointHits: {
      "/products": 100,
      "/cart": 42,
    },
  },
  sk_live_xyz987: {
    userId: 2,
    tier: "premium",
    totalRequests: 8504,
    endpointHits: {
      "/products": 4000,
      "/cart": 3000,
      "/orders": 1504,
    },
  },
};

// ? GET analytics
exports.getAnalytics = (req, res) => {
  res.json(apiAnalytics);
};
