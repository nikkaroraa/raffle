const { ethers, network } = require("hardhat")
const fs = require("fs")

const FRONTEND_CONSTANTS_DIR = "../lottery-ui/src/constants"

const FRONTEND_ADDRESSES_FILE = FRONTEND_CONSTANTS_DIR + "/contract-addresses.json"
const FRONTEND_ABI_FILE = FRONTEND_CONSTANTS_DIR + "/abi.json"

module.exports = async function () {
    if (process.env.UPDATE_FRONTEND) {
        console.log("Updating frontend...")
        await updateContractAddresses()
        await updateAbi()
    }
}

async function updateContractAddresses() {
    const raffle = await ethers.getContract("Raffle")

    const chainId = network.config.chainId.toString()
    const contractAddresses = JSON.parse(fs.readFileSync(FRONTEND_ADDRESSES_FILE))
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId].includes(raffle.address)) {
            contractAddresses[chainId].push(raffle.address)
        }
    } else {
        contractAddresses[chainId] = [raffle.address]
    }

    fs.writeFileSync(FRONTEND_ADDRESSES_FILE, JSON.stringify(contractAddresses))
}

async function updateAbi() {
    const raffle = await ethers.getContract("Raffle")

    fs.writeFileSync(FRONTEND_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json))
}

module.exports.tags = ["all", "frontend"]
