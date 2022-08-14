document.querySelectorAll('.drop-zone__input').forEach((inputElement) => {
	// locate the dropzone container that we will work with
	const dropZoneElement = inputElement.closest('.drop-zone');

	dropZoneElement.addEventListener('click', (e) => {
		inputElement.click();
	});

	inputElement.addEventListener('change', (e) => {
		if (inputElement.files.length > 0) {
			updateThumbnail(dropZoneElement, inputElement.files[0]);
		}
	});

	// cause the syles to change on dragover
	dropZoneElement.addEventListener('dragover', (e) => {
		e.preventDefault();
		dropZoneElement.classList.add('drop-zone--over');
	});

	// remove the styles added by dragover if cancelled
	['dragleave', 'dragend'].forEach((type) => {
		dropZoneElement.addEventListener(type, (e) => {
			dropZoneElement.classList.remove('drop-zone--over');
		});
	});

	// handle the drop event and transfering file from container to input also update the thumbnail
	dropZoneElement.addEventListener('drop', (e) => {
		e.preventDefault();

		if (e.dataTransfer.files.length) {
			inputElement.files = e.dataTransfer.files;
			updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
		}

		dropZoneElement.classList.remove('drop-zone--over');
	});
});

/**
 *
 * @param {HTMLElement} dropZoneElement
 * @param {File} file
 */

// first check if there is a thumbnail and if not create one
function updateThumbnail(dropZoneElement, file) {
	let thumbnailElement = dropZoneElement.querySelector('.drop-zone__thumb');

	// remove the promt so the thumbnail can take the space within the container
	if (dropZoneElement.querySelector('.drop-zone__prompt')) {
		dropZoneElement.querySelector('.drop-zone__prompt').remove();
	}

	if (!thumbnailElement) {
		thumbnailElement = document.createElement('div');
		thumbnailElement.classList.add('drop-zone__thumb');
		dropZoneElement.appendChild(thumbnailElement);
	}

	thumbnailElement.dataset.label = file.name;

	// the file when uploaded has a type property which will start with image/type. So we can make use
	// of that to check if the file is an image or not
	if (file.type.startsWith('image/')) {
		// using the reader we convert the file to dataURL and assign it as background image for thumbnail element
		const reader = new FileReader();

		reader.readAsDataURL(file);
		reader.onload = () => {
			thumbnailElement.style.backgroundImage = `url(${reader.result})`;
			// the following change is made for the size = contain in case we decide to use that
			thumbnailElement.style.backgroundColor = 'transparent';
		};

		// we can also directly assign the background image using URL.createObjectURL(file)
	}
}
