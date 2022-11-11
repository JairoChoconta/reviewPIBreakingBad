import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom"; //useNavigate in V6
import { postCharacter, getOccupations } from "../actions/index";
import { useDispatch, useSelector } from "react-redux";

export default function CharacterCreate() {
  const dispatch = useDispatch();
  const history = useHistory();
  //const navigate = useNavigate();

  const occupations = useSelector((state) => state.occupations);

  const [input, setInput] = useState({
    name: "",
    nickname: "",
    birthday: "",
    status: "",
    occupation: []
  });

  function handleChange(e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
    console.log(input);
  }

  function handleCheck(e) {
    if (e.target.checked) {
      setInput({
        ...input,
        status: e.target.value,
      });
    }
  }

  function handleSelect(e) {
    setInput({
      ...input,
      occupation: [...input.occupation, e.target.value],
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(input);
    dispatch(postCharacter(input));
    alert("¡Personaje Creado!");
    setInput({
        name: "",
        nickname: "",
        birthday: "",
        status: "",
        image: "",
        occupation: []
    })
    history.push("/home");
  }

  useEffect(() => {
    dispatch(getOccupations());
  }, [dispatch]);

  return (
    <div>
      <Link to="/home">
        <button>Volver</button>
      </Link>
      <h1>Crea tu personaje</h1>
      <form onSubmit={(e)=>handleSubmit(e)}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={input.name}
            name="name"
            onChange={(e)=>handleChange(e)}
          />
        </div>
        <div>
          <label>Nickname:</label>
          <input
            type="text"
            value={input.nickname}
            name="nickname"
            onChange={(e)=>handleChange(e)}
          />
        </div>
        <div>
          <label>Cumpleaños:</label>
          <input
            type="text"
            value={input.birthday}
            name="birthday"
            onChange={(e)=>handleChange(e)}
          />
        </div>
        <div>
          <label>Imagen:</label>
          <input
            type="text"
            value={input.image}
            name="image"
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Status</label>
          <label>
            <input
              type="checkbox"
              name="Alive"
              value="Alive"
              onChange={(e) => handleCheck(e)}
            />
            Alive
          </label>
          <label>
            <input
              type="checkbox"
              name="Deceased"
              value="Deceased"
              onChange={(e) => handleCheck(e)}
            />
            Deceased
          </label>
          <label>
            <input
              type="checkbox"
              name="Unknown"
              value="Unknown"
              onChange={(e) => handleCheck(e)}
            />
            Unknown
          </label>
        </div>
        <select onChange={(e) => handleSelect(e)}>
          {occupations.map((occ) => (
            <option value={occ.name}>{occ.name}</option>
          ))}
        </select>
        <ul>
          <li>{input.occupation.map((el) => el + " ,")}</li>
        </ul>
        <button type="submit">Crear Personaje</button>
      </form>
    </div>
  );
}
