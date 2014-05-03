ostb.controller('IndexController', function($scope) {
})

.controller('Login', function($scope) {
  console.log('Login controller');
})

.controller('Dashboard', function($scope) {
  console.log('Dashboard');
})

.controller('Signup', function($scope) {
  console.log('Sign up');
})

.controller('Page', function($scope) {
  console.log('Page');
})

.controller('IndexContent', function($scope){
  $scope.indexContent = 'test';
})

.controller('EditorController', function($scope, $stateParams, ProjectsFactory) {
    var init = function() {
    var converter = new Showdown.converter();
    var view = document.getElementById('view');
    var editor = ace.edit("editor");
    editor.setReadOnly(true);
    editor.session.setUseWrapMode(true);
    editor.setShowPrintMargin(false);
    editor.resize(true);
      
    // var content;
    // ProjectsFactory.checkout({username: $stateParams.username, repo: $stateParams.repo})
    // .then(function(data) {
    //   // $scope.project = data;
    //   content = data;
    // })
    // .catch(function(err) {
    //   $scope.error = err;
    // });

    var connection = new sharejs.Connection('/channel');

    connection.open('', function(error, doc) {
      if (error) {
        console.error(error);
        return;
      }

      ProjectsFactory.checkout({username: $stateParams.username, repo: $stateParams.repo})
      .then(function(data) {

        console.log(doc);
        if(doc.getLength() === 0) {
          doc.insert(0, data);
        }

        doc.attach_ace(editor);
        editor.setReadOnly(false);
      })
      .catch(function(err) {
        $scope.error = err;
      });

      var render = function() {
        view.innerHTML = converter.makeHtml(doc.snapshot);
      };

      window.doc = doc;
      
      render();
      doc.on('change', render);

      editor.getSession().on('changeScrollTop',function(scroll){
        var lengthScroll = $('#right')[0].scrollHeight - $('#right').height();
        $('#right').scrollTop(scroll);
        // console.log('editor scroll hit', scroll);
      });
    });
  };
  init();

})


// ----- project CRUD controllers -----

.controller('VersionsController', function($scope, ProjectsFactory) {
  // $scope.modalShown = false;
  // $scope.toggleModal = function() {
  //   $scope.modalShown = !$scope.modalShown;
  // };

  // $scope.getVersions = function(project) {
  //   ProjectsFactory.getVersions(project)
  //   .then(function(data) {
  //     $scope.versions = data;
  //     console.log($scope.versions);
  //   })
  //   .catch(function(err) {
  //     $scope.error = err;
  //   });
  // };

  // $scope.versions = $scope.project.commits;
})

.controller('ProjectsController', function($scope, ProjectsFactory) {
  $scope.modalShown = false;
  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };

  $scope.createProject = function(project) {
    ProjectsFactory.create(project)
    .then(function() {
      console.log('success');
    })
    .catch(function(err) {
      $scope.error = err;
    });
  };

  $scope.cloneProject = function(project) {
    ProjectsFactory.clone(project)
    .then(function() {
      console.log('success');
    })
    .catch(function(err) {
      $scope.error = err;
    });
  };

  $scope.deleteProject = function(project) {
    ProjectsFactory.delete(project)
    .then(function() {
      console.log('success');
    })
    .catch(function(err) {
      $scope.error = err;
    });
  };

  $scope.commitProject = function(project) {
    var temp = project.commitBody;
    project.commitBody = {}
    project.commitBody['content.md'] = temp;

    ProjectsFactory.commit(project)
    .then(function() {
      console.log('success');
    })
    .catch(function(err) {
      $scope.error = err;
    });
  };
})

.controller('ProjectsListController', function($scope, $stateParams, ProjectsFactory) {  
  $scope.modalShown = false;
  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };

  ProjectsFactory.getProjects({username: $stateParams.username})
  .then(function(data) {
    $scope.projects = data;
  })
  .catch(function(err) {
    $scope.error = err;
  });
})

.controller('UsersController', function($scope, UsersFactory) {
  $scope.modalShown = false;
  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };

  $scope.createUser = function(user) {
    UsersFactory.create(user)
    .then(function() {
      console.log('success');
    })
    .catch(function(err) {
      $scope.error = err;
    });
  };

  $scope.deleteUser = function(user) {
    UsersFactory.delete(user)
    .then(function() {
      console.log('success');
    })
    .catch(function(err) {
      $scope.error = err;
    });
  };
})

//NOTE!! 'adrian' is hardcoded until auth/users complete! ///////////////////////////////
.controller('ProjectDetailController', function($scope, $stateParams, ProjectsFactory) {
  
  ProjectsFactory.getProjects({username: $stateParams.username, repo: $stateParams.repo})
  .then(function(data) {
    $scope.project = data[0];
  })
  .catch(function(err) {
    $scope.error = err;
  });

})






