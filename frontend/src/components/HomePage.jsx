import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import UserAuthentication from '../../../dapp/build/contracts/UserAuthentication.json';
import Admin from './Admin';

function HomePage() {
  const [username, setUsername] = useState('');
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    initWeb3();
  }, []);

  const initWeb3 = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }

      const web3Instance = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3Instance.eth.getAccounts();
      setAccount(accounts[0]);

      const networkId = await web3Instance.eth.net.getId();
      const deployedNetwork = UserAuthentication.networks[networkId];
      
      if (!deployedNetwork) {
        throw new Error('Please connect to the correct network');
      }

      const contractInstance = new web3Instance.eth.Contract(
        UserAuthentication.abi,
        deployedNetwork.address
      );

      setContract(contractInstance);
      
      // Fetch user data after contract is initialized
      const user = await contractInstance.methods.usersMapping(accounts[0]).call();
      setUsername(user.username);
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing web3:', error);
      navigate('/');
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome, {username}!</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
      
      <div className="home-content">
        <Admin contract={contract} account={account} />
      </div>
    </div>
  );
}

export default HomePage; 