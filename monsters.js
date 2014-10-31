angular.module('halloweenApp',[])
    .controller('Halloween',['$scope','monsterService', function($scope,monsterService){

        $scope.monsters = [];


            monsterService.getMonsters().then(function(result){
                $scope.monsters = result.data.monsters;
            });


        $scope.deleteMonster = function(characteristic, result){
            angular.forEach($scope.monsters, function(monster){
                if(!(monster[characteristic] === result)){
                    monster.dead = true;
                }
            })
        };

        $scope.monsterQuestions = [
            {id:1, nextTrue: 2, nextFalse:10, question:"Are you living?",characteristic:"living"},
            {id:2, nextTrue: 3, nextFalse:7, question:"Are you part animal?", characteristic:"animal"},
            {id:3, nextTrue: 4, nextFalse:6, question:"Do you have serpentine features?", characteristic:"serpentine"},
            {id:4,nextFalse:5, question:"If I look at you will I turn to stone?", characteristic:"turntostone"},
            {id:5, nextFalse:6, question:"Are you Mongolian?", characteristic:"mongolian"},
            {id:6, question:"Can you fly?", characteristic:"fly"},
            {id:7, nextTrue: 8, nextFalse:9,  question:"Are you extra terrestrial?", characteristic:"alien"},
            {id:8,  question:"Do you have a physical body?", characteristic:"physicalbody"},
            {id:9,  question:"Are you a spellcaster?", characteristic:"spellcaster"},
            {id:10, nextTrue: 11, nextFalse:12, question:"Do you have magical powers?",characteristic:"spellcaster"},
            {id:11, question:"Do you have a master?",characteristic:"master"},
            {id:12, nextFalse:13, question:"Do you suck blood?",characteristic:"bloodsucker"},
            {id:13, question:"Were you reanimated?",characteristic:"reanimated"}
        ];


    }])
    .service('monsterService',['$http',function($http){
        var getMonsters = function() {
            return $http.get('monsters.json')
        };

        return{
            getMonsters:getMonsters
        }
    }])
    .filter('capitalizeFirstLetter', function() {
        return function (input) {
            if ( typeof input !== 'undefined' && input!==null) {
                return input.substring(0, 1).toUpperCase() + input.substring(1);
            }
        };
    })
    .directive('questions', function(){
        return {
            restrict: 'E',
            templateUrl: 'question.part.html',
            scope: {
                questionlist: '=',
                resultCallback:'&'
            },
            link: function(scope,element, attrs){
                function findById(source, id) {
                    for (var i = 0; i < source.length; i++) {
                        if (source[i].id === id) {
                            return source[i];
                        }
                    }
                    return null;
                }
                scope.current = scope.questionlist[0];

                scope.answer = function(characteristic, result){
                    scope.resultCallback({characteristic:characteristic ,result: result});
                    var nextQuestionId = result ? scope.current.nextTrue : scope.current.nextFalse;
                    scope.current =findById(scope.questionlist, nextQuestionId);
                }
            }
        };
    });


