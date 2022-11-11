import axios from "axios";

export function getCharacters() {
  return async function (dispatch) {
    //AQUÍ ES DONDE FINALMENTE SE VE CÓMO SE CONECTA EL FRONT CON EL BACK, EN SOLO 3 LÍNEAS:
    var json = await axios.get("http://localhost:3001/characters", {}); //axios es lo mismo que escribir axios.get
    return dispatch({
      type: "GET_CHARACTERS",
      payload: json.data,
    });
  };
}

export function getNameCharacters(name) {
  // el parámetro se puede llamar payload o lo que yo quiera
  return async function (dispatch) {
    try {
      var json = await axios.get(
        "http://localhost:3001/characters?name=" + name
      );
      return dispatch({
        type: "GET_NAME_CHARACTERS",
        payload: json.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export function getOccupations() {
  return async function (dispatch) {
    var info = await axios.get("http://localhost:3001/occupations");
    return dispatch({ type: "GET_OCCUPATIONS", payload: info.data });
  };
}

export function postCharacter(payload) {
  return async function (dispatch) {
    const response = await axios.post(
      "http://localhost:3001/character",
      payload
    );
    console.log(response);
    return response;
  };
}

export function filterCharactersByStatus(payload) {
  console.log(payload);
  return {
    type: "FILTER_BY_STATUS",
    payload,
  };
}

export function filterCreated(payload) {
  return {
    type: "FILTER_CREATED",
    payload,
  };
}

export function orderByName(payload) {
  return {
    type: "ORDER_BY_NAME",
    payload,
  };
}
