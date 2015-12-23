export default Rule => {

	Rule.hook('construct', function() {
		this.spec = 0;
	});
    // increase specificity and return the added specific className
	Rule.prototype.incSpec = function(className) {
        this.classList = this.classList || [this.className];

        if (this.classList.indexOf(className) > -1) {
            this.spec++;
            className = className + this.spec;
        }

        this.classList.push(className);

        return className;
    };

};
