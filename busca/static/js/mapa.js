var map;
var marker;
var position;

var layerMap;

var zoom = 14;

var urlLayerDefault;
var urlLayerSatelite;

var allMarkers = [];

function initMap(z=14) {

  var lat, lng;

  var latInit = -16.6797077;
  var lngInit = -49.2567487;

  map = L.map('map').setView([
    latInit,
    lngInit,
  ], z);

  //urlLayerDefault = ["https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png"];

  //urlLayerDefault = ["https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"];

  // urlLayerDefault = ['https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'];

  //urlLayerDefault = ["https://maps.tilehosting.com/data/satellite/{z}/{x}/{y}.jpg?key=yd4rAVOD6ZdfBCcbKnIE"];

  // urlLayerDefault = [
  //     "https://c-mydrive.api-system.tomtom.com/traffic/map/4/tile/incidents/s2/{z}/{x}/{y}.png?key=sATA9OwG11zrMKQcCxR3eSEjj2n8Jsrg&1537043586516"
  // ];

  // urlLayerDefault = [
  //     "https://4.base.maps.api.here.com/maptile/2.1/maptile/172e46d3ac/normal.day.transit/{z}/{x}/{y}/256/png8?app_id=bC4fb9WQfCCZfkxspD4z&app_code=K2Cpd_EKDzrZb1tz0zdpeQ&lg=por&ppi=72&pview=DEF"
  // ];

  // urlLayerDefault = [
  //     "https://3.base.maps.api.here.com/maptile/2.1/maptile/172e46d3ac/normal.day/{z}/{x}/{y}/256/png8?xnlp=CL_JSMv3.0.16.0&app_id=devportal-demo-20180625&app_code=9v2BkviRwi9Ot26kp2IysQ"
  // ]

  // urlLayerDefault = [
  //     "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
  // ]

  urlLayerDefault = [
    'https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i437142095!3m14!2spt-BR!3sBR!5e18!12m1!1e68!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy50OjMzfHMuZTpsfHAudjpvZmY!4e0!23i1301875',
  ];

  urlLayerSatelite = [
    'https://a.tiles.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA',
  ];

  // urlLayerDefault = [
  //     "https://worldtiles1.waze.com/tiles/{z}/{x}/{y}.png",
  //     "https://worldtiles2.waze.com/tiles/{z}/{x}/{y}.png",
  //     "https://worldtiles3.waze.com/tiles/{z}/{x}/{y}.png",
  //     "https://worldtiles4.waze.com/tiles/{z}/{x}/{y}.png"
  // ];

  setLayerMap();

  if (lat && lng) setMarkerMap(lat, lng);

  map.scrollWheelZoom.disable();

  removeLabelMap();

  setTimeout(function() {

    removeLabelMap();

  }, 1000);

  var timeoutOnmouseover;
  var timeoutOnmouseout;

  document.getElementById('body_map').onmouseover = function() {

    try {

      if (timeoutOnmouseover) clearTimeout(timeoutOnmouseover);

      if (timeoutOnmouseout) clearTimeout(timeoutOnmouseout);

      timeoutOnmouseover = setTimeout(function() {
        if (!map.scrollWheelZoom._enabled) map.scrollWheelZoom.enable();
      }, 1000);

    } catch (e) {

    }

  };

  document.getElementById('body_map').onmouseout = function() {

    try {

      if (timeoutOnmouseover) clearTimeout(timeoutOnmouseover);

      timeoutOnmouseout = setTimeout(function() {
        map.scrollWheelZoom.disable();
      }, 100);

    } catch (e) {

    }

  };

  var timeoutReloadImgs;

  document.querySelector('#map').addEventListener('mouseover', function(element) {

    if (timeoutReloadImgs) clearTimeout(timeoutReloadImgs);

    timeoutReloadImgs = setTimeout(function() {
      reloadImgs();
    }, 3000);

  });

  timeoutReloadImgs = setTimeout(function() {

    reloadImgs();

  }, 3000);

}

function reloadImgs() {
  var containersImg = document.querySelectorAll('.leaflet-tile-container img');
  for (var i = 0; i < containersImg.length; i++) {
    var imgLoad = IsImageOk(containersImg[i]);
    if (!imgLoad) {
      console.info('recarregando:', containersImg[i].src);
      containersImg[i].src = containersImg[i].src + '?time=' + new Date().getTime();
    }
  }
}

function IsImageOk(img) {
  if (!img.hidden) {
    if (!img.complete) {
      return false;
    }
    if (img.naturalWidth === 0) {
      return false;
    }
  }
  return true;
}

