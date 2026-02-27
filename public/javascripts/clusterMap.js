/* global mapboxgl */
mapboxgl.accessToken = window.mapToken;

const campgroundsArr = Array.isArray(window.campgrounds) ? window.campgrounds : [];

const geoData = {
  type: "FeatureCollection",
  features: campgroundsArr
    .filter(
      (cg) =>
        cg &&
        cg.geometry &&
        Array.isArray(cg.geometry.coordinates) &&
        cg.geometry.coordinates.length === 2
    )
    .map((cg) => ({
      type: "Feature",
      geometry: cg.geometry,
      properties: {
        popUpMarkup: `
          <strong><a href="/campgrounds/${cg._id}">${cg.title}</a></strong>
          <p>${cg.location || ""}</p>
        `,
      },
    })),
};

const map = new mapboxgl.Map({
  container: "cluster-map",
  style: "mapbox://styles/mapbox/light-v11",
  center: [-103.5917, 40.6699],
  zoom: 3,
});

map.addControl(new mapboxgl.NavigationControl());

map.on("load", () => {
  // 1) SOURCE
  map.addSource("campgrounds", {
    type: "geojson",
    data: geoData,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  // 2) CLUSTERS (colored) - Colt style
  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "campgrounds",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#51bbd6",
        20,
        "#f1f075",
        50,
        "#f28cb1",
      ],
      "circle-radius": ["step", ["get", "point_count"], 15, 20, 20, 50, 25],
    },
  });

  // 3) CLUSTER COUNT (numbers)
  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "campgrounds",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  });

  // 4) UNCLUSTERED POINTS (single dots)
  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "campgrounds",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#11b4da",
      "circle-radius": 6,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  });

  // Click a cluster to zoom
  map.on("click", "clusters", (e) => {
    const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
    if (!features.length) return;

    const clusterId = features[0].properties.cluster_id;
    map
      .getSource("campgrounds")
      .getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        map.easeTo({ center: features[0].geometry.coordinates, zoom });
      });
  });

  // Click an unclustered point to show popup
  map.on("click", "unclustered-point", (e) => {
    if (!e.features || !e.features.length) return;
    const { popUpMarkup } = e.features[0].properties;

    new mapboxgl.Popup()
      .setLngLat(e.features[0].geometry.coordinates)
      .setHTML(popUpMarkup)
      .addTo(map);
  });

  map.on("mouseenter", "clusters", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "clusters", () => {
    map.getCanvas().style.cursor = "";
  });
});