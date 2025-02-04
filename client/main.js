document.addEventListener('DOMContentLoaded', () => {
  var mapContainer = document.getElementById('map'); // 지도를 표시할 div
  var mapOption = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
      level: 3 // 지도의 확대 레벨
  };

  // 지도를 생성합니다
  var map = new kakao.maps.Map(mapContainer, mapOption);

  fetch('http://localhost:8080/')
      .then(response => response.json())
      .then(data => {
          const storeList = document.getElementById('store-list');

          data.forEach(store => {
              const listItem = document.createElement('li');
              listItem.innerHTML = `매장명: ${store.name}<br>주소: ${store.address}`;
              storeList.appendChild(listItem);

              // 이미지 추가
              const imgElement = document.createElement('img');
              imgElement.src = './images/' + store.image.split('\\')[1];
              imgElement.alt = store.image.split('\\')[1];
              imgElement.width = 100;
              storeList.appendChild(imgElement);

              makemark(store.address, map, store.name);
          });
      })
      .catch(error => console.error('Error fetching data:', error));
});

function makemark(address, map, name) {
  // 주소-좌표 변환 객체를 생성합니다
  var geocoder = new kakao.maps.services.Geocoder();

  // 주소로 좌표를 검색합니다
  geocoder.addressSearch(address, function (result, status) {
      // 정상적으로 검색이 완료됐으면
      if (status === kakao.maps.services.Status.OK) {
          var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

          // 결과값으로 받은 위치를 마커로 표시합니다
          var marker = new kakao.maps.Marker({
              map: map,
              position: coords
          });

          map.setCenter(coords);

          // 인포윈도우로 장소에 대한 설명을 표시합니다
          var infowindow = new kakao.maps.InfoWindow({
              content: `<div style="width:150px;text-align:center;padding:6px 0;">${name}</div>`
          });

          // 마커에 마우스오버 이벤트 추가
          kakao.maps.event.addListener(marker, 'mouseover', function () {
              infowindow.open(map, marker);
          });

          // 마커에 마우스아웃 이벤트 추가
          kakao.maps.event.addListener(marker, 'mouseout', function () {
              infowindow.close();
          });
      }
  });
}

