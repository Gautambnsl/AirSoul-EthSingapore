import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { SquareArrowOutUpRight, Upload } from 'lucide-react';
import axios from 'axios';
import { handleMint } from '@/middleware/integration';

const MainPage = () => {
  const [activeTab, setActiveTab] = useState<string>('create');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('All');
  const [nftData, setNftData] = useState({
    name: '',
    description: '',
    image: null as File | null | undefined,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNftData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files?.[0]) {
      setNftData((prevState) => ({
        ...prevState,
        image: e?.target?.files?.[0],
      }));
    }
  };

  const uploadImageToPinata = async (file: File) => {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(url, formData, {
        headers: {
          pinata_api_key: '411dd1142b5de31e2450',
          pinata_secret_api_key:
            '9508b26f3e6902440bd53fb664ea3cdaaf4db4f40d88cef3cd76105bd240c9d7',
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading image to Pinata:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nftData.image) return;

    const imageHash = await uploadImageToPinata(nftData.image);
    if (!imageHash) return;

    const metadata = {
      name: nftData.name,
      description: nftData.description,
      image: `https://gateway.pinata.cloud/ipfs/${imageHash}`,
    };

    const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
    try {
      const response = await axios.post(url, metadata, {
        headers: {
          pinata_api_key: '411dd1142b5de31e2450',
          pinata_secret_api_key:
            '9508b26f3e6902440bd53fb664ea3cdaaf4db4f40d88cef3cd76105bd240c9d7',
          'Content-Type': 'application/json',
        },
      });

      if (response?.status === 200) {
        blockchainScript(response?.data?.IpfsHash);
        setNftData({ name: '', description: '', image: null });
      }
    } catch (error) {
      console.error('Error uploading metadata to Pinata:', error);
    }
  };

  const blockchainScript = async (ipfs: string) => {
    console.log('ipfs', ipfs);
    handleMint();
  };

  const networkUrls: any = {
    All: 'https://t.me/AirSoul_Bot',
    Hedera: 'https://t.me/Hedera_AirSoul_Bot',
    Rootstock: 'https://t.me/Rootstock_AirSoul_Bot',
    Oasis: 'https://t.me/Oasis_AirSoul_Bot',
    Airdao: 'https://t.me/AirDao_AirSoul_Bot',
    Fhenix: 'https://t.me/Fhenix_AirSoul_Bot',
    Morph: 'https://t.me/Morph_AirSoul_Bot',
  };

  const handleRedirect = () => {
    const redirectUrl = networkUrls[selectedNetwork];
    window.open(redirectUrl, '_blank');
  };

  return (
    <main className="max-w-4xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      {/* <Card className="bg-white shadow-lg rounded-lg mb-10">
        <CardContent className="p-3">
          <p className="text-gray-700">
            This is your new box content. You can customize it further as per
            your needs.
          </p>
        </CardContent>
      </Card> */}
      <Card className="bg-white shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-[#3569dd] text-2xl font-bold">
            NFT Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="view"
                className={`text-[#447cfb] hover:text-[#3569dd] q transition-colors duration-200 ${
                  activeTab === 'view'
                    ? 'bg-[#447cfb] text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Telegram Bot
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className={`text-[#447cfb] hover:text-[#3569dd]
                  transition-colors duration-200 ${
                    activeTab === 'create'
                      ? 'bg-[#447cfb] text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
              >
                Mint NFT
              </TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="nft-name"
                    className="text-gray-700 font-medium"
                  >
                    NFT Name
                  </Label>
                  <Input
                    id="nft-name"
                    name="name"
                    placeholder="Enter NFT name"
                    value={nftData?.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="nft-image"
                    className="text-gray-700 font-medium"
                  >
                    Upload NFT Image
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="nft-image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      required
                      className="hidden"
                    />
                    <Button
                      type="button"
                      className="bg-[#447cfb] hover:bg-[#3569dd] text-white"
                      onClick={() =>
                        document.getElementById('nft-image')?.click()
                      }
                    >
                      <Upload className="mr-2 h-4 w-4" /> Choose File
                    </Button>
                    <span className="text-sm text-gray-500">
                      {nftData?.image ? nftData?.image?.name : 'No file chosen'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="nft-description"
                    className="text-gray-700 font-medium"
                  >
                    NFT Description
                  </Label>
                  <Textarea
                    id="nft-description"
                    name="description"
                    placeholder="Enter NFT description"
                    value={nftData?.description}
                    // @ts-ignore
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-[#447cfb] hover:bg-[#3569dd] text-white w-full py-2"
                >
                  Submit NFT
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="view">
              <div className="text-center pt-6">
                <div className="flex justify-between items-end mb-4">
                  <div className="flex gap-4 items-center">
                    <Label className="text-base text-[#3569dd]">
                      Select Network
                    </Label>
                    <select
                      id="network-select"
                      className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#447cfb] transition duration-200 ease-in-out"
                      value={selectedNetwork}
                      onChange={(e) => setSelectedNetwork(e.target.value)}
                    >
                      <option value="All">Choose option...</option>
                      <option value="Hedera">Hedera</option>
                      <option value="Rootstock">Rootstock</option>
                      <option value="Oasis">Oasis Protocol</option>
                      <option value="Airdao">Airdao</option>
                      <option value="Fhenix">Fhenix</option>
                      <option value="Morph">Morph</option>
                    </select>
                    {/* {selectedNetwork !== 'All' && ( */}
                      <Button
                        className="bg-[#447cfb] hover:bg-[#3569dd] w-52 flex flex-row justify-around p-2 rounded-md text-white transition duration-300 ease-in-out transform hover:scale-105"
                        onClick={() => handleRedirect()}
                      >
                        Go to Telegram Bot <SquareArrowOutUpRight />
                      </Button>
                    {/* )} */}
                  </div>
                </div>

                <div className="text-left space-y-4">
                  <h2 className="text-base font-semibold">
                    Telegram Bot Commands
                  </h2>
                  <p className="text-sm text-gray-600">
                    You can use the following commands in our Telegram bot:
                  </p>
                  <ul className="list-disc pl-8 space-y-2 text-sm text-gray-600">
                    <li>
                      <strong className="text-[#3569dd]">/networkinfo</strong> –
                      Get current network info
                    </li>
                    <li>
                      <strong className="text-[#3569dd]">/gasprice</strong> –
                      Get current gas price
                    </li>
                    <li>
                      <strong className="text-[#3569dd]">
                        /block [block_number]
                      </strong>{' '}
                      – Get details about a specific block
                    </li>
                    <li>
                      <strong className="text-[#3569dd]">
                        /balance [address]
                      </strong>{' '}
                      – Fetch the native AMBR token balance for an address
                    </li>
                    <li>
                      <strong className="text-[#3569dd]">
                        /erc20balance [address] [token_contract_address]
                      </strong>{' '}
                      – Fetch ERC20 token balance
                    </li>
                    <li>
                      <strong className="text-[#3569dd]">
                        /sendnative [private_key] [recipient_address] [amount]
                      </strong>{' '}
                      – Send native currency
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
};

export default MainPage;
