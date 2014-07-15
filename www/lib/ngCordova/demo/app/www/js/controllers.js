angular.module('starter.controllers', [])

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

.controller('AppCtrl', function($scope) {
  $scope.plugins = [
    { name: 'Camera', slug: 'camera' },
    { name: 'Geolocation', slug: 'geolocation' },
    { name: 'Device Motion', slug: 'device-motion' },
    { name: 'Device Orientation', slug: 'device-orientation' },
    { name: 'Flashlight', slug: 'flashlight' },
    { name: 'Statusbar', slug: 'status-bar' },
    { name: 'Vibration', slug: 'vibration' },
    { name: 'Barcode', slug: 'barcode' },
    { name: 'Preferences', slug: 'preferences' }
  ];
})

.controller('CameraCtrl', function($scope, $cordovaCamera) {
  $scope.takePicture = function() {
    $scope.photo = 'http://placekitten.com/320/320';

    $cordovaCamera.getPicture({
      quality: 75,
      targetWidth: 320,
      targetHeight: 320,
      saveToPhotoAlbum: false
    }).then(function(imageURI) {
      $scope.photo = imageURI;
    }, function(err) {
      console.error('Unable to take pic', err);
      alert('Unable to take picture');
    });
  };
})

.controller('GeolocationCtrl', function($scope, $cordovaGeolocation) {
  $cordovaGeolocation.watchPosition({
    frequency: 100
  }).promise.then(function(resp) {
  }, function(err) {
  }, function(position) {
    $scope.lat = position.coords.latitude;
    $scope.lng = position.coords.longitude;
  });

  $scope.getLatLng = function() {
    if(!$scope.lat && !$scope.lng) { return '45.787, -89.052'; }
    return $scope.lat.toFixed(7) + ', ' + $scope.lng.toFixed(7);
  }
  /*
  $scope.toggleTrack = function() {
    $cordovaGeolocation.watchPosition().then(function(resp) {
    }, function(err) {
    }, function(position) {
      $scope.lat = position.coords.latitude;
      $scope.lng = position.coords.longitude;
    });
  };
  */
})

.controller('CompassCtrl', function($scope, $cordovaDeviceOrientation) {
  $cordovaDeviceOrientation.watchHeading({
    frequency: 100
  }).promise.then(function(resp) {
  }, function(err) {
  }, function(position) {
    $scope.compass = position.magneticHeading;
  });

  /*
  $scope.toggleTrack = function() {
    $cordovaGeolocation.watchPosition().then(function(resp) {
    }, function(err) {
    }, function(position) {
      $scope.lat = position.coords.latitude;
      $scope.lng = position.coords.longitude;
    });
  };
  */
})

.directive('rotateTo', function() {
  return {
    restrict: 'A',
    scope: {
      rotateTo: '='
    },
    link: function($scope, $element, $attr) {
      $scope.$watch('rotateTo', function(v) {
        if(typeof v === 'undefined') { return; }
        $element[0].style[ionic.CSS.TRANSFORM] = 'rotate(' + v + 'deg)';
      });
    }
  }
})

.controller('StatusbarCtrl', function($scope, $cordovaStatusbar) {
  $scope.toggleBar = function() {
    if($cordovaStatusbar.isVisible()) {
      $cordovaStatusbar.hide();
    } else {
      $cordovaStatusbar.show();
    }
  };
})

.controller('FlashlightCtrl', function($scope, $cordovaFlashlight) {
  $scope.on = function() {
    $cordovaFlashlight.switchOn();
  };
  $scope.off = function() {
    $cordovaFlashlight.switchOff();
  };
})

.controller('VibrationCtrl', function($scope, $cordovaVibration) {
  $scope.data = {
    vibrateTime: 500
  };

  $scope.vibrate = function() {
    console.log('Vibrating', $scope.data.vibrateTime);
    $cordovaVibration.vibrate($scope.data.vibrateTime);
  }
})


.controller('PreferencesCtrl', function($scope, $log, $cordovaPreferences) {

  var key = 'exampleKey';
  $scope.data = {};
  $scope.data.showMore = false;
  $scope.data.key = key;

  $scope.preferencesSet = function() {
    $cordovaPreferences.set(key, $scope.data.value)
      .then(function(result) {
        if(result) {
          $log.log(key+' was succesfully set to:', $scope.data.value);
          $scope.data.showMore = true;          
        } else {
          $log.log(key+' was not set to: '+$scope.data.value+' we got ', result);                  
        }
      }, function(err) {
        $log.log(key+' was not set to: '+$scope.data.value+' due to', err);        
      });
  };
  
  $scope.preferencesGet = function() {
    $cordovaPreferences.get(key)
      .then(function(value) {
        $log.log(key+' get was succesfully:', value);
        $scope.data.pref = value;
      }, function(err) {
        $log.log(key+' get was not succesfully: '+$scope.data.value+' due to', err);        
      });
  };
})


.controller('BarcodeCtrl', function($scope, $cordovaBarcodeScanner) {

  $scope.scan = function() {
    $cordovaBarcodeScanner.scan().then(function(result) {
      $scope.scanResult = JSON.stringify(result);
    }, function(err) {
      $scope.scanResult = 'SCAN ERROR (see console)'
      console.error(err);
    });
  }
})

.controller('AccelCtrl', function($scope, $cordovaDeviceMotion) {
  console.log('Accel');
  $scope.toggleTrack = function() {
    console.log('Accel tracking');
    $cordovaDeviceMotion.watchAcceleration({
      frequency: 100
    }).promise.then(function(resp) {
    }, function(err) {
    }, function(data) {
      $scope.x = data.x;
      $scope.y = data.y;
      $scope.z = data.z;
    });
  };
});
