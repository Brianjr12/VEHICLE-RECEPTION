import { getVehiclesC } from "../../controllers/GET/getVehiclesC.js";

export const getVehiclesH = async (req, res) => {
  try {
    let { limit: limitApi, page } = req.query;
    limitApi = Number(limitApi ?? 5);
    page = Number(page ?? 1);

    if (!Number.isInteger(limitApi) || limitApi <= 0)
      return res
        .status(400)
        .json({ error: "Invalid value for 'limit' parameter" });

    if (!Number.isInteger(page) || page <= 0)
      return res
        .status(400)
        .json({ error: "Invalid value for 'page' parameter" });

    if (limitApi > 50)
      return res.status(400).json({
        error:
          "Invalid value for parameter 'limit', must be a range between 1 or 50",
      });

    const vehicles = await getVehiclesC(page, limitApi);
    const data = !vehicles[0].image
      ? {
        page,
          message:
            "You can only get 100 vehicle images per day. You have no more requests",
          data: vehicles,
        }
      : {
        page,
          message: "You can only get 100 vehicle images per day",
          data: vehicles,
        };

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
