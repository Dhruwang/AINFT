import { ethers } from 'ethers';
import { useEffect } from 'react';

const Navigation = (props) => {
    

    return (
        <nav>
            <div className='nav__brand'>
                <h1>AINFT</h1>
            </div>

            {props.account ? (
                <button
                    type="button"
                    className='nav__connect'
                >
                    {props.account.slice(0, 6) + '...' + props.account.slice(38, 42)}
                </button>
            ) : (
                <button
                    type="button"
                    className='nav__connect'
                    onClick={props.connectHandler}
                >
                    Connect
                </button>
            )}
        </nav>
    );
}

export default Navigation;