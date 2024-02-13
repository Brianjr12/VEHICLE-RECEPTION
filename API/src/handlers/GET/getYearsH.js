import { getYearsC } from "../../controllers/GET/getYearsC.js";
export const getYearsH = async (req, res) => {
  try {
    const years = await getYearsC(req);
    if (!years) throw new Error("No years Found");
    return res.status(200).json({ message: "Success", data: years });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
