export default
	(typeof process !== 'undefined' && process.env.NODE_ENV === 'dev') ||
	(typeof window !== 'undefined' && window.__env__ === 'dev');
