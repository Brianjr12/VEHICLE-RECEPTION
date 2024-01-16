import { getModelsC } from "../../controllers/GET/getModelsC.js";

export const getModelsH = async (req, res) => {
  try {
    const data = await getModelsC(req);
    // res.send("connect");
    res.status(200).json({ data });
  } catch (error) {
    console.log("Error:", error);
  }
};
