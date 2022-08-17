import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase-config";

const AuthView = () => {
    const [fields ,setFields] = useState({
        email: '',
        password: ''
    })
    const [fieldsLogin ,setFieldsLogin] = useState({
        email: '',
        password: ''
    })

    const registerHandle = async (e) => {
        e.preventDefault();
        
        try {
            await createUserWithEmailAndPassword(auth, fields.email, fields.password)
        } catch (error) {
            console.log(error);
        }
    }

    const signinHandle = async (e) => {
        e.preventDefault()

        try {
            await signInWithEmailAndPassword(auth, fieldsLogin.email, fieldsLogin.password)
        } catch (error) {
            console.log(error);
        }
    }

    const signOutHandle = async () => {
        try {
          await signOut(auth)
        } catch (error) {
          console.log(error);
        }
      }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            console.log('user status changed: ', user);
        })
    }, []);

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={(e) => registerHandle(e)} >
                <input type="email" placeholder="email" value={fields.email} onChange={(e) => setFields({...fields, email: e.target.value})} />
                <input type="password" placeholder="password" value={fields.password} onChange={(e) => setFields({...fields, password: e.target.value})} />
                <button>Register</button>
            </form>

            <h1>Login</h1>
            <form onSubmit={(e) => signinHandle(e)} >
                <input type="email" placeholder="email" value={fieldsLogin.email} onChange={(e) => setFieldsLogin({...fieldsLogin, email: e.target.value})} />
                <input type="password" placeholder="password" value={fieldsLogin.password} onChange={(e) => setFieldsLogin({...fieldsLogin, password: e.target.value})} />
                <button>Register</button>
            </form>

            <button onClick={() => signOutHandle() } >Sign Out</button>
        </div>
    )
}

export default AuthView