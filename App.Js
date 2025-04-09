import React, { useState, useEffect}  from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import logoCadastro from './assets/cadastro.png';

function App() {

  const baseUrl="https://localhost:7024/api/medicos";
  const [data, setData]=useState([]);

  const [modalEditar, setModalEditar]=useState(false);
  const [modalIncluir, setModalIncluir]=useState(false);
  const [modalExcluir, setModalExcluir]=useState(false);

  const [medicoSelecionado, setMedicoSelecionado]=useState({
    id: '',
    nome: '',
    crm: '',
    numero: '',
    especialidade: ''
  })

  const handleChange=e=>{
    const {name, value}=e.target;
    setMedicoSelecionado({
      ...medicoSelecionado, 
      [name]: value
    });
  }

  const abrirFecharModalIncluir=()=>{
    setModalIncluir(!modalIncluir);
  }

  const abrirFecharModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

   const abrirFecharModalExcluir=()=>{
    setModalExcluir(!modalExcluir);
  }

  const pedidoGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const pedidoPost=async()=>{
    delete medicoSelecionado.id;
      await axios.post(baseUrl, medicoSelecionado)
    .then(response=>{
      setData(data.concat(response.data));
      abrirFecharModalIncluir();
    }).catch(error=>{
      console.log(error);
    })
  }

  const medicoPut=async()=>{
    await axios.put(baseUrl+"/"+medicoSelecionado.id, medicoSelecionado)
    .then(response=>{
      var resposta=response.data;
      var dadosAuxiliar=data;
      //eslint-disable-next-line
      dadosAuxiliar.map(medico=>{
        if(medico.id===medicoSelecionado.id){
          medico.nome=resposta.nome;
          medico.crm=resposta.crm;
          medico.numero=resposta.numero;
          medico.especialidade=resposta.especialidade;
        }
      });
      abrirFecharModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const medicoDelete=async()=>{
    await axios.delete(baseUrl+"/"+medicoSelecionado.id)
    .then(response=>{
     setData(data.filter(medico=>medico.id!==response.data));
      abrirFecharModalExcluir();
    }).catch(error=>{
      console.log(error);
    })
  }

  const selecionarMedico=(medico, caso)=>{
    setMedicoSelecionado(medico);
      (caso==="Editar")?
        abrirFecharModalEditar(): abrirFecharModalExcluir();
  }

  useEffect(()=>{
    pedidoGet();
  }, [])

  return (
    <div className="medico-container">
       <br/>
       <h3>Cadastro de Médicos</h3>
      <header>
        <img src={logoCadastro} alt="Cadastro" />
        <button onClick={()=>abrirFecharModalIncluir()} className="btn btn-success">Incluir Novo Médico</button>
       </header>
      <table className="table table-bordered" >
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>CRM</th>
            <th>Número</th>
            <th>Especialidade</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map(medico=>(
            <tr key={medico.id}>
              <td>{medico.id}</td>
              <td>{medico.nome}</td>
              <td>{medico.crm}</td>
              <td>{medico.numero}</td>
              <td>{medico.especialidade}</td>
              <td>
              <button className="btn btn-primary" onClick={()=>selecionarMedico(medico, "Editar")}>Editar</button> {"  "}
              <button className="btn btn-danger" onClick={()=>selecionarMedico(medico, "Excluir")}>Excluir</button>
              </td>
              </tr>
          ))}
        </tbody>
      </table>
      
      <Modal isOpen={modalIncluir}>
      <ModalHeader>Incluir Médico</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Nome: </label>
          <input type="text" className="form-control" name="nome" onChange={handleChange}/>
          <label>CRM: </label>
          <input type="text" className="form-control" name="crm" onChange={handleChange}/>
          <label>Número: </label>
          <input type="text" className="form-control" name="numero" onChange={handleChange}/>
          <label>Especialidade: </label>
          <input type="text" className="form-control" name="especialidade" onChange={handleChange}/>
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>pedidoPost()}>Incluir</button>
        <button className="btn btn-danger" onClick={()=>abrirFecharModalIncluir()}>Cancelar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={modalEditar}>
      <ModalHeader>Editar Médico</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>ID: </label>
          <input type="text" className="form-control" readOnly value={medicoSelecionado.id}/>
          <label>Nome: </label>
          <input type="text" className="form-control" name="nome" onChange={handleChange} value={medicoSelecionado.nome}/>
          <label>CRM: </label>
          <input type="text" className="form-control" name="crm" onChange={handleChange} value={medicoSelecionado.crm}/>
          <label>Número: </label>
          <input type="text" className="form-control" name="numero" onChange={handleChange} value={medicoSelecionado.numero}/>
          <label>Especialidade: </label>
          <input type="text" className="form-control" name="especialidade" onChange={handleChange} value={medicoSelecionado.especialidade}/>
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>medicoPut()}>Editar</button>
        <button className="btn btn-danger" onClick={()=>abrirFecharModalEditar()}>Cancelar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={modalExcluir}>
      <ModalBody>
      Confirma exclusão do médico : {medicoSelecionado.nome} ?
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-danger" onClick={()=>medicoDelete()}>Sim</button>
        <button className="btn btn-secondary" onClick={()=>abrirFecharModalExcluir()}>Não</button>
      </ModalFooter>
    </Modal>

    </div>
  );
}

export default App;
