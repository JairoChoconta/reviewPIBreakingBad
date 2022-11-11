// PARA GUÍA VER: Pi-repaso-Breaking-Bad gustavogia

const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const axios = require("axios");
const { Occupation, Character } = require("../db");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
// Esta función me va a traer la información de la API:
const getApiInfo = async () => {
  const apiUrl = await axios.get("https://breakingbadapi.com/api/characters");
  const apiInfo = await apiUrl.data.map((el) => {
    return {
      name: el.name,
      img: el.img,
      nickname: el.nickname,
      status: el.status,
      id: el.char_id,
      occupation: el.occupation.map((el) => el),
      birthday: el.birthday,
      appearance: el.appearance.map((el) => el),
    };
  });
  return apiInfo;
};

// Esta función me va a traer la info de la base de datos:
const getDbInfo = async () => {
  return await Character.findAll({
    include: {
      model: Occupation,
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
  });
};

// Y ahora con estas dos cosas anteriores debo concatenarlos y devolverlos
const getAllCharacters = async () => {
  const apiInfo = await getApiInfo();
  const dbInfo = await getDbInfo();
  const infoTotal = apiInfo.concat(dbInfo);
  return infoTotal;
};

router.get("/characters", async (req, res) => {
  const name = req.query.name;
  let charactersTotal = await getAllCharacters();
  if (name) {
    let characterName = await charactersTotal.filter((el) =>
      el.name.toLowerCase().includes(name.toLowerCase())
    );
    characterName.length
      ? res.status(200).send(characterName)
      : res.status(404).send("No está el personaje, sorry");
  } else {
    res.status(200).send(charactersTotal);
  }
});

router.get("/occupations", async (req, res) => {
  const occupationsApi = await axios.get(
    "https://www.breakingbadapi.com/api/characters"
  );
  const occupations = occupationsApi.data.map((el) => el.occupation);
  const occEach = occupations.map((el) => {
    for (let i = 0; i < el.length; i++) return el[i];
  });
  console.log(occEach);
  occEach.forEach((el) => {
    Occupation.findOrCreate({
      where: { name: el },
    });
  });
  const allOccupations = await Occupation.findAll();
  res.send(allOccupations);
});

router.post("/character", async (req, res) => {
  const { name, nickname, birthday, image, status, createdInDb, occupation } =
    req.body;

  let characterCreated = await Character.create({
    name,
    nickname,
    birthday,
    image,
    status,
    createdInDb,
  });

  let occupationDb = await Occupation.findAll({
    where: { name: occupation },
  });
  characterCreated.addOccupation(occupationDb);
  res.send("Personaje creado con éxito");
});

router.get("/characters/:id", async (req, res) => {
  const id = req.params.id; // ESTO ES LO MISMO QUE HACER: const {id} = req.params !! . Esta es la forma estructurada.
  const charactersTotal = await getAllCharacters();
  if (id) {
    let characterId = await charactersTotal.filter((el) => el.id == id);
    characterId.length
      ? res.status(200).json(characterId)
      : res.status(404).send("No encontré ese personaje");
  }
});

module.exports = router;
