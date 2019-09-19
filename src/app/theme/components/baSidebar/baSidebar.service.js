(function() {
    'use strict';

    angular.module('LoginsightUiApp.theme.components')
        .provider('baSidebarService', baSidebarServiceProvider)


    /** @ngInject */
    function baSidebarServiceProvider() {
        var staticMenuItems = [];

        this.addStaticItem = function() {
            staticMenuItems.push.apply(staticMenuItems, arguments);
            // console.log(staticMenuItems);
        };

        /** @ngInject */
        this.$get = function($rootScope, $state, layoutSizes, Principal, RoleManagement) {
            return new _factory();

            function _factory() {
                var isMenuCollapsed = shouldMenuBeCollapsed();

                this.getMenuItems = function() {
                    // var states = defineMenuItemStates();  //NEW_ROLE 
                    return Principal.getAuthorityMenus().then(function(d) {
                        // console.log(d);
                        // return angular.fromJson(menu); 
                        $rootScope.$menuName = d.name;
                        $rootScope.$menuNameDesc = d.description;
                        // console.log(angular.fromJson(d.menuInfo));

                        


                        var menuJson = angular.fromJson(d.menuInfo);

                        // 按照id排序，需要支持id修改
                        menuJson = _.sortBy(menuJson, function(item) {
                            // 数字排序
                            return +item.id;
                        })

                        console.log('menuJson',menuJson);

                        return menuJson;
                    }).then(function(states) {
                        // console.log(111);
                        // console.log(states);
                        var menuItems = states.filter(function(item) {
                            // return item.level == 0;
                            return item.parent == '#';
                        });

                        menuItems.forEach(function(item) {
                            var children = states.filter(function(child) {
                                // return child.level == 1 && child.name.indexOf(item.name) === 0;
                                return child.parent != '#' && child.parent == item.id;
                            });
                            item.subMenu = children.length ? children : null;
                        });

                        console.log('menuItems',menuItems.concat(staticMenuItems));
                        console.log(JSON.stringify(menuItems.concat(staticMenuItems)));

                        return menuItems.concat(staticMenuItems);
                    });

                };

                this.shouldMenuBeCollapsed = shouldMenuBeCollapsed;
                this.canSidebarBeHidden = canSidebarBeHidden;

                this.setMenuCollapsed = function(isCollapsed) {
                    isMenuCollapsed = isCollapsed;
                };

                this.isMenuCollapsed = function() {
                    return isMenuCollapsed;
                };

                this.toggleMenuCollapsed = function() {
                    isMenuCollapsed = !isMenuCollapsed;
                };

                this.getAllStateRefsRecursive = function(item) {
                    var result = [];
                    _iterateSubItems(item);
                    return result;

                    function _iterateSubItems(currentItem) {
                        currentItem.subMenu && currentItem.subMenu.forEach(function(subItem) {
                            subItem.stateRef && result.push(subItem.stateRef);
                            _iterateSubItems(subItem);
                        });
                    }
                };

                function defineMenuItemStates() {
                    return [];

                    // var menus =[];
                    // return Principal.identity().then(function(account) { 
                    //     return account.authorities;
                    // }).then(function(roles){
                    //     console.log(roles);
                    //     _.forEach(roles,function(k){
                    //       console.log(k);
                    //       return Principal.getRoleMenus({'name':k}).then(function(v){
                    //          console.log(v);
                    //       }).catch(function(e){
                    //          console.log(e);
                    //          return null;
                    //       })
                    //     });
                    // }).then(function(){
                    //   return [];
                    // }); 

                    // return $state.get()
                    //     .filter(function(s) { 
                    //       return s.sidebarMeta;
                    //     })
                    //     .map(function(s) {
                    //       var meta = s.sidebarMeta; 
                    //       return {
                    //         name: s.name,
                    //         title: s.title,
                    //         level: (s.name.match(/\./g) || []).length,
                    //         order: meta.order,
                    //         icon: meta.icon,
                    //         stateRef: s.name,
                    //       };
                    //     })
                    //     .sort(function(a, b) {
                    //       return (a.level - b.level) * 100 + a.order - b.order;
                    //     });
                }

                function shouldMenuBeCollapsed() {
                    return window.innerWidth <= layoutSizes.resWidthCollapseSidebar;
                }

                function canSidebarBeHidden() {

                    return window.innerWidth <= layoutSizes.resWidthHideSidebar;
                }
            }

        };

    }
})();