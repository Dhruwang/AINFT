import { useState, useEffect } from 'react';


import { ethers } from 'ethers';


// Components

import Navigation from './components/Navigation';

// ABIs
import NFT from './abis/NFT.json'

// Config
import config from './config.json';
import Home from './components/Home';

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [nft, setnft] = useState()

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()

    const nft = new ethers.Contract("0xEF406646A500bfe5fDC2DA3cCbDBa3b4e6201F74",NFT,provider)
    setnft(nft)
  }
  
    const connectHandler = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0])
        setAccount(account);
    }

  useEffect(() => {
    loadBlockchainData()
    connectHandler()
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} connectHandler={connectHandler}/>
      <Home provider={provider} nft={nft} account={account} />

    </div>
  );
}

export default App;
