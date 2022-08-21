import { onValue, ref, set, remove, update } from "firebase/database"
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

                const uid = uuidv4()
                set(ref(realtimedb, `users/${uid}`), {
                    uid,
                    username: fields.username,
                    email: fields.email,
                    profile_photo: url
                })

            })
        })
    }

    const deleteUser = (uid) => {
        remove(ref(realtimedb, `users/${uid}`))
    }

    const updateUser = (uid) => {
        const updates = {}
        updates[`/users/${uid}/email`] = 'satir terupdate'
        
        return update(ref(realtimedb), updates)
    }

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
                    <button onClick={() => updateUser(user.uid)} >update</button>
                    <button onClick={() => deleteUser(user.uid)} >delete</button>
                </div>
                )
            }
        </div>
    )
}

export default RealtimeDB