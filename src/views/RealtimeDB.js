import { onValue, ref, set } from "firebase/database"
import { useEffect, useState } from "react"
import { realtimedb } from "../firebase-config"
import { uuidv4 } from "@firebase/util"
import InputImage from "../component/InputImage"

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
        
        set(ref(realtimedb, `users/${uuidv4()}`), {
            username: fields.username,
            email: fields.email,
            profile_photo: fields.profile_photo
        })
    }

    useEffect(() => {
        getUsers()
    }, []);

    return (
        <div>
            <h1>Realtime Database</h1>

            <div>

                <form onSubmit={(e) => addUser(e)} >
                <input type="text" placeholder="username" value={fields.username} onChange={(e) => setFields({...fields, username: e.target.value})} />
                <input type="email" placeholder="email" value={fields.email} onChange={(e) => setFields({...fields, email: e.target.value})} />
                <input type="text" placeholder="profile" value={fields.profile_photo} onChange={(e) => setFields({...fields, profile_photo: e.target.value})} />
                <button>Add User</button>
                </form>

                <h3>Upload file</h3>
                <InputImage />       
            </div>

            {
                isLoading ? <p>Loading</p> :
                users.map((user , index) => 
                    <p key={index}>{user.email}</p>
                )
            }
        </div>
    )
}

export default RealtimeDB