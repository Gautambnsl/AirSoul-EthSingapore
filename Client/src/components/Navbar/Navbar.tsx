import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Package2, X } from 'lucide-react';
import Ledger from '../../assets/images/ledger.png';
import MetaMask from '../../assets/images/metamask.png';
import Dynamic from '../../assets/images/dynamic.png';
import WorldCoin from '../../assets/images/worldcoin.png';
import Image from 'next/image';
import detectEthereumProvider from '@metamask/detect-provider';
import { connectLedger } from '@/middleware/integration';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import {
  IDKitWidget,
  ISuccessResult,
  VerificationLevel,
} from '@worldcoin/idkit';

const Navbar = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleConnect = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  async function connectWallet() {
    try {
      const provider = await detectEthereumProvider();
      // @ts-ignore
      if (provider && provider === window?.ethereum) {
        console.log('MetaMask is available!');
        await requestWalletAccess();
        handleCloseDialog();
      } else {
        console.log('Please install MetaMask!');
      }
    } catch (err) {
      console.error('Trouble connecting wallet!', err);
    }
  }

  async function requestWalletAccess() {
    try {
      // @ts-ignore
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setWalletAddress(accounts[0]);
    } catch (err) {
      console.error('Error connecting to MetaMask:', err);
    }
  }

  async function checkIfConnected() {
    try {
      // @ts-ignore
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
    }
  }

  useEffect(() => {
    checkIfConnected();
  }, []);

  const handleConnectLedger = async () => {
    try {
      const addressInfo = await connectLedger();
      setWalletAddress(addressInfo?.address);
    } catch (err) {
      console.log(
        'Failed to connect to Ledger. Please make sure the Ledger is connected and the Ethereum app is open.'
      );
    }
  };

  const handleVerify = async (proof: ISuccessResult) => {
    console.log('proof', proof);
    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(proof),
    });
    if (!res.ok) {
      throw new Error('Verification failed.');
    }
  };

  const onSuccess = () => {
    window.location.href = '/success';
    handleCloseDialog();
  };

  // const handleVerify = async (proof: any) => {
  //   console.log('proof', proof);
  //   const response = await fetch(
  //     'https://developer.worldcoin.org/api/v1/verify/app_staging_129259332fd6f93d4fabaadcc5e4ff9d',
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ ...proof, action: "test"}),
  //     }
  //   );
  //   if (response.ok) {
  //     const { verified } = await response.json();
  //     return verified;
  //   } else {
  //     const { code, detail } = await response.json();
  //     throw new Error(`Error Code ${code}: ${detail}`);
  //   }
  // };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Package2 className="h-8 w-8 text-[#447cfb] hover:text-[#3569dd] transition duration-300 mr-2" />
          <span className="text-2xl font-bold text-[#3569dd] tracking-wider hover:text-[#447cfb] transition duration-300">
            NFT Creator
          </span>
        </div>
        <Button
          className="bg-[#447cfb] hover:bg-[#3569dd] text-white py-2 px-4 rounded-lg shadow-lg transition-all duration-300"
          onClick={walletAddress ? undefined : handleConnect}
        >
          {walletAddress
            ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            : 'Connect Wallet'}
        </Button>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-5 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-300"
              onClick={handleCloseDialog}
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Connect Wallet</h2>
            <div className="flex flex-row gap-4 justify-between">
              <div className="flex p-6 bg-gray-100 rounded-lg w-6/12 justify-center hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <div className="flex items-center gap-4 flex-col">
                  <Image
                    src={MetaMask}
                    alt="MetaMask"
                    className="h-12 mb-[1.5rem]"
                    width={50}
                    height={50}
                  />
                  <Button onClick={() => connectWallet()}>Metamask</Button>
                </div>
              </div>
              <div className="flex p-6 bg-gray-100 rounded-lg w-6/12 justify-center hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <div className="flex items-center gap-4 flex-col">
                  <Image
                    src={Ledger}
                    alt="Ledger"
                    className="h-12 mb-[1.5rem]"
                    width={50}
                    height={50}
                  />
                  <Button onClick={() => handleConnectLedger()}>Ledger</Button>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-4 justify-between mt-6">
              <div className="flex p-6 bg-gray-100 rounded-lg w-6/12 justify-center hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <div className="flex items-center gap-4 flex-col">
                  <IDKitWidget
                    app_id="app_staging_22f0224f8518cde238c1b0b61741cbf8"
                    action="your action id"
                    onSuccess={onSuccess}
                    handleVerify={handleVerify}
                    verification_level={VerificationLevel.Device}
                  >
                    {({ open }) => (
                      <>
                        <Image
                          src={WorldCoin}
                          alt="World Coin"
                          className="h-12 mb-[1.5rem]"
                          width={50}
                          height={50}
                        />
                        <Button
                          onClick={() => {
                            open();
                          }}
                        >
                          World Coin
                        </Button>
                        {/* <Button
                          onClick={() => {
                            open();
                          }}
                        >
                          Verify with World Coin
                        </Button> */}
                      </>
                    )}
                  </IDKitWidget>
                </div>
              </div>
              <div className="flex p-6 bg-gray-100 rounded-lg w-6/12 justify-center hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <div className="flex items-center gap-4 flex-col">
                  <Image
                    src={Dynamic}
                    alt="Dynamic"
                    className="h-12 mb-[1.5rem]"
                    width={50}
                    height={50}
                  />
                  <DynamicWidget />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
