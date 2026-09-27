import React, { useEffect, useState } from "react";
import ImageCard from "./ImageCard";

function App() {

  // LOAD IMAGES FROM LOCAL STORAGE 

  const [images, setImages] = useState(() => {
    const savedImages = localStorage.getItem("images");

    return savedImages
      ? JSON.parse(savedImages)
      : [
          {
            id: 1,
            url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
            name: "Mountain",
            uploadedAt: new Date().toISOString(),
          },
          {
            id: 2,
            url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
            name: "Forest",
            uploadedAt: new Date().toISOString(),
          },
        ];
  });


  // POPUP STATES 

  const [showPopup, setShowPopup] = useState(false);

  const [showNamePopup, setShowNamePopup] = useState(false);

  const [imageUrl, setImageUrl] = useState("");

  const [isDragging, setIsDragging] = useState(false);

  const [imageName, setImageName] = useState("");

  const [pendingImage, setPendingImage] = useState(null);


  // SAVE TO LOCAL STORAGE 

  useEffect(() => {
    localStorage.setItem(
      "images",
      JSON.stringify(images)
    );
  }, [images]);


  // EXTRACT IMAGE NAME FROM URL

  const getImageNameFromUrl = (url) => {

    try {

      const urlObject = new URL(url);

      const pathname = urlObject.pathname;

      const fileName = pathname.split("/").pop();

      if (fileName) {
        return decodeURIComponent(fileName);
      }

    } catch (error) {

      console.log("Invalid URL");

    }

    return "Image";
  };


  // SHOW NAME EDIT POPUP

  const prepareImage = (url, name) => {

    const newImage = {
      id: Date.now(),
      url: url,
      name: name || "Image",
      uploadedAt: new Date().toISOString(),
    };

    setPendingImage(newImage);

    setImageName(name || "Image");

    setShowPopup(false);

    setShowNamePopup(true);
  };


  // SAVE IMAGE AFTER NAME EDIT

  const saveImage = () => {

    const trimmedName = imageName.trim();

    if (!trimmedName) {
      return;
    }

    const finalImage = {
      ...pendingImage,
      name: trimmedName,
    };

    setImages((prevImages) => [
      ...prevImages,
      finalImage,
    ]);

    setPendingImage(null);

    setImageName("");

    setShowNamePopup(false);
  };


  // CANCEL IMAGE ADDITION

  const cancelImage = () => {

    setPendingImage(null);

    setImageName("");

    setShowNamePopup(false);

  };


  // URL SUBMIT

  const handleUrlSubmit = (e) => {

    e.preventDefault();

    const url = imageUrl.trim();

    if (!url) {
      return;
    }

    const actualName = getImageNameFromUrl(url);

    prepareImage(url, actualName);

    setImageUrl("");

  };


  // FILE HANDLER

  const handleFile = (file) => {

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {

      alert("Please select an image file");

      return;
    }


    const reader = new FileReader();


    reader.onload = () => {

      const imageData = reader.result;

      // Actual file name
      const actualName = file.name;

      prepareImage(
        imageData,
        actualName
      );

    };


    reader.readAsDataURL(file);

  };


  // FILE INPUT

  const handleFileChange = (e) => {

    const file = e.target.files[0];

    handleFile(file);

  };


  // DRAG OVER

  const handleDragOver = (e) => {

    e.preventDefault();

    setIsDragging(true);

  };


  // DRAG LEAVE

  const handleDragLeave = (e) => {

    e.preventDefault();

    setIsDragging(false);

  };


  // DROP

  const handleDrop = (e) => {

    e.preventDefault();

    setIsDragging(false);

    const file = e.dataTransfer.files[0];

    handleFile(file);

  };


  // DELETE IMAGE

  const deleteImage = (id) => {

    setImages((prevImages) =>
      prevImages.filter(
        (image) => image.id !== id
      )
    );

  };


  // FORMAT DATE

  const formatDate = (date) => {

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  };


  return (
    <>

      <main className="container">

        {/* HEADER */}

        <div className="gallery-header">

          <div>

            <h1>Image Gallery</h1>

            <p>
              Add and manage your images
            </p>

          </div>


          <button
            className="add-button"
            onClick={() => setShowPopup(true)}
          >
            + Add Image
          </button>

        </div>


        {/* IMAGE GALLERY */}

        <section className="gallery-grid">

          {images.map((image) => (

            <ImageCard
              key={image.id}
              image={image}
              onDelete={deleteImage}
              formatDate={formatDate}
            />

          ))}

        </section>

      </main>


      {/* ADD IMAGE POPUP */}

      {showPopup && (

        <div className="popup-overlay">

          <div className="popup">

            <div className="popup-header">

              <h2>Add Image</h2>

              <button
                className="close-button"
                onClick={() => setShowPopup(false)}
              >
                ×
              </button>

            </div>


            {/* DRAG AND DROP */}

            <div
              className={`drop-zone ${
                isDragging ? "dragging" : ""
              }`}

              onDragOver={handleDragOver}

              onDragLeave={handleDragLeave}

              onDrop={handleDrop}
            >

              <div className="upload-icon">
                ↑
              </div>


              <h3>
                Drag & Drop an image
              </h3>


              <p>
                or
              </p>


              <label className="file-button">

                Choose Image

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                />

              </label>

            </div>


            <div className="separator">

              <span>OR</span>

            </div>


            {/* URL INPUT */}

            <form onSubmit={handleUrlSubmit}>

              <label className="url-label">
                Image URL
              </label>


              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) =>
                  setImageUrl(e.target.value)
                }
                className="url-input"
              />


              <button
                type="submit"
                className="submit-button"
                disabled={!imageUrl.trim()}
              >
                Add Image
              </button>

            </form>

          </div>

        </div>

      )}


      {/* IMAGE NAME EDIT POPUP */}

      {showNamePopup && (

        <div className="popup-overlay">

          <div className="popup">

            <div className="popup-header">

              <h2>Edit Image Name</h2>

            </div>


            <label className="url-label">
              Image Name
            </label>


            <input
              type="text"
              value={imageName}
              onChange={(e) =>
                setImageName(e.target.value)
              }
              className="url-input"
              autoFocus
            />


            <div className="name-popup-buttons">

              <button
                className="cancel-button"
                onClick={cancelImage}
              >
                Cancel
              </button>


              <button
                className="save-button"
                onClick={saveImage}
                disabled={!imageName.trim()}
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}

export default App;