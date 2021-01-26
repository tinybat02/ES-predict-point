import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import { Vector as VectorLayer } from 'ol/layer';
import { Circle, Style, Fill, Text, Stroke } from 'ol/style';

interface SingleData {
  latitude: number;
  longitude: number;
  uuid: string;
  [key: string]: any;
}

export const processDataES = (data: SingleData[]) => {
  const latestCoord: { [key: string]: [number, number] } = {};
  data.map((item) => {
    if (!latestCoord[item.uuid]) {
      latestCoord[item.uuid] = [item.longitude, item.latitude];
    }
  });

  const dataPoints = Object.keys(latestCoord).map((hash) => {
    const pointFeature = new Feature(new Point(latestCoord[hash]).transform('EPSG:4326', 'EPSG:3857'));
    let radius = 10;

    pointFeature.setStyle(
      new Style({
        image: new Circle({
          radius: radius,
          fill: new Fill({ color: 'rgba(255, 255, 255, 0.5)' }),
          stroke: new Stroke({
            color: '#49A8DE',
            width: 1,
          }),
        }),
        text: new Text({
          stroke: new Stroke({
            color: '#b7b7b7',
            width: 1,
          }),
          font: '18px',
          //@ts-ignore
          text: hash,
          offsetY: -10,
        }),
      })
    );
    return pointFeature;
  });

  return new VectorLayer({
    source: new VectorSource({
      features: dataPoints,
    }),
    zIndex: 2,
  });
};
