const axios = require('axios');

const payVIP = async (id) => {
  let axiosCFG = {
    method: "POST",
    baseURL: process.env.PAYMENTS_SERVICE,
    url: "/deposit",
    headers: {
      'Content-Type': 'application/json',
      user: "" + id
    },
    data: {
      amountInGwei: 1000
    }
  }
  let walletId;
  const axiosRes = await axios(axiosCFG)
  walletId = axiosRes.data.id;
  return walletId
};

module.exports = {
  payVIP
};
