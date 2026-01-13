"use client"

require('dotenv').config();

import React, { useEffect, useRef, useState } from "react";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import dayjs from "dayjs";
import axios from "axios";
import CustomModal from "./components/CustomModal";
import 'dayjs/locale/en-gb';
import socket from "./socket";
import {route} from './consts.js';
import CustomAlert from "./components/CustomAlert";
import ErrorMsg from "./components/ErrorMsg";


export default function Home() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [hour, setHour] = useState(0);
  const [date, setDate] = useState(dayjs());
  const [openModal, setOpenModal] = useState(false);
  const [hours, setHours] = useState([]);
  const [alertState, setAlertState] = useState({active: false, text: "התור בוטל בהצלחה"});
  const hoursRef = useRef(hours);
  const dateRef = useRef(date);
  const [errorMsg, setErrorMsg] = useState("");

  const hoursComponents = hours.map((data, key) => {
    return <MenuItem key={key} value={key}>{data}</MenuItem>
  });

  const onFullNameChange = (e) => {
    setFullName(e.target.value);
  }

  const onPhoneChange = (e) => {
    setPhone(e.target.value);
  }

  const handleChange = (event) => {
    setHour(event.target.value);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
  }

  const handleDateAccept = (newDate) => {
    axios.post(`${route}/getHours`, {date: dayjs(newDate).format("DD/MM/YYYY")})
    .then(result => {
      setHours(result.data.hours);
    });
  }

  const checkFormData = () => {
    const phoneNumberPatt = /^05\d{1}\d{3}\d{4}$/;
    return fullName !== "" && phoneNumberPatt.test(phone) && hoursComponents.length > 0;
  }

  const getHours = () => {
    axios.post(`${route}/getHours`, {date: date.format("DD/MM/YYYY")})
    .then(result => {
      
      setHours(result.data.hours);
    })
    .catch(error => {
      console.log("Error! ====> ", error);
    });
  }

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
    });

    socket.on("updatedHours", (data) => {
      let dataDate = data.date;
      let dataHour = data.hour;
      let currentDateFormatted = dayjs(dateRef.current).format("DD/MM/YYYY");
        
      if(dataDate === currentDateFormatted){
        setHours(hoursRef.current.filter(hour => dataHour !== hour));
      }
    });

    getHours();

    return () => {
      socket.off("connect");
    };

  }, []);

  useEffect(() => {
    hoursRef.current = hours;
  }, [hours]);

  useEffect(() => {
    dateRef.current = date;
    getHours();
  }, [date]);

  const onSubmit = async () => {
    if(fullName !== "" || phone !== "" || hour !== -1){
      let newLine = {
        fullName: fullName,
        phoneNumber: phone,
        hour: hours[hour],
        date: dayjs(date).format("DD/MM/YYYY")
      };
      try{
        let result = await axios.post(`${route}/addLine`, {newLine: newLine});
        setOpenModal(true);
        setErrorMsg("");
      }
      catch(e){
        let error_msg = "אירעה שגיאה. נסה שוב מאוחר יותר";
        if(e)
          error_msg = e.response.data.msg;
        setErrorMsg(error_msg);
        
      }
      
    }
  }

  /*This function gets called when the users clicks on finish button on the modal*/
  const onModalClose = async (cancelLine) => {
    setOpenModal(false);

    if(cancelLine){
      socket.emit("cancelLine", {date: dayjs(date).format("DD/MM/YYYY"), hour: hours[hour]});
      setAlertState({...alertState, active: true})
    }
    else{ 
      setDate(dayjs());
      setFullName("");
      setHour(0);
      setPhone("");
      setErrorMsg("");

    }

  }

  return (
    <div className="container">
      <h1 className="logo">MAB</h1>

      <TextField sx={{ marginBottom: 4}} required value={fullName} onChange={onFullNameChange} id="standard-basic" label="שם מלא" variant="standard" />
      <TextField sx={{ marginBottom: 1}} required type={"number"} value={phone} onChange={onPhoneChange} id="standard-basic" label="מספר טלפון" variant="standard" />
      <LocalizationProvider fullWidth dateAdapter={AdapterDayjs} adapterLocale='en-gb'>
        <DemoContainer sx={{ marginTop: 2, height: 520}} components={['DatePicker']}>
          <DatePicker
            value={date} 
            label="בחר תאריך"
            onAccept={handleDateAccept}
            onChange={handleDateChange}
          />
        </DemoContainer>
      </LocalizationProvider>

      {
        hoursComponents.length > 0 ? 
        <Box sx={{ maxWidth: 100, width: '100%', marginTop: "-355px", marginBottom: 2 }}>
          <FormControl>
            <InputLabel id="demo-simple-select-label">בחר שעה</InputLabel>
            <Select
              required
              fullWidth
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="בחר שעה"
              value={hour}
              onChange={handleChange}
            >
              {hoursComponents}
            </Select>
          </FormControl>
        </Box>
        :

        "אין תורים בתאריך שבחרת"
      }
      
      <Button sx={{marginTop: 5}} disabled={!checkFormData()} onClick={onSubmit} variant="outlined">קבע תור</Button>
      <CustomModal onSubmit={onModalClose} contentTxt=' !התור נקבע בהצלחה ' date={dayjs(date).format('DD/MM/YYYY')} hour={hours[hour]} openModal={openModal} />
      <CustomAlert active={alertState.active} text={alertState.text} onBtnClick={() => setAlertState({...alertState, active: false})} />
      { errorMsg !== "" && <ErrorMsg text={errorMsg} />}
    </div>
  );
}
