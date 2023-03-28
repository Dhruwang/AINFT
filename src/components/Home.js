import React,{useState} from 'react'
import axios from 'axios';
import { Buffer } from 'buffer';
import { NFTStorage } from 'nft.storage';

export default function () {

    const [name, setName] = useState()
    const [description, setDescription] = useState()
    const [img, setImg] = useState("")
    const [url, setUrl] = useState("")

    const handleFormSubmit=async(e)=>{
        e.preventDefault()

        const imageData = createImg()

        const url = await uploadImage(imageData)
 
    }

    const uploadImage = async(imageData)=>{
        console.log("")
        const nftstorage = new NFTStorage({token: process.env.REACT_APP_NFT_STORAGE_API_KEY})

        const {ipnft} = await nftstorage.store({
            image: new File([imageData], "image.jpeg",{type:"image/jpeg"}),
            name: name,
            description: description
        })

        const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`
        setUrl(url)

        return url

    }

    const createImg=async()=>{
        const URL = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5"
        const response = await axios({
            url: URL,
            method: "POST",
            headers:{
                Authorization : `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
                Accept : 'application/json',
                "Content-Type":"application/json"
            },
            data:JSON.stringify({
                inputs : description, options :{wait_for_model:true},
            }),
            responseType : "arraybuffer"
        })

        console.log(response)
        const type = response.headers["content-type"]
        const data = response.data

        const base64data = Buffer.from(data).toString('base64')
        const img = `data:${type};base64,`+base64data
        setImg(img)

        return data
    }

  return (
    <div className='home'>
        <div className='homeInner'>

        <form className='form' onSubmit={handleFormSubmit}>
            <div className='formInputDiv'>
                <label>Name</label>
                <input type="text" placeholder='Enter name' value={name} onChange={(e)=>{setName(e.target.value) }}></input>
            </div>
            <div className='formInputDiv'>
                <label>Description</label>
                <input type="text" placeholder='Enter description' value={description}  onChange={(e)=>{setDescription(e.target.value) }}></input>
            </div>
            <button type='submit'>Create And Mint</button>
        </form>
        <div className='imgDiv'>
            <img src={img}></img>
        </div>
        </div>
        <p>View <a href={url} target="_blank">Metadata</a></p>
    </div>
  )
}
