import React from 'react';

const sizeClasses = (size) => {
	switch(size) {
		case 'sm':
		case 'small':
			return 'px-0.5 py-0'

		default:
			return 'px-2 py-1'
	}
}

const classNames = (...args) => {
	let classNames = args.flat();
	return classNames.join(' ')
}

export default ({type, size, text, children, className, onClick, tabIndex}) => {
	
	const jointClassNames = classNames(sizeClasses(size), className, 'rounded')

	return (
		<button type={type}
			tabIndex={tabIndex}
			className={jointClassNames}
			onClick={onClick}
		>
			{children}
		</button>
	)
}