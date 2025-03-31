import React from "react";
import Alert from '@mui/material/Alert';
import xmark from '../../../public/assets/xmark.svg';
import Image from "next/image";

const CustomAlert = ({active, text, onBtnClick}) => {
    return (
        active && 
        <Alert
            style={{width: '70%', position: 'absolute', bottom: 10, right: '15%'}}
            action={
                <button onClick={onBtnClick} style={{backgroundColor: 'transparent', outline: 'none', border: 'none'}}>
                    <Image src={xmark} alt="xmark" width={15} />
                </button>
            }
            
        >
            {text}
        </Alert>
    );
}

export default CustomAlert;