// UPLOAD IMAGE
const uploadImage = document.querySelector("[upload-image]");
// console.log(uploadImage);
if (uploadImage) {
  uploadImageInput = document.querySelector("[upload-image-input]");
  uploadImagePreview = document.querySelector("[upload-image-preview]");
  uploadImageInput.addEventListener("change", (e) => {
    console.log(e.target.files);
    const file = e.target.files[0];
    uploadImagePreview.src = URL.createObjectURL(file);
  });
}

// END UPLOAD IMAGE
