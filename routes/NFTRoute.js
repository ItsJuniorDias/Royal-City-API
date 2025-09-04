const express = require("express");
const dotenv = require("dotenv");

const contractABI = require("../abi/NFT.json");

const { default: axios } = require("axios");

dotenv.config();

const router = express.Router();

router.route("/nfts").post(async (req, res) => {
  const { jsonrpc, method, params, id } = req.body;

  const response = await axios.post(
    "https://mainnet.infura.io/v3/0dfedd423e16477fb3d07ce92e805210",
    {
      jsonrpc,
      method,
      params,
      id,
    }
  );

  // const tx = await contract.mintNFT(address, metadataUrl);
  // await tx.wait();

  res.json({
    success: true,
    data: response.data,
  });
});

module.exports = router;
