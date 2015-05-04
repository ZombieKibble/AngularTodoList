var TodoApp = angular.module("TodoApp", ["ngRoute", "ngResource", "ngAnimate"]).
    config(function ($routeProvider) {
        $routeProvider.
            when('/', { controller: ListCtrl, templateUrl: 'list.html' }).
            when('/new', { controller: CreateCtrl, templateUrl: 'details.html' }).
            when('/edit/:editId', { controller: EditCtrl, templateUrl: 'details.html' }).
            otherwise({ redirectTo: '/' });
    });

TodoApp.factory('Todo', function ($resource) {
    //Must add update: to do a put
    return $resource('/api/todo/:id', { id: '@id' }, { update: { method: 'PUT' } });
});

TodoApp.directive('sorted', function () {
    return {
        scope: true,
        transclude: true,
        template: '<a ng-click="do_sort()" ng-transclude></a>' +
        '<span ng-show="do_show(true)"><i class="glyphicon glyphicon-arrow-up"></i></span>' +
        '<span ng-show="do_show(false)"><i class="glyphicon glyphicon-arrow-down"></i></span>',
        controller: function ($scope, $element, $attrs) {
            $scope.sort = $attrs.sorted;

            $scope.do_sort = function () { $scope.sort_by($scope.sort); };
            $scope.do_show = function (asc) {
                return (asc != $scope.sort_desc) && ($scope.sort_order == $scope.sort);
            };
        }
    }
});

TodoApp.directive('formInput', function () {
    return {
        restrict: 'AE',
        compile: function (element, attrs) {
            var type = attrs.type || 'text';
            var required = attrs.hasOwnProperty('required') ? "required='required'" : "";
            var htmlText = '<div class="control-group" ng-class="{error: form.' + attrs.inputId + '.$invalid}">' +
                '<label class="control-label" for="' + attrs.inputId + '">' + attrs.label + '</label>' +
                    '<div class="controls">' +
                    '<input type="' + type + '" class="input-xlarge" ng-model="item.' + attrs.inputId + '" id="' + attrs.inputId + '" name="' + attrs.inputId + '" ' + required + '>' +
                    '</div>' +
                '</div>';
            element.replaceWith(htmlText);
        }
    }
});

var ListCtrl = function ($scope, $location, Todo) {
    $scope.search = function () {
        Todo.query({ q: $scope.query, limit: $scope.limit, offset: $scope.offset, sort: $scope.sort_order, desc: $scope.sort_desc },
            function (items) {
                var cnt = items.length;
                $scope.no_more = cnt < 20;
                $scope.items = $scope.items.concat(items);
            }
        );
    };

    $scope.reset = function () {
        $scope.offset = 0;
        $scope.items = [];
        $scope.search();
    };
    
    $scope.show_more = function () { return !$scope.no_more; };

    $scope.sort_by = function (ord) {
        if ($scope.sort_order == ord) { $scope.sort_desc = !$scope.sort_desc; }
        else { $scope.sort_desc = false; }
        $scope.sort_order = ord;
        $scope.reset();
    };

    $scope.do_show = function (asc, col) {
        return (asc != $scope.sort_desc) && ($scope.sort_order == col);
    };

    $scope.delete = function () {
        var id = this.item.Id;
        Todo.delete({ id: id }, function () {
            //Incorrect way to manage fade find better way using directive!
            $('#todo_' + id).fadeOut();
        });
    };

    $scope.sort_order = 'Priority';
    $scope.sort_desc = false;
    $scope.limit = 20;

    $scope.reset();
};

var CreateCtrl = function ($scope, $location, Todo) {
    $scope.action = "Add";
    $scope.save = function () {
        Todo.save($scope.item, function () {
            $location.path('/');
        });
    };
};

var EditCtrl = function ($scope, $location, $routeParams, Todo) {
    $scope.action = "Update";
    var id = $routeParams.editId;
    $scope.item = Todo.get({ id: id });

    $scope.save = function () {
        Todo.update({ id: id }, $scope.item, function () {
            $location.path('/');
        });
    };
};
