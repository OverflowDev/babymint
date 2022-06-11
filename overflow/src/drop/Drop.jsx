import { useAddress, useDisconnect, useMetamask, useNFTDrop } from "@thirdweb-dev/react";
import { useState,useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

import Nft from '../assets/nft.jpg'

function Drop() {

    // Get Supply 
    const [claimedSupply, setClaimedSupply] = useState(null)
    const [totalSupply, setTotalSupply] = useState(null)
    const [priceInEth, setPriceInEth] = useState('')
    const [loading, setLoading] = useState(true)


    const nftDrop = useNFTDrop('0x6a8502CC4AaAcf98D35C6E01D8e1498bDA20bb33')

    // Auth 
    const connectWithMetamask = useMetamask()
    const address = useAddress()
    const disconnect = useDisconnect()
    // Auth ends 

    // Fetch Price 
    useEffect(() => {
      if(!nftDrop) return

      const fetchPrice = async () => {

          const claimConditions = await nftDrop.claimConditions.getAll()
          setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue)
      }

      fetchPrice()

    }, [nftDrop])

    // fetch supply
    useEffect(() => {
      if(!nftDrop) return

        const fetchNFTDropData = async () => {

            setLoading(true)

            const claimed = await nftDrop.getAllClaimed()
            const total = await nftDrop.totalSupply()

            setClaimedSupply(claimed.length)
            setTotalSupply(total)

            setLoading(false)
        }

        fetchNFTDropData()

    }, [nftDrop])

    // Mint Button 
    const mintNft = () => {

        if(!nftDrop || !address) return 
        // How many uique nft 
        const quantity = 1 

        setLoading(true)

        const notification = toast.loading('Minting...', {

        })

        nftDrop.claimTo(address, quantity).then( async (tx) => {

            const receipt = tx[0].receipt
            const claimedTokenId = tx[0].id
            const claimedNft = await tx[0].data()

            toast.success('Mint Successfull', {
                duration: 8000,
            })
            console.log(receipt)
            console.log(claimedTokenId)
            console.log(claimedNft)

        }).catch(err => {
            
            toast.error('Something went wrong')
        }).finally(() => {

            setLoading(false)
            toast.dismiss(notification)
        })
        // console.log('Hello Mint')
    }

  return (
    <div className="container overflow-hidden">
        <Toaster  position="top-center" />

        <nav className='mb-2 border-b-2'>
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">

                    <div className="flex items-center ">
                        <div className="flex-shrink-0 py-2 px-6 text-3xl font-bold">
                            Overflow
                        </div>
                    </div>

                    <div className="block">
                        <div className="ml-10 flex items-center space-x-4">
                            <button className="hidden md:block border-over rounded-lg font-bold  shadow-md shadow-overflow py-1 px-6 ">
                                Rinkeby
                            </button>
                            <div className="">
                                {address && (
                                    <div 
                                        className="hidden md:block rounded-lg font-bold shadow shadow-overflow py-1 px-6">

                                            {address.substring(0,5)}...{address.substring(address.length - 5)}
                                    </div>
                                
                                )}
                            </div>
                            <button 
                                onClick={() => (address ? disconnect() : connectWithMetamask())}
                                className="rounded-full font-bold shadow shadow-overflow py-1 px-6 ">

                               {address ? 
                                (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                 ) : 

                                'Connect Wallet'
                                }
                            </button>
                        </div>
                    </div>

                </div>
            </div>

         </nav>

                
        <div className="grid place-items-center h-screen">
            <div className="flex flex-col md:flex-row gap-11 py-20 px-5 bg-overflow rounded-md shadow-lg md:w-3/4 md:max-w-2xl">
                <div className="text-indigo-500 flex flex-col justify-between">
                    <img src={Nft}  alt="Nft" />
                </div>
                <div className="text-white">
                    <small className="uppercase">Baby Bliss</small>
                    <h3 className="uppercase text-over font-bold text-3xl">Baby Bliss Collection</h3>
                    <small className="text-white ">Exclusive Baby Bliss Collection. First and ever generation</small>
                    
                    {loading ? 
                    (
                        <div className="flex mt-2 justify-start">
                            <div className="flex items-center justify-center space-x-2 animate-pulse">
                                <div className="w-3 h-3 bg-over rounded-full"></div>
                                <div className="w-3 h-3 bg-over rounded-full"></div>
                                <div className="w-3 h-3 bg-over rounded-full"></div>
                            </div>
                        </div>
                    ) : (
                        <h3 className="text-2xl font-semibold mt-9">{claimedSupply} / {totalSupply?.toString()} Minted</h3>
                    )
                    }

                    {/* Mint Button  */}
                    <div className="flex gap-0.5 mt-4">
                        <button 
                            onClick={mintNft}
                            disabled={loading || claimedSupply === totalSupply?.toNumber() || !address}
                            className="bg-white hover:bg-over focus:outline-none transition text-overflow font-bold uppercase px-8 py-3 disabled:bg-gray-500"
                        >

                            {loading ? (
                                <>Loading...</>
                            ) : claimedSupply === totalSupply?.toNumber() ? (
                            <>Sold Out</>
                            ) : !address ? (
                                <>Connect Wallet</>
                            ) : (
                                <span className="font-bold">Mint NFT {priceInEth}</span>
                            )}

                        </button>
                    </div>
                </div>
            </div>
        </div>


    </div>
  )
}

export default Drop