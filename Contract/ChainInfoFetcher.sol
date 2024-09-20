// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

interface IERC721 {
    function balanceOf(address owner) external view returns (uint256);
}

contract ChainInfoFetcher {

    // Get the latest block number
    function getLatestBlock() external view returns (uint256) {
        return block.number;
    }

    // Get the current gas price in wei
    function getGasPrice() external view returns (uint256) {
        return tx.gasprice;
    }

    // Get the balance of a specific ERC20 token for an address
    function getERC20Balance(address tokenAddress, address user) external view returns (uint256) {
        IERC20 token = IERC20(tokenAddress);
        return token.balanceOf(user);
    }

    // Get the balance of a specific ERC721 NFT for an address
    function getNFTBalance(address nftAddress, address user) external view returns (uint256) {
        IERC721 nft = IERC721(nftAddress);
        return nft.balanceOf(user);
    }

    // Get the native ETH balance of an address
    function getNativeBalance(address user) external view returns (uint256) {
        return user.balance;
    }

    // Get block timestamp (time of the latest block)
    function getBlockTimestamp() external view returns (uint256) {
        return block.timestamp;
    }

    // Get the current chain ID (useful in multi-chain dApps)
    function getChainID() external view returns (uint256) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return id;
    }

    // Get the base fee (EIP-1559, useful for gas estimations)
    function getBaseFee() external view returns (uint256) {
        return block.basefee;
    }

    // Get the transaction origin address (the address that started the transaction)
    function getTxOrigin() external view returns (address) {
        return tx.origin;
    }
}
