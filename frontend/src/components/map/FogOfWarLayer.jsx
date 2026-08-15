import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { cellToBoundary } from 'h3-js';
import L from 'leaflet';

const FogOfWarLayer = ({ unfoggedHexes = [] }) => {
  const map = useMap();
  const canvasRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    const FogLayer = L.Layer.extend({
      onAdd(map) {
        const canvas = L.DomUtil.create('canvas', 'leaflet-fog-of-war');
        const size = map.getSize();
        canvas.width = size.x;
        canvas.height = size.y;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '200';

        const pane = map.getPane('overlayPane');
        pane.appendChild(canvas);

        this._canvas = canvas;
        this._map = map;

        map.on('move zoom resize viewreset', this._reset, this);
        this._reset();
      },

      onRemove(map) {
        L.DomUtil.remove(this._canvas);
        map.off('move zoom resize viewreset', this._reset, this);
      },

      _reset() {
        const topLeft = this._map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(this._canvas, topLeft);
        this._draw();
      },

      _draw() {
        const canvas = this._canvas;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const map = this._map;
        const size = map.getSize();

        canvas.width = size.x;
        canvas.height = size.y;

        ctx.clearRect(0, 0, size.x, size.y);
        ctx.fillStyle = 'rgba(10, 12, 18, 0.85)';
        ctx.fillRect(0, 0, size.x, size.y);

        ctx.globalCompositeOperation = 'destination-out';

        for (const hex of unfoggedHexes) {
          const boundary = cellToBoundary(hex, true);
          if (!boundary || boundary.length === 0) continue;

          ctx.beginPath();
          for (let i = 0; i < boundary.length; i++) {
            const [lng, lat] = boundary[i];
            const point = map.latLngToContainerPoint([lat, lng]);
            if (i === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          }
          ctx.closePath();
          ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
      },
    });

    const layer = new FogLayer();
    layer.addTo(map);
    layerRef.current = layer;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, unfoggedHexes]);

  return null;
};

export default FogOfWarLayer;
