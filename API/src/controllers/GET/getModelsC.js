import axios from "axios";
import { config } from "dotenv";
config();

export const getModelsC = async (req) => {
  try {
    const { API_KEY_VEHICLES } = process.env;
    const makes = [
      "Audi",
      "Chevrolet",
      "FIAT",
      "Ford",
      "Honda",
      "Hyundai",
      "Kia",
      "Lexus",
      "Mazda",
      "Mercedes-Benz",
      "Mitsubishi",
      "Nissan",
      "Suzuki",
      "Tesla",
      "Toyota",
      "Volkswagen",
      "Volvo",
    ];

    const promises = makes.map(async (make) => {
      try {
        const { data } = await axios({
          method: "GET",
          url: `https://api.api-ninjas.com/v1/cars?limit=25&make=${make}&year=2015`,
          headers: {
            "X-Api-Key": API_KEY_VEHICLES,
            "Content-Type": "application/json",
          },
        });
        return data;
      } catch (error) {
        console.log(error);
        // Asegúrate de devolver algo si hay un error para evitar que la promesa se rechace
        return [];
      }
    });

    const dataArray = await Promise.all(promises);

    // Flatten the array of arrays
    const flattenedData = dataArray.flat();

    const uniqueData = flattenedData.filter((value, index, self) => {
      return self.findIndex((item) => item.model === value.model) === index;
    });
    console.log(uniqueData.length);
    return uniqueData.map(({ model, make, year }) => ({ model, make, year }));
  } catch (error) {
    console.log(error);
  }
};
