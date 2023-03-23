const inputImage = document.getElementById("inputImage");
const previewImage = document.getElementById("preview");

const loadModel = async () => {
  const model = await mobilenet.load();
  console.log("Model loaded successfully");
  return model;
};

const preprocessImage = (imageElement) => {
  const imageTensor = tf.browser.fromPixels(imageElement);
  const resizedImageTensor = tf.image.resizeBilinear(imageTensor, [224, 224]);
  const normalizedImageTensor = resizedImageTensor.div(255.0);
  return normalizedImageTensor;
};

const classifyImage = async (model, preprocessedImage) => {
  const predictions = await model.classify(preprocessedImage);
  return predictions;
};

const displayPredictions = (predictions) => {
  const predictionList = document.getElementById("predictions");
  predictionList.innerHTML = "";

  predictions.slice(0, 3).forEach((prediction) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${prediction.className}: ${Math.round(
      prediction.probability * 100
    )}%`;
    predictionList.appendChild(listItem);
  });
};

addEventListener("change", async (event) => {
  const model = await loadModel();

  const imageFile = event.target.files[0];
  const imageUrl = URL.createObjectURL(imageFile);
  previewImage.src = imageUrl;
  previewImage.onload = async () => {
    const preprocessedImage = preprocessImage(previewImage);
    const predictions = await classifyImage(model, preprocessedImage);
    displayPredictions(predictions);
  };
  previewImage.style.display = "block";
});
