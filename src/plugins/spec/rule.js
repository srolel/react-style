export default Rule => {
	Rule.prototype.compose = function(rule) {
		this.composed = this.composed || [];
        const className = rule.className || rule;
        this.composed.push(className);
	};

	Rule.prototype.getComposedClassName = function() {
		return this.composed
            ? this.composed.concat(this.className).join(' ')
            : this.className;
    };
};
