"use client"

require('dotenv').config();

import React, { useEffect, useState } from "react";
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
import { io } from "socket.io-client";

export default function Home() {


  const route = process.env.NEXT_PUBLIC_SERVER_URL;
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [hour, setHour] = useState(0);
  const [date, setDate] = useState(dayjs());
  const [openModal, setOpenModal] = useState(false);
  const socket = io(route);
  const [hours, setHours] = useState([]);

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
    return fullName !== "" && phoneNumberPatt.test(phone) && hour !== -1;
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to the server!", socket.id);
    });


    axios.post(`${route}/getHours`, {date: date.format("DD/MM/YYYY")})
    .then(result => {
      
      setHours(result.data.hours);
    })
    .catch(error => {
      console.log("Error! ====> ", error);
    })

  }, [])


  const onSubmit = async () => {
    if(fullName !== "" || phone !== "" || hour !== -1){
      await socket.emit("addLine", {
        fullName: fullName,
        phoneNumber: phone,
        hour: hours[hour],
        date: dayjs(date).format("DD/MM/YYYY")
      });

      setOpenModal (true)
    }
  }

  /*
  socket.on("updatedHours", (data) => {
    let dataDate = data.date;
    let dataHour = data.hour;
    let currentDateFormatted = dayjs(date).format("DD/MM/YYYY");

    if(dataDate === currentDateFormatted){
      setHours(hours.filter(hour => dataHour !== hour));
    }
  });
  */

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
      <CustomModal contentTxt='התור נקבע בהצלחה!' date={dayjs(date).format('DD/MM/YYYY')} hour={hours[hour]} openModal={openModal} />
    </div>
  );
}
