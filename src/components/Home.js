import React,{useState} from 'react'

export default function () {

    const [name, setName] = useState()
    const [description, setDescription] = useState()

    const handleFormSubmit=(e)=>{
        e.preventDefault()
        console.log("hello")
        console.log({name})
        console.log({description})
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
            <img src='dawdada'></img>
        </div>
        </div>
    </div>
  )
}
