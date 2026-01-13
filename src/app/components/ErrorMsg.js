import React from "react";


const ErrorMsg = ({text}) => {
    return (
        <div className="error-msg-container">
            <p className="error-msg-txt">{text}</p>
        </div>
    );
}

export default ErrorMsg;