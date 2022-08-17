import { addDoc, deleteDoc, doc , onSnapshot, serverTimestamp, updateDoc} from "firebase/firestore";
import { useEffect, useState } from "react"
import { colBooks, db } from "./firebase-config";

const App = () => {
  const [books, setBooks] = useState([])
  const [isAddBook , setIsAddBook] = useState(false)
  const [fields, setFields] = useState({
    title: '',
    author: '',
    createdAt: ''
  })

  const addBook = async (e) => {
    e.preventDefault();
    
    setFields({
      title: '',
      author: '',
      createdAt: serverTimestamp()
    })
    await addDoc(colBooks, fields)
  }

  const deleteBook = async (id) => {
    const targetBook = doc(db, 'books', id)
    
    await deleteDoc(targetBook)
  }

  const updateBook = async (id) => {
    const targetBook = doc(db, 'books', id)

    updateDoc(targetBook, {
      title: 'Title updated'
    })
  }
  
  useEffect(() => {
    // const favoritAuthor = query(colBooks, where('author', '!=', 'nauval'))

    onSnapshot(colBooks, (snapshot) => {
      setBooks(snapshot.docs.map(book => (
          {...book.data(), id: book.id}
        )))
    })
  }, []);

  return (
    <div>
      <h1>List Book</h1>

      <button onClick={() => setIsAddBook(!isAddBook)} >Add Book</button>
      
      {
        isAddBook &&
      <form onSubmit={(e) => addBook(e) } >
        <input type="text" placeholder="title" value={fields.title} onChange={(e) => setFields({...fields, title: e.target.value }) } />
        <input type="text" placeholder="author" value={fields.author} onChange={(e) => setFields({...fields, author: e.target.value }) } />
        <button>Add</button>
      </form>
      }

      {
          books.map(book => 
            <div key={book.id}>
              <p style={{ display: 'inline' }} >{book.title}</p>
              <button onClick={() => updateBook(book.id)} >update</button>
              <button onClick={() => deleteBook(book.id)} >Delete</button>
            </div>
          )
      }
    </div>
  )
}

export default App