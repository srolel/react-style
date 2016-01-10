React Stylesheets
============

#Usage

    import rss from 'react-stylesheets'

    @rss({
    	button: {
    		background: 'blue',
    		':hover': {
    			background: 'red'
    		}
    	},
    	activeButton: {
    		color: 'yellow'
    	}
    })
    class MyComponent extends React.Component {
    	render() {
    		return <button className={{activeButton: this.props.isActive}} />;
    	}
    }

#API

### 
