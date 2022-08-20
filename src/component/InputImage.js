import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { useState } from "react"
import { storageref } from "../firebase-config"

const InputImage = () => {
    const [urlImage , setUrlImage] = useState('')

    const onuploadprofile = async (e) => {
        const image = e.target.files[0]
        const fileRef = ref(storageref, image.name)
        const uploadTask = uploadBytesResumable(fileRef, image)
        
        uploadTask.on('state_changed', (snapshot) => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                console.log(url);
                setUrlImage(url)
            })
        })
    }

    return (
        <div>
            <input type="file" onChange={(e) => onuploadprofile(e)} />
            {
                urlImage &&
            <img src={urlImage} alt="" />
            }
        </div>
    )
}

export default InputImage