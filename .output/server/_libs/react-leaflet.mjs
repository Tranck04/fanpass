import { r as reactExports, R as React } from "./react.mjs";
import { u as useLeafletContext, c as createLeafletContext, L as LeafletContext, a as createLayerComponent, b as createElementObject, e as extendContext, d as createPathComponent, f as createOverlayComponent, g as createTileLayerComponent, h as updateGridLayer, w as withPane } from "./react-leaflet__core.mjs";
import { l as leafletSrcExports } from "./leaflet.mjs";
import "./react-dom.mjs";
function useMap() {
  return useLeafletContext().map;
}
function MapContainerComponent({ bounds, boundsOptions, center, children, className, id, placeholder, style, whenReady, zoom, ...options }, forwardedRef) {
  const [props] = reactExports.useState({
    className,
    id,
    style
  });
  const [context, setContext] = reactExports.useState(null);
  const mapInstanceRef = reactExports.useRef(void 0);
  reactExports.useImperativeHandle(forwardedRef, () => context?.map ?? null, [
    context
  ]);
  const mapRef = reactExports.useCallback((node) => {
    if (node !== null && !mapInstanceRef.current) {
      const map = new leafletSrcExports.Map(node, options);
      mapInstanceRef.current = map;
      if (center != null && zoom != null) {
        map.setView(center, zoom);
      } else if (bounds != null) {
        map.fitBounds(bounds, boundsOptions);
      }
      if (whenReady != null) {
        map.whenReady(whenReady);
      }
      setContext(createLeafletContext(map));
    }
  }, []);
  reactExports.useEffect(() => {
    return () => {
      context?.map.remove();
    };
  }, [
    context
  ]);
  const contents = context ? /* @__PURE__ */ React.createElement(LeafletContext, {
    value: context
  }, children) : placeholder ?? null;
  return /* @__PURE__ */ React.createElement("div", {
    ...props,
    ref: mapRef
  }, contents);
}
const MapContainer = /* @__PURE__ */ reactExports.forwardRef(MapContainerComponent);
const Marker = createLayerComponent(function createMarker({ position, ...options }, ctx) {
  const marker = new leafletSrcExports.Marker(position, options);
  return createElementObject(marker, extendContext(ctx, {
    overlayContainer: marker
  }));
}, function updateMarker(marker, props, prevProps) {
  if (props.position !== prevProps.position) {
    marker.setLatLng(props.position);
  }
  if (props.icon != null && props.icon !== prevProps.icon) {
    marker.setIcon(props.icon);
  }
  if (props.zIndexOffset != null && props.zIndexOffset !== prevProps.zIndexOffset) {
    marker.setZIndexOffset(props.zIndexOffset);
  }
  if (props.opacity != null && props.opacity !== prevProps.opacity) {
    marker.setOpacity(props.opacity);
  }
  if (marker.dragging != null && props.draggable !== prevProps.draggable) {
    if (props.draggable === true) {
      marker.dragging.enable();
    } else {
      marker.dragging.disable();
    }
  }
});
const Polyline = createPathComponent(function createPolyline({ positions, ...options }, ctx) {
  const polyline = new leafletSrcExports.Polyline(positions, options);
  return createElementObject(polyline, extendContext(ctx, {
    overlayContainer: polyline
  }));
}, function updatePolyline(layer, props, prevProps) {
  if (props.positions !== prevProps.positions) {
    layer.setLatLngs(props.positions);
  }
});
const Popup = createOverlayComponent(function createPopup(props, context) {
  const popup = new leafletSrcExports.Popup(props, context.overlayContainer);
  return createElementObject(popup, context);
}, function usePopupLifecycle(element, context, { position }, setOpen) {
  reactExports.useEffect(function addPopup() {
    const { instance } = element;
    function onPopupOpen(event) {
      if (event.popup === instance) {
        instance.update();
        setOpen(true);
      }
    }
    function onPopupClose(event) {
      if (event.popup === instance) {
        setOpen(false);
      }
    }
    context.map.on({
      popupopen: onPopupOpen,
      popupclose: onPopupClose
    });
    if (context.overlayContainer == null) {
      if (position != null) {
        instance.setLatLng(position);
      }
      instance.openOn(context.map);
    } else {
      context.overlayContainer.bindPopup(instance);
    }
    return function removePopup() {
      context.map.off({
        popupopen: onPopupOpen,
        popupclose: onPopupClose
      });
      context.overlayContainer?.unbindPopup();
      context.map.removeLayer(instance);
    };
  }, [
    element,
    context,
    setOpen,
    position
  ]);
});
const TileLayer = createTileLayerComponent(function createTileLayer({ url, ...options }, context) {
  const layer = new leafletSrcExports.TileLayer(url, withPane(options, context));
  return createElementObject(layer, context);
}, function updateTileLayer(layer, props, prevProps) {
  updateGridLayer(layer, props, prevProps);
  const { url } = props;
  if (url != null && url !== prevProps.url) {
    layer.setUrl(url);
  }
});
export {
  MapContainer as M,
  Popup as P,
  TileLayer as T,
  Marker as a,
  Polyline as b,
  useMap as u
};
