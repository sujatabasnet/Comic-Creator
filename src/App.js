import React, { useState } from "react";
import "./App.css";
import { SyncOutlined } from "@ant-design/icons";


function App() {
  const [texts, setTexts] = useState(Array(10).fill(""));
  const [images, setImages] = useState(Array(10).fill(""));
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleTextChange = (e, index) => {
    const newValues = [...texts];
    newValues[index] = e.target.value;
    setTexts(newValues);
  };

  const queryHuggingFace = async (text) => {
    try {
      const response = await fetch(
        "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
        {
          method: "POST",
          headers: {
            Accept: "image/png",
            Authorization:
              "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: text }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const imageData = await response.blob();
      return URL.createObjectURL(imageData);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const handleSubmit1 = async (e) => {
    e.preventDefault();
    try {
      setLoaded(false);
      setImages(Array(10).fill(""));
      setTexts(Array(10).fill(""));
    } catch (err) {
      console.log(err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoaded(false);
      setLoading(true);
      const imagePromises = texts.map(async (text) => {
        const imageUrl = await queryHuggingFace(text);
        return imageUrl;
      });

      const imageUrls = await Promise.all(imagePromises);
      setImages(imageUrls);
      setLoading(false);
      setLoaded(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="App">
      <h1 className="text-white mb-10 font-bold text-5xl font-serif text-center">
        Welcome to the comic creator...
      </h1>
      <p className="text-gray-200/80 text-xl mx-16 font-light px-16 italic mb-10">
        Welcome to our Comic Creator! "Discover the boundless world of
        storytelling. Our user-friendly interface allows you to input text for
        each panel, generating vibrant and entertaining comic strips instantly.
        Bring your stories to life. Whether you're a seasoned comic artist or a
        novice storyteller, our platform empowers you to create and share
        delightful comic strips effortlessly. Start creating your unique comics
        today!"
      </p>
      <div className="parent-container">
        <div className="grid-container">
          {images.map((imageUrl, index) =>
            imageUrl ? (
              <div className="image-container ">
                <img key={index} src={imageUrl} alt={`Image ${index + 1}`} />
                <div className="text-overlay rounded-full italic font-bold ">
                  {texts[index]}
                </div>
              </div>
            ) : (
              <input
                key={index}
                type="text"
                value={texts[index]}
                onChange={(e) => handleTextChange(e, index)}
                placeholder={`Panel ${index + 1}`}
                className="item bg-slate-500/25 py-2 rounded px-12 hover:bg-slate-500/50 text-white text-justify"
              />
            )
          )}
        </div>
      </div>

      <div className="text-center mt-10">
        {!loaded ? (
          <button
            className="text-white/60 text-xl bg-transparent border border-spacing-7 hover:bg-white hover:text-black rounded-full px-6 py-4 uppercase hover:text-2xl"
            onClick={handleSubmit}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span>
                <SyncOutlined spin style={{ marginRight: "8px" }} />
                Loading your panel... Please wait!
              </span>
            ) : (
              "Generate Comic Panel"
            )}
          </button>
        ) : (
          <div>
            <p className="text-gray-200/80 text-xl mx-16 font-light px-16 italic mb-10">Congrats! Your panel is ready.</p>
            <button
              className="text-white/60 text-xl bg-transparent border border-spacing-7 hover:bg-white hover:text-black rounded-full px-6 py-4 uppercase hover:text-2xl"
              onClick={handleSubmit1}
              type="submit"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
