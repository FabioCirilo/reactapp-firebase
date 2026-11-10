import React, { useState } from 'react'
import { db } from './firebaseconnection'
import './app.css'
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore'
function App() {
  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')

  async function handleAdd() {
    await addDoc(collection(db, 'posts'), {
      titulo: titulo,
      autor: autor
    })
      .then(() => {
        console.log('Dados registrados')
        setTitulo('')
        setAutor('')
      })
      .catch(err => {
        console.log('Dados nao registrados' + err)
      })
  }

  async function buscarPosts() {
    const postRef = doc(db, 'posts', '12345')

    await getDoc(postRef).then(snapshot => {
      setTitulo(snapshot.data().titulo)
      setAutor(snapshot.data().autor)
    })
  }

  return (
    <div className="App">
      <h1>React + Firebase</h1>
      <div className="container">
        <label>Titulo:</label>
        <textarea
          type="text"
          placeholder="Digite um titulo"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
        />
        <label>Autor:</label>
        <input
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={e => setAutor(e.target.value)}
        />
        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPosts}>Buscar Posts</button>
      </div>
    </div>
  )
}

export default App
