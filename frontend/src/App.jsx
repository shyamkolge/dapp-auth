import { useState, useEffect } from 'react';
import Web3 from 'web3';
import UserAuthentication from '../../dapp/build/contracts/UserAuthentication.json';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [account, setAccount] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' or 'signup'

  useEffect(() => {
    // Check if already connected
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            initWeb3();
          }
        });
    }
  }, []);

  const initWeb3 = async () => {
    try {
      setIsLoading(true);
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

      setWeb3(web3Instance);
      setContract(contractInstance);
      setIsConnected(true);
      setStatusMessage('Wallet connected successfully!');
    } catch (error) {
      setStatusMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      setStatusMessage('Please connect your wallet first');
      return;
    }
    if (!username || !password) {
      setStatusMessage('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const hashedPassword = Web3.utils.sha3(password);

    try {
      await contract.methods.register(username, hashedPassword)
        .send({ from: account });
      setStatusMessage('User registered successfully!');
      setUsername('');
      setPassword('');
    } catch (error) {
      setStatusMessage(error.message || 'Error registering user.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!isConnected) {
      setStatusMessage('Please connect your wallet first');
      return;
    }
    if (!username || !password) {
      setStatusMessage('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const hashedPassword = Web3.utils.sha3(password);

    try {
      const valid = await contract.methods
        .validateUser(username, hashedPassword)
        .call({ from: account });

      if (valid) {
        setStatusMessage('Login successful!');
        setUsername('');
        setPassword('');
      } else {
        setStatusMessage('Invalid credentials.');
      }
    } catch (error) {
      setStatusMessage(error.message || 'Error during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="auth-container">
        <h1>Web3 Authentication</h1>
        
        {!isConnected && (
          <button 
            className="connect-wallet-btn"
            onClick={initWeb3}
            disabled={isLoading}
          >
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}

        {isConnected && (
          <>
            <div className="tab-buttons">
              <button 
                className={`tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
                onClick={() => setActiveTab('signin')}
              >
                Sign In
              </button>
              <button 
                className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={activeTab === 'signin' ? handleSignIn : handleSignUp}>
              <div className="form-group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter Username"
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  disabled={isLoading}
                />
              </div>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : (activeTab === 'signin' ? 'Sign In' : 'Sign Up')}
              </button>
            </form>
          </>
        )}

        {statusMessage && (
          <div className={`status-message ${statusMessage.includes('Error') ? 'error' : 'success'}`}>
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
