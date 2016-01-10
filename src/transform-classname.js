import reactribute from 'reactribute';
import classnames from 'classnames';

export default reactribute([{
	matcher: ({props}) => 'className' in props || 'classSet' in props,
	fn({props}) {
		const args = props.className || props.classSet;
		const className = Array.isArray(args)
			? classnames.apply(null, args)
			: classnames(args);

		return {props: {...props, className}};
	}
}]);
