"use client";
import { useFetchData } from "../hoocks/useFechData";
import { Backdrop } from "@mui/material";
import CircularWithValueLabel from "./progresCircle";
import { useState } from "react";



export default function LoadingCircle() {


  const { progress } = useFetchData(1393);

  const [open, setOpen] = useState(true);
  const [view, setView] = useState(false);

  const handleClose = () => {
    if (progress == 100 || progress > 100) {
      // Esperar dos segundos antes de cambiar el estado de open
      setTimeout(() => {
        setOpen(false); // Cambiar el estado de open después de dos segundos
      }, 500); // Esperar dos segundos (2000 milisegundos)
    }
  };

  if (progress == 100 || progress > 100) {
    // Esperar dos segundos antes de cambiar el estado de open
    setTimeout(() => {
      
      setOpen(false); // Cambiar el estado de open después de dos segundos
      setView(true)

    }, 500); // Esperar dos segundos (2000 milisegundos)


  }

  return (
    <>
          <Backdrop
      sx={{ color: 'white', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={handleClose}
    >
      <CircularWithValueLabel valor={progress} color="inherit" />
      
    </Backdrop>
    </>
  );
}
