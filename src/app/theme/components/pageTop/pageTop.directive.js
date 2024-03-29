/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('LoginsightUiApp.theme.components')
      .directive('pageTop', pageTop);

  /** @ngInject */
  function pageTop() {
    return {
      restrict: 'E',
      controller: 'pageTopCtrl' ,
      controllerAs: 'vm',
      templateUrl: 'app/theme/components/pageTop/pageTop.html'
    };
  }

})();
