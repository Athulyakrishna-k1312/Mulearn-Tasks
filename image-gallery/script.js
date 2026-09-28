const photoCollection = [
    "https://picsum.photos/id/29/900/600",
    "https://picsum.photos/id/42/900/600",
    "https://picsum.photos/id/57/900/600",
    "https://picsum.photos/id/65/900/600",
    "https://picsum.photos/id/76/900/600",
    "https://picsum.photos/id/88/900/600",
    "https://picsum.photos/id/91/900/600",
    "https://picsum.photos/id/164/900/600"
];

const galleryBox = document.querySelector("#gallery");
const previewImage = document.querySelector("#largeImage");
const brightnessButton = document.querySelector("#toggleBtn");

let isDark = false;

function createThumbnail(photo, position) {
    const thumbnail = document.createElement("img");

    thumbnail.src = photo;
    thumbnail.alt = `Collection image ${position + 1}`;
    thumbnail.classList.add("thumbnail");

    thumbnail.addEventListener("click", function () {
        showPreview(photo);

        document
            .querySelectorAll(".thumbnail")
            .forEach(item => item.classList.remove("selected"));

        thumbnail.classList.add("selected");
    });

    galleryBox.appendChild(thumbnail);
}

function showPreview(photo) {
    previewImage.src = photo;

    isDark = false;
    previewImage.style.filter = "brightness(100%)";
    brightnessButton.textContent = "Darken Image";
}

function changeBrightness() {
    isDark = !isDark;

    if (isDark) {
        previewImage.style.filter = "brightness(45%)";
        brightnessButton.textContent = "Restore Brightness";
    } else {
        previewImage.style.filter = "brightness(100%)";
        brightnessButton.textContent = "Darken Image";
    }
}

photoCollection.forEach((photo, index) => {
    createThumbnail(photo, index);
});

showPreview(photoCollection[0]);

document
    .querySelector(".thumbnail")
    .classList.add("selected");

brightnessButton.addEventListener("click", changeBrightness);
