import axios from "axios";
import { Op } from "sequelize";
import models from "../../db.js";

const fetchYearsFromAPI = async () => {
  try {
    const URL = "https://carapi.app/api/years";
    const { data } = await axios.get(URL);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const saveYearsToDB = async (yearsModel, yearsApi) => {
  try {
    await Promise.all(
      yearsApi.map(async (year) => {
        await yearsModel.create({
          year_number: year,
        });
      })
    );
    console.log("Years saved successfully");
  } catch (error) {
    throw new Error(error.message);
  }
};

const getYearsFromDB = async (yearsModel, yearPreferences) => {
  try {
    if (yearPreferences) {
      const { from, to } = yearPreferences;
      const yearsDB = await yearsModel.findAll({
        where: {
          year_number: {
            [Op.between]: [from, to],
          },
        },
      });
      return yearsDB.map(({id_year,year_number})=>({id_year,year_number}));
    }

    const yearsDB = await yearsModel.findAll();
    return yearsDB.map(({ id_year, year_number }) => ({
      id_year,
      year_number,
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getYearsC = async (req) => {
  try {
    const yearsModel = models.Years;
    const { yearPreferences } = req;
    let yearsDB = await getYearsFromDB(yearsModel, yearPreferences);

    if (yearsDB.length === 0) {
      const yearsAPI = await fetchYearsFromAPI();
      await saveYearsToDB(yearsModel, yearsAPI);
      yearsDB = await getYearsFromDB(yearsModel, yearPreferences);
    }

    return yearsDB;
  } catch (error) {
    throw new Error(error.message);
  }
};
