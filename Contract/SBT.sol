
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SoulboundToken is ERC721URIStorage, Ownable {

    // Mapping to track if an address has already minted an SBT
    mapping(address => bool) public hasMinted;

    constructor() ERC721("SoulboundToken", "SBT") {}

    // Modifier to ensure the token is non-transferable
    modifier onlyNonTransferable(uint256 tokenId) {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Not owner");
        _;
    }

    // Mint a Soulbound Token (SBT)
    function mint(address to, uint256 tokenId, string memory tokenURI) external onlyOwner {
        require(!hasMinted[to], "SBT already minted for this address");
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        hasMinted[to] = true;
    }

    // Override to prevent transfer of tokens
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        require(from == address(0), "SBT: Token is Soulbound and cannot be transferred");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // Function to burn the SBT (optional, only the owner can burn it)
    function burn(uint256 tokenId) external onlyOwner {
        _burn(tokenId);
    }
}
