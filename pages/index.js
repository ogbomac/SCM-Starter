import {useState, useEffect} from "react";
import {ethers} from "ethers";
import abi from "./contract/abi.json"

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [x, setX] = useState(undefined);
  const [y, setY] = useState(undefined);
  const [z, setZ] = useState(undefined);
  const [value, setValue] = useState(undefined);

  const contractAddress = "0xA1f037F59adeE942a74b6130D5b4C2deE962ffc1";

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getContract();
  };

  const getContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const calculator = new ethers.Contract(contractAddress, abi, signer);
 
    setContract(calculator);
  }

  const getValue = async() => {
    if (contract) {
      setValue((await contract.value()).toNumber());
    }
  }

  const add = async(x, y) => {
    if (contract) {
      setZ((await contract.add(x,y)).toNumber());
    }
  }

  const subtract = async(x, y) => {
    if (contract) {
      setZ((await contract.subtract(x,y)).toNumber());
    }
  }

  const save = async(z) => {
    if (contract) {
      let tx = await contract.save(z);
      await tx.wait()
      getValue();
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (value == undefined) {
      getValue();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your value: {value}</p>
        {z == undefined ? <p>no calculation yet</p> : <p> the result is {z}</p>     }
        <div>
          <label>x value</label>
          <input value={x} onChange={(event) => {setX(event.target.value)}}></input>
        </div>
        <div>
          <label>y value</label>
          <input value={y} onChange={(event) => {setY(event.target.value)}}></input>
        </div>
        <button onClick={() => {add(x, y)}}> Add the x and y</button>

        <button onClick={() => {subtract(x,y) }}> subtract y from x</button>

        <div><button onClick={() => {save(z)}}> save the result</button></div>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to omac's calculator app!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}
