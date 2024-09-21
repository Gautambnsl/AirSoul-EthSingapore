import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import Eth from '@ledgerhq/hw-app-eth';
import { ethers } from 'ethers';
import abi from './abi.json';

export const connectLedger = async () => {
  try {
    // Connect to the Ledger device via WebUSB
    const transport = await TransportWebUSB.create();
    const eth = new Eth(transport);

    // Get Ledger device information (Ethereum app)
    const result = await eth.getAppConfiguration();
    console.log('Ledger App Info:', result);

    // Get the Ethereum address from Ledger
    const addressInfo = await eth.getAddress("44'/60'/0'/0/0");
    console.log('Ethereum Address:', addressInfo.address);

    return addressInfo;
  } catch (error) {
    console.error('Ledger connection error:', error);
    throw error;
  }
};

export const handleMint = async () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      'https://network.ambrosus-test.io'
    );
    console.log('provider', provider);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      '0xD4890478277591Bc1CEa55B25620499439b8617B',
      abi,
      signer
    );
    console.log('contract', contract);

    const tx = await contract.safeMint(
      '0x963382c89070cc2eb07ff5f315877f25a81fd83c',
      '12'
    );
    await tx.wait();
    console.log('Minting transaction successful:', tx);
  } catch (error) {
    console.error('Error:', error);
  }
};
