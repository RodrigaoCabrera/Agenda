import React, { useState, useEffect } from 'react'
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react-dom/cjs/react-dom.development';
import './App.css';
import { store } from './firebaseconfig'

function App() {
  const [nombre, setNombre] = useState('');
  const [phone, setPhone] = useState('');
  const [user, setUser] = useState([]);
  const [error, setError] = useState('')
  const [usuarios, setUsuarios] = useState([]);
  const [modoEdit, setModoEdit] = useState(null)
  const [idUser, setIdUser] = useState('')

  const setUsers = async (e) => {
    e.preventDefault();
    if(!nombre.trim()){
      setError('El campo nombre está vacio')
    }
    if(!phone.trim()){
      setError('El campo telefono está vacio')
    }
    const usuario = {
      nombre: nombre,
      telefono: phone
    }
    try {
      const data = await store.collection('agenda').add(usuario);
      const { docs } = await store.collection('agenda').get();
      const newArray = docs.map(value => ({id:value.id, ...value.data()}))
      setUsuarios(newArray);
    } catch (e) {
      console.log(e)
    }

    setNombre('');
    setPhone('')

  }

  useEffect(() => {
    const getUsuarios = async () => {
      const { docs } = await store.collection('agenda').get();
      const newArray = docs.map(value => ({id:value.id, ...value.data()}))
      setUsuarios(newArray)
    }
    getUsuarios()
  }, []);

  const deletData = async (id) => {
    try {
      await store.collection('agenda').doc(id).delete()
      const { docs } = await store.collection('agenda').get();
      const newArray = docs.map(value => ({id:value.id, ...value.data()}))
      setUsuarios(newArray);
    } catch (e) {
      console.log(e);
    }
  }

  const editData = async (id) => {
    try {
      const data = await store.collection('agenda').doc(id).get();
      const { nombre, telefono } = data.data();
      setNombre(nombre);
      setPhone(telefono);
      setModoEdit(true)
      setIdUser(id)
    } catch (e) {
      console.log(e);
    }
    

  }

  const editUser = async (e) => {
    e.preventDefault();
    if(!nombre.trim()){
      setError('El campo nombre está vacio')
    }
    if(!phone.trim()){
      setError('El campo telefono está vacio')
    }
    const userUpdate = {
      nombre: nombre,
      telefono: phone
    }
    try {
      await store.collection('agenda').doc(idUser).set(userUpdate);
      const { docs } = await store.collection('agenda').get();
      const newArray = docs.map(value => ({id:value.id, ...value.data()}))
      setUsuarios(newArray);
    } catch (e) {
      console.log(e)
    }
    setNombre('');
    setPhone('');
    setModoEdit(null)
  }

  return (
    <div className="container bg-secondary mt-3">
      <div className='row'>
        <div className='col-12 col-md-6'>
        <h2>Formulario para agregar usuarios
        </h2>
          <form 
            onSubmit={modoEdit ? editUser : setUsers }
            className='form-group'>
            <input
              value={nombre}
              onChange={(e) => {setNombre(e.target.value)}}
              className='form-control' 
              type="text"
              placeholder='Introduce el nombre'
            />
            <input 
              value={phone}
              onChange={(e) => {setPhone(e.target.value)}}
              className='form-control' 
              type="text"
              placeholder='Introduce el telefono'
            />
            {
              modoEdit ? <input 
              className='btn btn-info btn-block mt-3' 
              type="submit"
              value='Editar'
            /> : <input 
              className='btn btn-dark btn-block mt-3' 
              type="submit"
              value='Registrar'
          />
            }
          </form>
          {
            error ? <div>Error, campo vacio</div> : <span></span>
          }
        </div>
        
        <div className='col-12 col-md-6 border-left my-3'>
          <h2>Datos de la agenda</h2>
          <ul className='list-group bg-warning '>
          {
            usuarios.length !== 0 ? usuarios.map(value => (
              
                <li className='list-group-item' key={value.id}>
                    <div>
                       Nombre:<br/>{value.nombre}<br/>
                       Número:<br/>{value.telefono}
                    </div>
                    <div className='d-flex justify-content-end ' >
                    <button 
                        onClick={(id)=> {deletData(value.id)}}
                        className='btn btn-danger'
                      >Borrar</button>
                      <button 
                        onClick={(id)=> {editData(value.id)}}
                        className='btn btn-secondary' 
                      >Actualizar</button>
                    </div>
                  
                </li> )) : <span>Lo siento, no hay usuarios en tu agenda</span>
          }
          </ul>
          
        </div>
      </div>
    </div>
  );
}

export default App;
