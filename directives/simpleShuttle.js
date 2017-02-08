angular.module('cbShuttle', [])
    .directive('simpleShuttle', function(){
        return {
            restrict: 'A',
            template: '\
                <div class="cb-shuttle">\
                    <div class="col-xs-5">\
                        <div class="panel panel-default">\
                            <div class="panel-heading" ng-bind="leftTitle"></div>\
                            <div class="panel-body">\
                                <ul class="list-group">\
                                    <li class="list-group-item">\
                                        <input type="checkbox" ng-model="selectAll" ng-change="selectAllChange()">\
                                        <input type="text" class="cb-shuttle-form-controll" placeholder="{{ searchNamePlaceholder }}" ng-model="searchName">\
                                    </li>\
                                    <li class="list-group-item" ng-repeat="waitingSelectItem in waitingSelectList | filter:searchName | orderBy:\'id\'">\
                                        <input type="checkbox" ng-model="waitingSelectItem.selected">\
                                        <span>{{ waitingSelectItem.name }}</span>\
                                    </li>\
                                </ul>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-xs-2">\
                        <div class="cb-shuttle-middle">\
                            <a class="btn btn-primary" ng-click="transferAllWaitingToSelected()"><span class="glyphicon glyphicon-forward"></span></a>\
                            <a class="btn btn-primary" ng-click="transferSomeWaitingToSelected()"><span class="glyphicon glyphicon-chevron-right"></span></a>\
                            <a class="btn btn-primary" ng-click="transferSomeSelectedToWaiting()"><span class="glyphicon glyphicon-chevron-left"></span></a>\
                            <a class="btn btn-primary" ng-click="transferAllSelectedToWaiting()"><span class="glyphicon glyphicon-backward"></span></a>\
                        </div>\
                    </div>\
                    <div class="col-xs-5">\
                        <div class="panel panel-default">\
                            <div class="panel-heading" ng-bind="rightTitle"></div>\
                            <div class="panel-body">\
                                <ul class="list-group">\
                                    <li class="list-group-item" ng-repeat="selectedItem in selectedList | orderBy:\'id\'">\
                                        <input type="checkbox" ng-model="selectedItem.selected">\
                                        <span>{{ selectedItem.name }}</span>\
                                    </li>\
                                </ul>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            ',
            replace: true,
            scope: {
                leftTitle: '=leftTitle',
                rightTitle: '=rightTitle',
                waitingSelectList: '=waitingSelectList',
                selectedList: '=selectedList',
                searchNamePlaceholder: '=searchNamePlaceholder'
            },
            controller: function($scope, $filter){
                $scope.leftTitle = $scope.leftTitle === undefined ? '待选列表' : $scope.leftTitle;
                $scope.rightTitle = $scope.rightTitle === undefined ? '已选列表' : $scope.rightTitle;
                $scope.selectAll = false;
                $scope.selectAllChange = function(){
                    angular.forEach($filter('filter')($scope.waitingSelectList, $scope.searchName), function(searchItem, searchItemIndex){
                        searchItem.selected = $scope.selectAll;
                    });
                };
                $scope.transferAllWaitingToSelected = function(){
                    angular.forEach($scope.waitingSelectList, function(searchItem, searchItemIndex){
                        searchItem.selected = false;
                        this.push(searchItem);
                    }, $scope.selectedList);
                    $scope.waitingSelectList = [];
                };
                $scope.transferSomeWaitingToSelected = function(){
                    $scope.selectAll = false;
                    var transferIndexList = [];
                    angular.forEach($scope.waitingSelectList, function(searchItem, searchItemIndex){
                        if(searchItem.selected){
                            searchItem.selected = false;
                            this.push(searchItem);
                            transferIndexList.push(searchItemIndex);
                        }
                    }, $scope.selectedList);
                    for(var i = 0; i < transferIndexList.length; i++){
                        $scope.waitingSelectList.splice(transferIndexList[i] - i, 1);
                    }
                };
                $scope.transferSomeSelectedToWaiting = function(){
                    $scope.selectAll = false;
                    var transferIndexList = [];
                    angular.forEach($scope.selectedList, function(searchItem, searchItemIndex){
                        if(searchItem.selected){
                            searchItem.selected = false;
                            this.push(searchItem);
                            transferIndexList.push(searchItemIndex);
                        }
                    }, $scope.waitingSelectList);
                    for(var i = 0; i < transferIndexList.length; i++){
                        $scope.selectedList.splice(transferIndexList[i] - i, 1);
                    }
                };
                $scope.transferAllSelectedToWaiting = function(){
                    angular.forEach($scope.selectedList, function(searchItem, searchItemIndex){
                        searchItem.selected = false;
                        this.push(searchItem);
                    }, $scope.waitingSelectList);
                    $scope.selectedList = [];
                };
            },
            link: function(scope, iElement, iAttrs){

            }
        };
    });