import React, { useState } from 'react';
import { ethers } from 'ethers'
import Greeting from './artifacts/contracts/Greeting.sol/Greeting.json'

const greeterAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

function App() {

  const [greeting, setGreetingValue] = useState("")

  async function fetchGreeting() {
    if (!typeof (window.ethereum) !== undefined) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeting.abi, provider)
      try {
        const data = await contract.greet()
        setGreetingValue(data)
        console.log('data: ', data)
      } catch (err) {
        console.log('Error: ', err);
      }
    }
  }

  const setGreeting = async (value) => {
    if (!value) return
    if (typeof (window.ethereum) !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeting.abi, signer)
      try {
        const transaction = await contract.setGreeting(value)
        await transaction.wait()
        fetchGreeting()
      } catch (error) {
        console.log('Error: ', error)
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await setGreeting(event.target.greetingInput.value)
    setGreetingValue(event.target.greetingInput.value)
    event.target.greetingInput.value = ""
  }

  const requestAccount = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  return (

    <div className='w-full flex h-screen '>
      <div className='shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4 m-auto'>
        <div className='text-gray-600 font-bold text-lg mb-2'>
          React Ethereum dapp
        </div>

        <div className='w-full border-4 p-2 mb-4 rounded border-gray-400'>
          <div className='text-gray-600 font-bold text-md mb-2'>
            Fetch Greeting Message From Smart Contract
          </div>

          <div className='flex'>
            <button className='bg-blue-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>Fetch Message</button>
          </div>
        </div>

        <div className='w-full border-4 p-2 mb-4 rounded border-gray-400'>
          <div className='text-gray-600 font-bold text-md mb-2'>
            Set Greeting Message On Smart Contract
          </div>

          <form className='flex items-center justify-between'
            onSubmit={event => handleSubmit(event)}
          >
            <input className='shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight '
              name='greetingInput' />

            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
              Set Greeting</button>
          </form>
        </div>

        <div className='w-full border-4 p-2 mb-4 rounded border-gray-400'>
          <div className='text-gray-600 font-bold text-md mb-2'>
            Greeting Message
          </div>
          <p>
            {greeting}
          </p>
        </div>
      </div>
    </div>
  )
}

export default App;