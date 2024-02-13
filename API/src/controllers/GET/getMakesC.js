import axios from "axios";
import models from "../../db.js";
import { makesPreferences } from "../../tools/preferences.js";
const fetchMakesFromAPI = async () => {
  try {
    const URL = "https://carapi.app/api/makes";
    const { data } = await axios.get(URL);
    return data.data.map(({ name }) => ({ name }));
  } catch (error) {
    throw new Error(error.message);
  }
};

const saveMakesToDB = async (makesModel, makesApi) => {
  try {
    makesApi.sort((a, b) => {
      const makeA = a.name;
      const makeB = b.name;

      const indexA = makesPreferences.indexOf(makeA);
      const indexB = makesPreferences.indexOf(makeB);

      if (indexA < 0) {
        return 1;
      } else if (indexB < 0) {
        return -1;
      } else {
        return indexA - indexB;
      }
    });

    await Promise.all(
      makesApi.map(({ name }) => makesModel.create({ make: name }))
    );
    console.log("Makes saved successfully");
  } catch (error) {
    throw new Error(error.message);
  }
};

const getMakesFromDB = async (makesModel, limit) => {
  try {
    const makes = await makesModel.findAll({
      attributes: ["id_make", "make"],
      raw: true,
      order: [["id_make", "ASC"]],
      limit: limit ? limit : null,
    });

    if (makes.length === 0) return [];

    return makes;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getMakesC = async (req) => {
  try {
    const { limit } = req;
    const { Makes: makesModel} = models;
    let makesDB = await getMakesFromDB(makesModel, limit);

    if (makesDB.length === 0) {
      const makesAPI = await fetchMakesFromAPI();
      await saveMakesToDB(makesModel, makesAPI);
      makesDB = await getMakesFromDB(makesModel, limit);
    }

    return makesDB;
  } catch (error) {
    console.error("Error getting makes from database: ", error);
    throw error;
  }
};
