angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.factory('Movements', function() {
  var locations = [];

  return {
    add: function(pos) {
      locations.push({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      })

      return locations.length;
    },

    totalDistance: function() {
      return geolib.getPathLength(locations);
    },

    all: locations,
  };
})
.controller('MapCtrl', function($scope, $ionicLoading, $compile, $timeout, Movements, $cordovaGeolocation) {
  function initialize() {
    var myLatlng = new google.maps.LatLng(49.2756719, -123.11771039999999);

    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"),
        mapOptions);

    //Marker + infowindow + angularjs compiled ng-click
    var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
    var compiled = $compile(contentString)($scope);

    var infowindow = new google.maps.InfoWindow({
      content: compiled[0]
    });

    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Starting Point'
    });

    $scope.googLocations = [];
    $scope.line = new google.maps.Polyline({
      path: $scope.googLocations,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      map: map
    });

    $scope.map = map;
  }

  $scope.distance = 0;
  google.maps.event.addDomListener(window, 'load', initialize);

  $scope.trackMe = function() {
    $scope.tracking = true;
    window.plugin.backgroundMode.enable();

    $timeout(function() {
      if ($scope.tracking) {
        $cordovaGeolocation.getCurrentPosition().then(function(pos) {
          Movements.add(pos);
          $scope.distance = Movements.totalDistance();
          $scope.googLocations.push(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.line.setPath($scope.googLocations);
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        }, function(error) {
          console.log(error.message);
        });

        $scope.trackMe();
      }
    }, 5000)
  }

  $scope.stopTracking = function() {
    $scope.tracking = false;
    window.plugin.backgroundMode.disable();
    alert(Movements.totalDistance());
  }

  $scope.centerOnMe = function() {
    if(!$scope.map) {
      return;
    }

    $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function(pos) {
      console.log(pos);
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $ionicLoading.hide();
    }, function(error) {
      alert('Unable to get location: ' + error.message);
    });
  };

  $scope.clickTest = function() {
    alert('Example of infowindow with ng-click')
  };
});
