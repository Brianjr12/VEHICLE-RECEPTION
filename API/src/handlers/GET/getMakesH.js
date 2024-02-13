import { getMakesC } from "../../controllers/GET/getMakesC.js";

export const getMakesH = async (req, res) => {
  try {
    const makes = await getMakesC(req);
    if (!makes) throw new Error("No Makes Found");
    return res.status(200).json({ message: "Success", data: makes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
