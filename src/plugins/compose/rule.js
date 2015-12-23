export default Rule => {
	Rule.prototype.incSpec = function(className) {
        this.classList = this.classList || [this.className];

        if (this.classList.indexOf(className) > -1) {
            this.spec++;
            className = className + this.spec;
        }

        this.classList.push(className);

        return className;
    }
};
