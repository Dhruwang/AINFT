import React, { useState } from 'react'
import axios from 'axios';
import { Buffer } from 'buffer';
import { NFTStorage, File } from 'nft.storage'
import { ethers } from 'ethers';
import Spinner from "./Spinner"


export default function (props) {

    const [provider, setProvider] = useState(null)
    const [account, setAccount] = useState(null)
    const [loading, setloading] = useState(false)

    const [name, setName] = useState()
    const [description, setDescription] = useState()
    const [img, setImg] = useState("")
    const [url, setUrl] = useState("")
    const [page, setpage] = useState(1)

    const handleCreateImage = async (e) => {
        e.preventDefault()

        const imageData = createImg()

        const url = await uploadImage(imageData)

    }
    const handleGoBack=()=>{
        setpage(1)
    }
    const handleMintImage =async(e)=>{
        e.preventDefault()
        await mintImage(url)
    }

    const uploadImage = async (imageData) => {
        const nftstorage = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_API_KEY })

        const { ipnft } = await nftstorage.store({
            image: new File([imageData], "image.jpeg", { type: "image/jpeg" }),
            name: name,
            description: description
        })

        const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`
        setUrl(url)
        setpage(3)

        return url

    }

    const createImg = async () => {
        setpage(2)
        
        const URL = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5"
        const response = await axios({
            url: URL,
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
                Accept: 'application/json',
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                inputs: description, options: { wait_for_model: true },
            }),
            responseType: "arraybuffer"
        })

        console.log(response)
        const type = response.headers["content-type"]
        const data = response.data

        const base64data = Buffer.from(data).toString('base64')
        const img = `data:${type};base64,` + base64data
        setImg(img)
        return data
    }

    const mintImage=async(tokenURI)=>{
        const signer = await props.provider.getSigner()
        const transaction = await props.nft.connect(signer).mint(tokenURI,{value: ethers.utils.parseUnits("0.01","ether")})
        setpage(2)
        await transaction.wait()
        setpage(4)
        setName("")
        setDescription("")
    }


    return (
        <div className='home'>
            <div className='homeInner'>

                <form className='form'>
                {page===1?
                <div className='page1'><div className='formInputDiv'>
                        <label>Name</label>
                        <input type="text" placeholder='Enter name' value={name} onChange={(e) => { setName(e.target.value) }}></input>
                    </div>
                    <div className='formInputDiv'>
                        <label>Prompt</label>
                        <input type="text" placeholder='Enter prompt' value={description} onChange={(e) => { setDescription(e.target.value) }}></input>
                    </div>
                    <button type='submit' className='btn' onClick={handleCreateImage}>Generate</button>
                    </div>
                :<div></div>}
                {page ===2?<Spinner />:""}
                {page===3?<div className='imgDiv'>
                   <img src={img}></img>
                   {props.account?<button type='submit'className='btn' onClick={handleMintImage}>Mint</button>:<div>You need to connect your account in order to mint</div>}
                <button type='submit'className='btn backbtn' onClick={handleGoBack}>Back</button>
            
                </div>:""}
                {page ===4?<div className='mintSuccessfull'>
                <i class="bi bi-check-circle-fill"></i>
                <p>NFT minted successfully</p>
                <button type='submit'className='btn backbtn' onClick={handleGoBack}>Home</button>
                <p className="metaData">View <a href={url}  target="_blank"> Metadata</a></p> 
                </div>:""}
                </form>
            </div>
        </div>
    )
}
