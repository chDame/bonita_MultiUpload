function PbMultiUploadCtrl($scope, $sce, $element, widgetNameFactory, $timeout, $log, gettextCatalog) {
  var ctrl = this;
  this.name = widgetNameFactory.getName('pbInput');
  this.filename = '';
  this.filemodel = '';
  this.clear = clear;
  this.startUploading = startUploading;
  this.uploadError = uploadError;
  this.uploadComplete = uploadComplete;

  this.name = widgetNameFactory.getName('pbMultiUpload');

    this.accept='';
    if ($scope.properties.accept && $scope.properties.accept!=='') {
        this.accept = $scope.properties.accept;
    }

  this.preventFocus = function($event) {
    $event.target.blur();
  };

  this.submitForm = function() {
    var form = $element.find('form');
    form.triggerHandler('submit');
    form[0].submit();
  };

  this.forceSubmit = function(event) {
        
    if(!event.target.value) {
         $scope.properties.errorContent = null;
      return;
      
    }
    for(let i=0;i<event.target.files.length;i++) {
        if ($scope.properties.accept.toLowerCase().indexOf(event.target.files[i].type.toLowerCase())<0) {
             $scope.properties.errorContent = event.target.files[i].name+' has a wrong format';
             $scope.$apply();
            console.log(this.error);
            return;
        }
    }
    
     $scope.properties.errorContent = null;
    ctrl.submitForm();
    event.target.value = null;
  };

  var input = $element.find('input');
  input.on('change', ctrl.forceSubmit);
  
    if ($scope.properties.multi) {
       input.attr('multiple', 'multiple');
    }
  $scope.$on('$destroy', function() {
    input.off('change', ctrl.forceSubmit);
  });

  $scope.$watch('properties.url', function(newUrl, oldUrl){
    ctrl.url = $sce.trustAsResourceUrl(newUrl);
    if (newUrl === undefined) {
      $log.warn('you need to define a url for pbMultiUpload');
    }
  });

  //the filename displayed is not bound to the value as a bidirectionnal
  //bond, thus, in case the value is updated, it is not reflected
  //to the filename (example with the BS-14498)
  //we watch the value to update the filename and the upload widget state
  $scope.$watch(function(){return $scope.properties.value;}, function(newValue){
    if (newValue && newValue.filename) {
      ctrl.filemodel = true;
      ctrl.filename = newValue.filename;
    } else if (newValue && Array.isArray(newValue)) {
      ctrl.filemodel = true;
      ctrl.filename = newValue[0].filename;
      for(let ifiles=1;ifiles<newValue.length;ifiles++) {
          ctrl.filename += ', '+newValue[ifiles].filename;
      }
    }  else if (!angular.isDefined(newValue)) {
      delete ctrl.filemodel;
      delete ctrl.filename;
    }
  });

  if (!$scope.properties.isBound('value')) {
    $log.error('the pbMultiUpload property named "value" need to be bound to a variable');
  }
  
  function clear() {
    ctrl.filename = '';
    ctrl.filemodel = '';
    $scope.properties.value = {};
  }
  
   this.remove = function(idx) {
      console.log(idx);
       $scope.properties.value.splice(idx, 1);
  }

  function uploadError(error) {
    $log.warn('upload fails too', error);
    ctrl.filemodel = '';
    ctrl.filename = gettextCatalog.getString('Upload failed');
  }

  function startUploading() {
    ctrl.filemodel = '';
    ctrl.filename  = gettextCatalog.getString('Uploading...');
  }

  function uploadComplete(response) {
    //when the upload widget return a String, it means an error has occurred (with a html document as a response)
    //if it's not a string, we test if it contains some error message
    console.log(response);
    if(angular.isString(response) || (response && response.type && response.message)){
      $log.warn('upload failed');
      ctrl.filemodel = '';
      ctrl.filename = gettextCatalog.getString('Upload failed');
      $scope.properties.errorContent = angular.isString(response) ? response : response.message;
      return;
    }
    $scope.properties.value = response;
  }
}