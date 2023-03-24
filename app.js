const loadModel = async () => {
  const version = 2;
  const alpha = 0.5;
  const model = await mobilenet.load({ version, alpha });
  console.log("Model loaded successfully");
  return model;
};

const preprocessImage = (imageElement) => {
  const imageTensor = tf.browser.fromPixels(imageElement);
  const resizedImageTensor = tf.image.resizeBilinear(imageTensor, [224, 224]);
  // const normalizedImageTensor = resizedImageTensor.div(255.0);
  return resizedImageTensor;
};

const classifyImage = async (model, preprocessedImage) => {
  const predictions = await model.classify(preprocessedImage);
  console.log("predictions here", predictions);
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

const inputImage = document.getElementById("inputImage");
document
  .getElementById("inputImage")
  .addEventListener("change", async (event) => {
    const model = await loadModel();
    const previewImage = document.getElementById("preview");

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
