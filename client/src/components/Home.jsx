import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCharacters, filterCharactersByStatus, filterCreated, orderByName } from "../actions";
import { Link } from "react-router-dom";
import Card from "./Card";
import Paginado from "./Paginado";
import SearchBar from "./SearchBar";

export default function Home() {
  const dispatch = useDispatch();
  const allCharacters = useSelector((state) => state.characters);
  const occupations = useSelector((state) => state.occupations);
  const [orden, setOrden] = useState('');
  //AQUÍ EMPEZAMOS PAGINACIÓN Y PARA ELLO HAY QUE DEFINIR VARIOS ESTADOS LOCALES:
  const [currentPage, setCurrentPage] = useState(1);
  const [charactersPerPage, setCharactersPerPage] = useState(6);
  const indexOfLastCharacter = currentPage * charactersPerPage; // 6
  const indexOfFirstCharacter = indexOfLastCharacter - charactersPerPage; // 0
  const currentCharacters = allCharacters.slice(
    indexOfFirstCharacter,
    indexOfLastCharacter
  );
  // Pag.1 --> 0------6
  // Pag.2 --> 7------13

  const paginado = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    dispatch(getCharacters());
  }, [dispatch]); //Lo que se incluye en el arreglo es el estado de occupation, characters, cuando hay dependencias entre varias cosas

  function handleClick(e) {
    e.preventDefault();
    dispatch(getCharacters());
  }

  function handleSort(e) {
    e.preventDefault();
    dispatch(orderByName(e.target.value));
    setCurrentPage(1);
    setOrden(`Ordenado ${e.target.value}`);
  }

  function handleFilterStatus(e){
    dispatch(filterCharactersByStatus(e.target.value))
  }

  function handleFilterCreated(e){
    dispatch(filterCreated(e.target.value))
  }

  return (
    <div>
      <Link to="/character">Crear Personaje</Link>
      <h1>Aguante BREAKING BAD</h1>
      <button
        onClick={(e) => {
          handleClick(e);
        }}
      >
        Volver a cargar todos los personajes
      </button>
      <div>
        <select onChange={e => handleSort(e)}>
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>
        <select onChange={e => handleFilterStatus(e)}>
          <option value="All">Todos</option>
          <option value="Alive">Vivo</option>
          <option value="Deceased">Muerto</option>
          <option value="Unknown">Desconocido</option>
          <option value="Presumed dead">Probablemente muerto</option>
        </select>
        <select onChange={e => handleFilterCreated(e)}>
          <option value="All">Todos</option>
          <option value="created">Creados</option>
          <option value="api">Existente - De la Api</option>
        </select>
        <Paginado
          charactersPerPage={charactersPerPage}
          allCharacters={allCharacters.length}
          paginado={paginado}
        />
        <SearchBar/>
        {currentCharacters?.map((c) => {
          return (
            <fragment>
              <Link to={"/home/" + c.id}>
                <Card
                  name={c.name}
                  image={c.img ? c.img : c.image}
                  nickname={c.nickname}
                  key={c.id}
                />
              </Link>
            </fragment>
          );
        })}
      </div>
    </div>
  );
}
