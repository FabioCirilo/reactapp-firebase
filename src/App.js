import React, { useState } from 'react'
import { db } from './firebaseconnection'
import './app.css'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc
} from 'firebase/firestore'
function App() {
  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [idPost, setIdPost] = useState('')

  const [posts, setPots] = useState([])

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
    /* const postRef = doc(db, 'posts', '12345')

    await getDoc(postRef).then(snapshot => {
      setTitulo(snapshot.data().titulo)
      setAutor(snapshot.data().autor)
    }) */

    const postRef = collection(db, 'posts')
    await getDocs(postRef)
      .then(snapshot => {
        let lista = []

        snapshot.forEach(doc => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          })
          setPots(lista)
        })
      })
      .catch(err => {
        console.log('Deu um erro ' + err)
      })
  }

  async function editarPost() {
    const docRef = doc(db, 'posts', idPost)
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor
    })
      .then(() => {
        console.log('actualizado com sucesso')
        setAutor('')
        setTitulo('')
        setIdPost('')
      })
      .catch(err => {
        console.log('Deu algum err' + err)
      })
  }

  return (
    <div className="App">
      <h1>React + Firebase</h1>
      <div className="container">
        <label>Id do Post</label>
        <input
          value={idPost}
          onChange={e => setIdPost(e.target.value)}
          placeholder="Digite o ID do post"
        />
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
        <button onClick={editarPost}> Actualizar Post</button>
        <ul>
          {posts.map(post => {
            return (
              <li key={post.id}>
                <strong>Id: {post.id}</strong> <br />
                <span>Titulo: {post.titulo}</span> <br />
                <span>Autor: {post.autor}</span> <br /> <br />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default App
