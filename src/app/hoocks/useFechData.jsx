import { useEffect, useState } from "react";
import { useProgress } from "./useprogres";

const enviarDatosAlServidor = async (data) => {
  try {
    const response = await fetch('http://localhost:3001/guardar-datos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    console.log('Datos enviados correctamente al servidor Express.js');
    return true; // Indica que la operación fue exitosa
  } catch (error) {
    console.error('Error al enviar datos al servidor Express.js:', error);
    return false; // Indica que hubo un error
  }
};
const enviarDatosAlServidorProperies = async (data) => {
  try {
    const response = await fetch('http://localhost:3001/guardar-properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    console.log('propiedades enviadas correctamente al servidor Express.js');
    return true; // Indica que la operación fue exitosa
  } catch (error) {
    console.error('Error al enviar datos al servidor Express.js:', error);
    return false; // Indica que hubo un error
  }
};

const descargarArchivoDelServidor = async () => {
  try {
    const response = await fetch('http://localhost:3001/descargar-datos');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datos.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al descargar el archivo del servidor:', error);
  }
};

const fetchData = async (offset, resultRecordCount) => {
  //const url = `https://mgeorio.rionegro.gov.co:444/arcgis/rest/services/CATASTRO/Catastro/MapServer/3/query?where=OBJECTID+>0&text=&objectIds=&time=&timeRelation=esriTimeRelationOverlaps&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=${offset}&resultRecordCount=${resultRecordCount}&returnExtentOnly=false&sqlFormat=none&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson`;
  //const url = `https://mgeorio.rionegro.gov.co:444/arcgis/rest/services/CATASTRO/Curvas_Nivel/MapServer/0/query?where=FID+%3E%3D+${offset}+AND+FID+%3C+${resultRecordCount+100}&text=&objectIds=&time=&timeRelation=esriTimeRelationOverlaps&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&sqlFormat=none&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson`;
  const url = `https://mgeorio.rionegro.gov.co:444/arcgis/rest/services/CATASTRO/Curvas_Nivel/MapServer/2/query?where=FID+>%3D+${offset}+AND+FID+<+${resultRecordCount}&text=&objectIds=&time=&timeRelation=esriTimeRelationOverlaps&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&sqlFormat=none&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem with your fetch operation:', error);
    return { features: [] }; // Devolver una matriz vacía en caso de error
  }
};

export const useFetchData = (iteration) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchDataBatch = async () => {
      let dataProperties = await fetchData(1, 1);
      let offset = 7501;
      let pendingRequests = iteration;

      const saveDataProperties = await enviarDatosAlServidorProperies(dataProperties);

      if (saveDataProperties) {
        while (pendingRequests > 0) {
          const maxConcurrentRequests = Math.min(pendingRequests, 1);
          const dataPromises = [];

          for (let i = 0; i < maxConcurrentRequests; i++) {
            dataPromises.push(fetchData(offset, offset+15));
            offset += 15;
            pendingRequests--;
          }

          const completedData = await Promise.all(dataPromises);
          const features = completedData.flatMap(data => data.features);
          let success = await enviarDatosAlServidor(features);

          if (success) {
            const newProgress = ((iteration - pendingRequests) / iteration) * 100;
            setProgress(newProgress);
          } else {
            // Manejar el error
            alert('Error al enviar datos al servidor. Por favor, inténtalo de nuevo más tarde.');
            return; // Salir de la función si hay un error
          }

          // Descargar archivo después de cada ciclo

          await new Promise(resolve => setTimeout(resolve, 4000));
        }
      }
    };

    fetchDataBatch();
  }, []);

  useEffect(()=>{
    descargarArchivoDelServidor();
  },[progress])

  return { progress };
};
