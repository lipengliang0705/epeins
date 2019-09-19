(function() {
    'use strict';

    angular
        .module('LoginsightUiApp.page.category')
        .controller('CategoryDialogController', CategoryDialogController);

    CategoryDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'tagList', 'Tag', 'Category', 'EventRule', 'AgentRule', 'toastr'];

    function CategoryDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, tagList, Tag, Category, EventRule, AgentRule, toastr) {
        var vm = this;

        vm.category = entity;
        vm.clear = clear; 
        vm.save = save;
        vm.eventrules = EventRule.query();
        vm.agentrules = AgentRule.query();

        vm.addTagBtn = addTagBtn;
        vm.rmTagBtn = rmTagBtn;

        vm.tagsList = tagList;
        vm.tagInit = vm.category.id!=null?true:false;
        getTagList();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });


        function save () {
            vm.isSaving = true; 
            // console.log(vm.category); 
            vm.category.tags = []; 
            _.forEach(vm.tagNames, function(k){
                var flag = _.find(vm.tagsList, {'name': k});
                if(flag)vm.category.tags.push(flag);
            });                
            // console.log(vm.tagNames, vm.category.tags);
            // console.log(vm.category);
            if (vm.category.id !== null) {
                Category.update(vm.category, onSaveSuccess, onSaveError);
            } else {
                Category.save(vm.category, onSaveSuccess, onSaveError);
            }
        }
               
        function onSaveSuccess (result) {
            $scope.$emit('LoginsightUiApp.page.category:categoryUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError (e) {
            console.log(e);
            vm.isSaving = false;            
            if(e.status==500 && e.data.detail.indexOf("_UNIQUE ERROR")>-1){ 
                if(e.data.detail=='ALIAS_UNIQUE ERROR')toastr.error('','业务缩写已存在，请重新输入！');
                if(e.data.detail=='NAME_UNIQUE ERROR')toastr.error('','名称已存在，请重新输入！');
            }  
        } 

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }
        
        function addTagBtn(d){
            console.log('vm.addTagBtn', d);
            $("#tagsinput").tagsinput('add', d.name );    
        }

        function rmTagBtn(d){
            console.log('vm.rmTagBtn', d);
            var flag = _.indexOf(vm.tagNames, d.name);
            // console.log(flag, d.name, vm.tagNames);
            if(flag>-1) {
                toastr.error('','已关联该标签，删除标签失败！');
            }else{
                deleteTags(d.id);
            }
        }  
        
        function getTagList(){            
            Tag.getTagsAlias({name : 'category'},function(d){ 
                vm.tagsList = d;  
            },function(e){console.log('error',e);});
        }

        function saveTags(){
            var items = $("#tagsinput").tagsinput('items');
            _.forEach(items, function(name){                
                var bean = {'name': name, 'alias': 'category'};              
                var flag = _.find(vm.tagsList, {'name':name});
                // console.log(bean, flag, vm.tagsList);
                if(!flag){
                    Tag.save(bean, onSuccess, onError);
                }
            });
            function onSuccess (result) {  
                getTagList(); 
            }
            function onError (e) {
                console.log(e);
            }
        }
        function deleteTags(id){
            if(id){
                Tag.delete({id: id}, onSuccess, onError);
            }
            function onSuccess (result) { 
                console.log('deleteTags', result); 
                getTagList(); 
            }
            function onError (e) {
                console.log(e);
                toastr.error('','已关联该标签，删除标签失败！');
            }
        }

        function loadTag(){
            _.forEach(vm.category.tags,function(d){
                console.log(d,d.name);          
                $("#tagsinput").tagsinput('add', d.name );   
            }); 
        }

        $scope.$watch("vm.tagsinput", function (newValue, oldValue) {
            console.log(newValue, oldValue);   
            vm.tagNames = $("#tagsinput").tagsinput('items'); 
            console.log(vm.tagInit , vm.tagNames);
            if(vm.tagInit && vm.category.tags){
                vm.tagInit = false;
                loadTag();
            }else if(!vm.tagInit && vm.tagNames.length>0){
                saveTags();
            }
        });

 
    }
})();
