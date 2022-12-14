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
  await axios(axiosCFG)
    .then((response) => {
      walletId = response.data.id;
    })
    .catch((error) => {
      return res
        .status(error.response.status)
        .json({err: error.response.data.err, msg: error.response.data.msg})
    });
  return walletId
};

module.exports = {
  payVIP
};
