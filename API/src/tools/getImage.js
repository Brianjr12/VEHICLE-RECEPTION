import { config } from "dotenv";
config();
const getImage = async (req, res) => {
  try {
    const query = "Chevrolet camaro";
    const { API_KEY_IMAGES, CX_IMAGES } = process.env;
    const imgSize = "medium";

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
    console.log("URL de la imagen:", imagenURL);
    res.json({ url: imagenURL });
  } catch (error) {
    console.error("Error al buscar la imagen:", error.message);
    res.status(500).json({ error: "Error al buscar la imagen" });
  }
};