function removeLabelMap() {
  document.getElementsByClassName('leaflet-control-attribution')[0].style.display = 'none';
  document.getElementsByClassName('leaflet-control-attribution')[0].getElementsByTagName('a')[0].removeAttribute('href');
  document.getElementsByClassName('leaflet-control-attribution')[0].getElementsByTagName('a')[0].style.cursor = 'default';
}

function setMarkerMap(lat, lng) {
  if (!marker) {
    var IconDefault = L.icon({
      iconUrl: "/static/images/placeholder-64.png",
      iconSize: [
        32,//45,
        32,//68,
      ],
      iconAnchor: [
        16,//23,
        30,//60,
      ],
      popupAnchor: [
        0,
        -50,
      ],
    });

    marker = L.marker([
      lat,
      lng,
    ], {
      icon: IconDefault,
      draggable: true,
    }).addTo(map);

    marker.on('dragend', function(e) {
      position = setPosition(e.target._latlng.lat, e.target._latlng.lng);
    });

    marker.bindPopup('...', {autoClose: false});

    allMarkers.push(marker);

    setTimeout(function() {
      centralizarMapa();
    }, 100);

  } else {
    setPosition(lat, lng);
    setCoordsMarker(lat, lng);
  }
}

function setLayerMap(option) {

  if (layerMap) {
    map.removeLayer(layerMap);
  }

  if (option === 'mapaSatelite') {
    layerMap = L.tileLayer(urlLayerSatelite[randomIntFromInterval(0, (urlLayerSatelite.length - 1))], {attribution: ''}).addTo(map);
  } else {
    layerMap = L.tileLayer(urlLayerDefault[randomIntFromInterval(0, (urlLayerDefault.length - 1))], {attribution: ''}).addTo(map);
  }

}

function setPosition(lat, lng) {
  return position = {
    lat: function() {
      return lat;
    },
    lng: function() {
      return lng;
    },
  }
}

function centralizarMapa() {
  if (marker) {
    map.setView(marker.getLatLng(), zoom);
  } else {
    alert('NENHUM PONTO ENCONTRADO PARA CENTRALIZAR, ADICIONE UM ENDEREÇO PARA CRIAR UM MARKER.');
  }
}

function setCoordsMarker(lat, lng) {
  if (!position) return;
  if (!marker) setMarkerMap(lat, lng);
  var newLatLng = new L.LatLng(lat, lng);
  marker.setLatLng(newLatLng);
  position = setPosition(lat, lng);
  centralizarMapa();
}

function geocodeAddress() {

  var address = document.querySelector('#input-address').value;

  if (!address) {
    alert('Informe um endereço para pesquisar!');
    return;
  }

  sendRequest('http://localhost:8181/geocodeByEndereco?endereco=' + address, function(response, status) {

    if (response) {
      var obj = {
        'opcao': 'resultGeocode',
        'resultado': {
          'status': 'OK',
          'results': response,
        },
      };
      if (!response.lat) response.lat = 0;
      if (!response.lng) response.lng = 0;
      position = setPosition(response.lat, response.lng);
      setCoordsMarker(position.lat(), position.lng());
      window.parent.postMessage(JSON.stringify(obj), '*');
    }

  }, null, 'GET', [{'Content-Type': 'application/json; charset=utf-8'}]);

}

function sendRequest(url, callback, dataPost, method, headers) {

  var req = createXMLHTTPObject();
  if (!req) return;
  if (!method) method = 'GET';
  req.open(method, url, true);
  if (headers) {
    Object.keys(headers).forEach(function(key) {
      var key_ = Object.keys(headers[key])[0];
      var value_ = headers[key][key_];
      req.setRequestHeader(key_, value_);
    });
  }

  req.onreadystatechange = function() {
    if (req.readyState != 4) return;
    var responseObj = req.responseText;
    if (req.status == 200) try {
      responseObj = JSON.parse(responseObj);
    } catch (err) {

    }
    callback(responseObj, req.status);
  }
  req.send(JSON.stringify(dataPost));
}

var XMLHttpFactories = [
  function() {
    return new XMLHttpRequest()
  },
  function() {
    return new ActiveXObject('Msxml2.XMLHTTP')
  },
  function() {
    return new ActiveXObject('Msxml3.XMLHTTP')
  },
  function() {
    return new ActiveXObject('Microsoft.XMLHTTP')
  },
];

function createXMLHTTPObject() {
  var xmlhttp = false;
  for (var i = 0; i < XMLHttpFactories.length; i++) {
    try {
      xmlhttp = XMLHttpFactories[i]();
    } catch (e) {
      continue;
    }
    break;
  }
  return xmlhttp;
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}

