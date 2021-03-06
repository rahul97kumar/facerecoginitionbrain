import React from 'react';
import Tilt from 'react-tilt'
import './Logo.css'
import brain from './brain.png'

const Logo = () =>{
	return (
		<div className='ma4 mt0'>
			<Tilt className="Tilt br2 shadow-2" options={{ max : 95 }} style={{ height: 160, width: 150 }} >
 				<div className="Tilt-inner pa3">
 		<img style={{paddingTop:'10px',height: 100, width: 90}} alt='logo'  src={brain}/>
 				</div>
			</Tilt>
		</div>
		);
}

export default Logo;