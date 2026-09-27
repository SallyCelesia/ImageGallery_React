import React from "react";

function ImageCard({
  image,
  onDelete,
  formatDate,
}) {

  return (
    <>

      <article className="image-card">

        <img
          src={image.url}
          alt={image.name}
          className="image"
        />


        <div className="card-content">

          <h2>
            {image.name}
          </h2>


          <p>
            Uploaded:{" "}
            {formatDate(image.uploadedAt)}
          </p>


          <button
            className="delete-button"
            onClick={() =>
              onDelete(image.id)
            }
          >
            Delete
          </button>

        </div>

      </article>

    </>
  );
}

export default ImageCard;