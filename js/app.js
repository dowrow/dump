const sound = new Audio('./sounds/plop.mp3');
const shareMessage = 'I just took a dump, look: ';
let url = 'https://i.imgur.com/ikOOvQw.png?1';
let scene = null;
let generateInterval = null;

(function start() {
	const aframe = document.createElement('script');
	aframe.src = './js/aframe.min.js';
	aframe.onload = () => {
		initScene();
	}
	document.head.append(aframe);
	initShareButtons();
	document.querySelector('.url-input').onfocus = (event) => {
		console.log('focus!');
		event.target.value = ''
	}
})();

function initScene() {
	document.querySelector('.scene-container').innerHTML = `
          <a-scene class="scene" antialias="true" physics="gravity: -0.1">
            <a-sky color="#ae2633"></a-sky>
            <a-entity gltf-model="url(/toilet/scene.gltf)" position="0 -0.01 0" rotation="0 -90 0"></a-entity>
            <a-plane static-body color="#ae2633" height="100" width="100" rotation="-90 0 0"></a-plane>
            <a-entity static-body position="0 -0.5 2" rotation="-25 0 0" >
              <a-camera static-body camera look-controls></a-camera>
            </a-entity>
          </a-scene>
          `;
	scene = document.querySelector('a-scene');
	generateInterval = setInterval(generatePicture, 2000);
}

function initShareButtons() {
	const twitterButton = document.querySelector('.share-button--twitter');
	const facebookButton = document.querySelector('.share-button--facebook');
	twitterButton.href = `${twitterButton.href}?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(shareMessage)}`;
	facebookButton.href = `${facebookButton.href}?u=${encodeURIComponent(location.href)}`;
}

document.querySelector('.url-input').addEventListener('input', (event) => {
	const inputData = event.target.value;
	document.location.href = '?image=' + encodeURIComponent(inputData);
});

document.addEventListener('DOMContentLoaded', () => {
	const imageUrl = getImageParameter();
	if (imageUrl) {
		checkImage(imageUrl, () => onImageLoad(imageUrl), onImageError);
	}
});

function onImageLoad(imageUrl) {
	url = decodeURIComponent(imageUrl);
	document.querySelector('.url-input').value = url;
}

function onImageError() {
	alert('The URL is not a valid image or their server doesn\'t allow us to use it');
}

function generatePicture() {
	if (!document.hidden) {
		const image = document.createElement('a-image');
		image.setAttribute('src', url);
		image.setAttribute('dynamic-body', 'true');
		image.setAttribute('position', '0 1.3 0.2');
		image.setAttribute('height', '0.1');
		image.setAttribute('width', '0.1');
		image.setAttribute('mass', '1');
		image.addEventListener('collide', (event) => {
			setTimeout(() => {
				try {
					sound.play();
					event.target.sceneEl.removeChild(event.target);
				} catch (e) { }
			}, 0);
		});
		scene.appendChild(image);
	}
}

function checkImage(url, good, bad) {
	const img = new Image();
	img.crossOrigin = '';
	img.onload = good;
	img.onerror = bad;
	img.src = url;
}

function getImageParameter() {
	const url = new URL(document.location.href);
	return url.searchParams.get("image");
}
