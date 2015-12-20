export default class DomStylesheetMock {

	constructor(media) {
		this.innerHTML = '';
		this.media = media;
	}

	toString() {
		return this.innerHTML;
	}

	get outerHTML() {
		const {media} = this;
		return (
			`<style ${media && `media=${media}`}>
				${this.innerHTML}
			</style>`);
	}
}
