import React, { useEffect, useState } from 'react'
import { auth, db } from './firebaseconnection'
import './app.css'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc
} from 'firebase/firestore'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
function App() {
  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [idPost, setIdPost] = useState('')
  const [email, setEmail] = useState('')
  const [password, setpassword] = useState('')

  const [user, setUser] = useState(false)
  const [userDetails, setUserDetails] = useState({})

  const [posts, setPots] = useState([])

  useEffect(() => {
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, 'posts'), snapshot => {
        let listaPost = []

        snapshot.forEach(doc => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          })
          setPots(listaPost)
        })
      })
    }

    loadPosts()
  }, [])

  useEffect(() => {
    async function checkLogin() {
      onAuthStateChanged(auth, user => {
        if (user) {
          // Se tiver um usuario logado entrar aqui
          console.log(user)
          setUser(true)
          setUserDetails({
            uid: user.uid,
            email: user.email
          })
        } else {
          setUser(false)
          setUserDetails({})
        }
      })
    }

    checkLogin()
  }, [])

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

  async function excluirPost(id) {
    const docRef = doc(db, 'posts', id)

    await deleteDoc(docRef).then(() => {
      alert('Post deletado com sucesso')
    })
  }

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log('Cadastrado com sucesso')
      })
      .catch(err => {
        if (err.code === 'auth/weak-password') {
          alert('senha muito fraca')
        } else if (err.code === 'auth/email-already-in-use') {
          alert('email ja existe')
        }
      })
  }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, password)
      .then(value => {
        console.log('Usuario logado com sucesso')

        setUserDetails({
          uid: value.user.uid,
          email: value.user.email
        })

        setUser(true)

        setEmail('')
        setpassword('')
      })
      .catch(err => {
        console.log('Erro ao fazer o login' + err)
      })
  }

  async function fazerLogout() {
    await signOut(auth)
    setUser(false)
    setUserDetails({})
  }

  return (
    <div className="App">
      <h1>React + Firebase</h1>

      {user && (
        <div>
          <strong>Seja bem-vindo(a) (Voce que esta logado!)</strong> <br />
          <span>
            ID : {userDetails.uid} - Email: {userDetails.email}
          </span>
          <br />
          <button onClick={fazerLogout}>Sair</button>
          <br />
          <br />
        </div>
      )}

      <div className="container">
        <label>Email</label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Digite o email"
        />
        <label>Senha</label>
        <input
          type="password"
          value={password}
          onChange={e => setpassword(e.target.value)}
          placeholder="Digite a senha"
        />

        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>Entrar</button>
      </div>

      <br />
      <br />
      <hr />

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
                <span>Autor: {post.autor}</span> <br />
                <button onClick={() => excluirPost(post.id)}>
                  Excluir
                </button>{' '}
                <br /> <br />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default App
