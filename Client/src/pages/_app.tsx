import Layout from '@/components/Layout/Layout';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import Navbar from '@/components/Navbar/Navbar';
import MainPage from '@/components/MainPage/MainPage';
import Image from 'next/image';
import Background from '../assets/images/background.png';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: 'be72e05e-2712-4d85-8d2f-214df749013f',
      }}
    >
      <div className="min-h-screen">
        <Image
          src={Background}
          alt="Background Image"
          layout="fill"
          quality={100}
          className="-z-10"
        />
        <Navbar />
        <MainPage />
      </div>
    </DynamicContextProvider>
  );
}
