import reactribute from 'reactribute';

export default reactribute([{
	matcher: ({props}) => Array.isArray(props.style),
	fn({props}) {
		const style = Object.assign.apply(null, props.style);
		return {props: {...props, style}};
	}
}]);
