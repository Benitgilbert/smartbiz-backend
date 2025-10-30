const generateAISummary = (type, summary) => {
  switch (type) {
    case "monthly":
      return `This month saw ${summary.total} orders. Top product: ${summary.topProduct}. Delivered: ${summary.delivered}, Cancelled: ${summary.cancelled}.`;

    case "daily":
      return `Today’s report includes ${summary.total} orders. Top customization: ${summary.topCustomization}.`;

    case "product":
      return `Product report shows ${summary.total} orders. Top customer: ${summary.topCustomer}. Delivered: ${summary.delivered}.`;

    case "customer":
      return `Customer placed ${summary.total} orders. Total spent: ${summary.totalSpent.toLocaleString()} RWF. Favorite product: ${summary.mostOrderedProduct}.`;

    case "status":
      return `There are ${summary.total} orders with status "${summary.status}".`;

    case "revenue":
      return `Revenue totaled ${summary.totalRevenue.toLocaleString()} RWF. Average order value: ${summary.avgOrderValue}. Top product: ${summary.topProduct}.`;

    case "custom-range":
      return `Custom range includes ${summary.total} orders. Top product: ${summary.topProduct}. Delivered: ${summary.delivered}.`;

    default:
      return `Report includes ${summary.total || summary.totalOrders || 0} entries.`;
  }
};

module.exports = generateAISummary;