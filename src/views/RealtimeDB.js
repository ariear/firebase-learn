import { onValue, ref, set } from "firebase/database"
import {ref as refStorage, uploadBytesResumable , getDownloadURL} from "firebase/storage"
import { useEffect, useState } from "react"
import { realtimedb, storageref } from "../firebase-config"
import { uuidv4 } from "@firebase/util"

const RealtimeDB = () => {
    const [users, setUsers] = useState([])
    const [isLoading , setIsLoading] = useState(true)
    const [fields ,setFields] = useState({
        username: '',
        email: '',
        profile_photo: ''
    })

    // const getUsers = async () => {
    //     try {
    //         const dbRef = ref(realtimedb)
    //         const fetchData = await get(child(dbRef,'users'))
    //         setUsers(Object.values(fetchData.val()))
    //         setIsLoading(false)
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // }

    const getUsers = async () => {
        const starCountRef = ref(realtimedb, 'users')
        onValue(starCountRef, (snapshot) => {
            setUsers(Object.values(snapshot.val()).map(user => (
                {...user}
            )))
        })
        setIsLoading(false)
    }

    const addUser = (e) => {
        e.preventDefault();
        
        const profileRef = refStorage(storageref, `profile/${fields.profile_photo.name}`)
        const uploadTask = uploadBytesResumable(profileRef, fields.profile_photo)

        uploadTask.on('state_changed', (snapshot) => {}, (error) => { },() => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {

                set(ref(realtimedb, `users/${uuidv4()}`), {
                    username: fields.username,
                    email: fields.email,
                    profile_photo: url
                })

            })
        })
    }

    // const deleteUser = () => {
    //     remove(ref(realtimedb, 'users/h31jk23hj12k3h1jk31jk3h1jk3hkj13h131'))
    // }

    useEffect(() => {
        getUsers()
    }, []);

    return (
        <div>
            <h1>Realtime Database</h1>

            <div>

                <form onSubmit={(e) => addUser(e)} >
                <input type="file" onChange={(e) => setFields({...fields, profile_photo: e.target.files[0]})} />
                <input type="text" placeholder="username" value={fields.username} onChange={(e) => setFields({...fields, username: e.target.value})} />
                <input type="email" placeholder="email" value={fields.email} onChange={(e) => setFields({...fields, email: e.target.value})} />
                <button>Add User</button>
                </form>      
            </div>

            {
                isLoading ? <p>Loading</p> :
                users.map((user , index) => 
                <div key={index} style={{ backgroundColor: 'lightblue', width: 'max-content', padding: 10 }}>
                    <p>{user.email}</p>
                    <img src={user.profile_photo} width="200" alt="" />
                </div>
                )
            }
        </div>
    )
}

export default RealtimeDB