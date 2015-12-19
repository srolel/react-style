import DOMStylesheetMock from './dom-stylesheet-mock';

let styleSheetCache = {};

export const clearCache = () => styleSheetCache = {};

export default (media) => {
	if (typeof document === 'undefined') {
		return new DOMStylesheetMock(media);
	}

	let styleElement = styleSheetCache[media];

	if (!styleElement) {
		styleElement = document.createElement('style');
		if (media) {
			styleElement.media = media;
		}
		styleSheetCache[media] = styleElement;
		document.head.appendChild(styleElement);
	}
	return styleElement;
};
