import React, { useEffect } from 'react';
import myfish from '../../images/myfish.png';
import fish from '../../images/fish.png';
import fishblue from '../../images/fishblue.png';
import my_fish from '../../images/my_fish.png';
import poisson_rouge from '../../images/poisson_rouge.png';
import requin from '../../images/requin.png';
import ocean from '../../images/ocean.png';
// import waveTextAnimation from "wave-text-animation";



const SquareAnimation = () => {
    
    // waveTextAnimation("DEV-OUME.COM");

    return (
        <>
        <div className='container mx-auto m-2' style={{ background: `url(${ocean})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', height: '100vh'}}>
            <div className="is-active-cube col-md-2" >
                {/* <img className='is-active-myfish rounded-3 ' src={myfish} alt="Mon poisson rouge traverse de gauche vers la droite" /> */}
                <img className='rounded-3 is-active-myfish' src={requin} alt="Un autre poisson qui traverse de gauche vers la droite" />
                <img className='rounded-3 fish' src={fishblue} alt="Un autre poisson qui traverse de gauche vers la droite" />
            </div>
        {/* </div>
        <div className='container mx-auto m-2' style={{background: `url(${ocean})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}> */}
            <div className="fish-container">
                {/* <img className='rounded-3 fish' src={fish} alt="Un autre poisson qui traverse de gauche vers la droite" /> */}
                <img className='is-active-myfish rounded-3 ' src={poisson_rouge} alt="Mon poisson rouge traverse de gauche vers la droite" />
                <img className='fish rounded-3 ' src={my_fish} alt="Mon poisson rouge traverse de gauche vers la droite" />
            </div>
        </div>
        {/* <div id="text-container" class="text-container "></div> */}
        </>
    );
}

export default SquareAnimation;
