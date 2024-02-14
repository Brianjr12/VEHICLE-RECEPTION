import axios from "axios";
import { config } from "dotenv";
import { getMakesC } from "./getMakesC.js";
import models from "../../db.js";
import { getYearsC } from "./getYearsC.js";
import { data } from "../../tools/preferences.js";
config();

const fetchVehiclesFromApi = async (
  API_KEY_VEHICLES,
  { makesAndYears },
  limit
) => {
  try {
    let vehiclesSet = new Set();

    for (const { make, years } of makesAndYears) {
      for (const { year_number } of years) {
        try {
          const { data } = await axios({
            method: "GET",
            url: `https://api.api-ninjas.com/v1/cars?limit=${limit}&make=${make?.make}&year=${year_number}`,
            headers: {
              "X-Api-Key": API_KEY_VEHICLES,
              "Content-Type": "application/json",
            },
          });

          data.forEach((vehicle) => vehiclesSet.add(vehicle));
        } catch (error) {
          throw new Error(error);
        }
      }
    }

    return Array.from(vehiclesSet).map(({ make, model, year }) => ({
      make,
      model,
      year,
    }));
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching vehicles from API");
  }
};

const saveVehiclesToDB = async (
  vehiclesModel,
  vehiclesAPI,
  { makes, years }
) => {
  try {
    const vehiclesWithMakeIdAndYearId = vehiclesAPI.map(
      ({ make: makeApi, model, year, image }) => ({
        model,
        image: image ? image : null,
        makeId: makes.find(
          ({ make: makeDB }) => makeApi.toUpperCase() === makeDB.toUpperCase()
        )?.id_make,
        yearId: years.find(({ year_number }) => year === year_number).id_year,
      })
    );
    const saveVehicles = async () => {
      try {
        vehiclesWithMakeIdAndYearId.map(
          async ({ model, makeId, yearId, image }) => {
            const [vehicle, created] = await vehiclesModel.findOrCreate({
              where: { model, yearId, makeId, image },
              defaults: {
                makeId,
                yearId,
                image,
              },
            });

            if (created) {
              console.log(`Vehicle '${model}' successfully created`);
            } else {
              console.log(`Vehicle '${model}' already exists in the database`);
              return;
            }
          }
        );
      } catch (error) {
        throw new Error(error);
      }
    };
    await saveVehicles();
  } catch (error) {
    throw new Error(error.message);
  }
};
const pagination = async ({
  page,
  API_KEY_VEHICLES,
  API_KEY_IMAGES,
  CX_IMAGES,
  makesAndYears,
  limitApi,
  vehiclesModel,
  makesModel,
  yearsModel,
}) => {
  try {
    const paginationVehiclesDB = async () => {
      const vehiclesPerPage = 30;
      const offset = (page - 1) * vehiclesPerPage;

      const vehiclesDB = await sendVehiclesFromDB(
        vehiclesModel,
        makesModel,
        yearsModel,
        vehiclesPerPage,
        offset
      );
      return vehiclesDB;
    };

    const paginationVehiclesApi = async () => {
      // const vehiclesApi = await fetchVehiclesFromApi(
      //   API_KEY_VEHICLES,
      //   makesAndYears,
      //   limitApi
      // );
      //! use if you have API_KEY_IMAGES, CX_IMAGES
      // const vehiclesWithImage = await getImage(
      //   API_KEY_IMAGES,
      //   CX_IMAGES,
      //   vehiclesApi
      // );
      await saveVehiclesToDB(vehiclesModel, data, makesAndYears);

      return data.slice(0, 30);
    };
    const vehiclesDB = await paginationVehiclesDB();
    if (vehiclesDB.length === 0) {
      const vehiclesApi = await paginationVehiclesApi();
      return vehiclesApi
    }

    return vehiclesDB;
  } catch (error) {
    throw new Error(error.message);
  }
};

const sendVehiclesFromDB = async (
  vehiclesModel,
  makesModel,
  yearsModel,
  limit,
  offset
) => {
  try {
    const vehiclesDB = await vehiclesModel.findAll({
      include: [
        {
          model: makesModel,
          attributes: ["make"],
        },
        {
          model: yearsModel,
          attributes: ["year_number"],
        },
      ],
      limit: limit || null,
      offset: offset || null,
    });
    return vehiclesDB.map(
      ({ id_vehicle, model, image, Make, Year, reception }) => ({
        id_vehicle,
        model,
        make: Make.make,
        year: Year.year_number,
        image,
        reception,
      })
    );
  } catch (error) {
    console.log("Error when obtaining vehicles from the server");
    throw new Error(error);
  }
};

const getImage = async (API_KEY_IMAGES, CX_IMAGES, vehicles) => {
  try {
    const vehiclesModifier =
      vehicles.length > 100 ? vehicles.slice(0, 100) : vehicles;

    const vehiclesWithImages = vehiclesModifier.map(async (vehicle) => {
      const query = `${vehicle.make} ${vehicle.model} ${vehicle.year}`;
      const imgSize = "medium";
      try {
        const respuesta = await axios.get(
          "https://www.googleapis.com/customsearch/v1",
          {
            params: {
              q: query,
              searchType: "image",
              key: API_KEY_IMAGES,
              cx: CX_IMAGES,
              imgSize: imgSize,
            },
          }
        );
        const imagenURL = respuesta.data.items[0].link;
        return { ...vehicle, image: imagenURL };
      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.log("Rate limit exceeded. Sleeping...");
          return vehicles;
        } else {
          throw new Error(error);
        }
      }
    });
    return Promise.all(vehiclesWithImages).then((results) => results.flat());
  } catch (error) {
    throw new Error(error);
  }
};

const combineMakesAndYears = async (limit, yearPreferences) => {
  const makes = await getMakesC(limit);
  const years = await getYearsC(yearPreferences);

  return {
    makes,
    years,
    makesAndYears: makes.map((make) => ({ make, years })),
  };
};

export const getVehiclesC = async (page, limitApi) => {
  try {
    const {
      Vehicles: vehiclesModel,
      Makes: makesModel,
      Years: yearsModel,
    } = models;
    console.log("limit",limitApi);
    const yearPreferences = { yearPreferences: { from: 2015, to: 2023 } };

    const { API_KEY_VEHICLES } = process.env;
    let { API_KEY_IMAGES, CX_IMAGES } = process.env;
    API_KEY_IMAGES = API_KEY_IMAGES ?? null;
    CX_IMAGES = CX_IMAGES ?? null;

    const makesAndYears = await combineMakesAndYears(
      { limitMakes: 5 },
      yearPreferences
    );

    const vehicles = await pagination({
      page,
      API_KEY_VEHICLES,
      API_KEY_IMAGES,
      CX_IMAGES,
      makesAndYears,
      limitApi,
      vehiclesModel,
      makesModel,
      yearsModel,
    });

    return vehicles;
  } catch (error) {
    throw new Error(error.message);
  }
};
