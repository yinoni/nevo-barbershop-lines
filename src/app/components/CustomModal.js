import React, { useState } from "react";
import { Modal as BaseModal } from "@mui/material";
import {styled, css} from "@mui/material";
import successImg from '../../../public/assets/success.svg';
import Image from "next/image";

const CustomModal = ({contentTxt, openModal}) => {
    return (
        <Modal
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
            sx={{textAlign: "center"}}
            open={openModal}
        >   
            <div style={{width: "90%", backgroundColor: 'white', outline: 'none', border: 'none', padding: 100, borderRadius: 10}} className="modal-content">
                <h2 style={{marginBottom: 50}}>{contentTxt}</h2>
                <Image alt="image" src={successImg} width={200} />
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