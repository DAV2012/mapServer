// import React, { useState } from "react";

// export const DownloadJSONLink = ({ allFeatures }) => {
//   const [downloading, setDownloading] = useState(false);

//   const handleDownload = async () => {
//     try {
//       setDownloading(true);

//       // Dividir los datos en partes más pequeñas
//       const batchSize = 10000; // Tamaño del lote
//       const batches = [];
//       for (let i = 0; i < allFeatures.length; i += batchSize) {
//         batches.push(allFeatures.slice(i, i + batchSize));
//       }

//       // Enviar cada lote al servidor
//       for (let batch of batches) {
//         const response = await fetch("/api/upload-json", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify({ batch })
//         });

//         if (!response.ok) {
//           throw new Error("Error al enviar los datos al servidor");
//         }
//       }

//       console.log("Datos enviados correctamente al servidor");
//     } catch (error) {
//       console.error("Error durante la transferencia de datos:", error);
//     } finally {
//       setDownloading(false);
//     }
//   };

//   return (
//     <button onClick={handleDownload} disabled={downloading}>
//       {downloading ? "Transfiriendo datos..." : "Transferir datos al servidor"}
//     </button>
//   );
// };
