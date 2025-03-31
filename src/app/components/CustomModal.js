import React, { useState } from "react";
import { Modal as BaseModal } from "@mui/material";
import {styled, css} from "@mui/material";
import successImg from '../../../public/assets/success.svg';
import Image from "next/image";
import { lineHeight } from "@mui/system";
import Button from '@mui/material/Button';

const CustomModal = ({contentTxt, openModal, hour, date, onSubmit}) => {
    return (
        <Modal
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
            sx={{textAlign: "center"}}
            open={openModal}
        >   
            <div className="modal-container" style={{width: "100%", backgroundColor: 'white', outline: 'none', border: 'none', padding: 100, borderRadius: 10}}>
                <div className="modal-content">
                    <h3 style={{marginBottom: 15}}>{contentTxt}</h3>
                    <h4 style={{marginBottom: 10}}>{`בתאריך: ${date}`}</h4>
                    <h4 style={{marginBottom: 20}}>{`בשעה: ${hour}`}</h4>
                    <Image alt="image" src={successImg} width={200} />
                </div>

                <div className="modal-footer" style={{marginTop: 80, display: 'flex', justifyContent: 'space-between'}}>
                    <Button variant="outlined" onClick={() => onSubmit(true)} color="error">בטל</Button>
                    <Button variant="outlined" onClick={() => onSubmit(false)}>סיים</Button>
                </div>
            </div>
        </Modal>
    );
}

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default CustomModal;