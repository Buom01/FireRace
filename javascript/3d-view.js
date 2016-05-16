  var speedModifier = 1;
  //var exportMode = true;


  var scene = new THREE.Scene();
  //scene.fog = new THREE.FogExp2(0x2a2a2a, 0.0020);
  var LoadingManager = new THREE.LoadingManager();
  LoadingManager.onProgress = function (item, loaded, total) {
      loadedCallback();
  };
  LoadingManager.onError = function () {
      alert('Une erreur est survenue :/');
  };
  try {
      var renderer = new THREE.WebGLRenderer({
          antialias: true
      });
      renderer.shadowMap.enabled = true;
      renderer.shadowMapSoft = true;
      renderer.setSize(window.innerWidth, window.innerHeight - 50);
      var elem = renderer.domElement;
      elem.id = "animation";
      document.getElementById('index').appendChild(elem);

      var camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight - 50), 0.1, 10000);
      camera.position.z = 280;
      camera.position.y = 130;

      var controls = new THREE.OrbitControls(camera, elem);
      //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
      controls.enableDamping = true;
      controls.dampingFactor = 0.225;
      controls.enableZoom = true;
      controls.maxDistance = 800;
      controls.minDistance = 200;
      controls.enableKeys = false;
      controls.enablePan = false;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0;
      controls.target.y = 60;


      var AmbientLight = new THREE.AmbientLight(0x70707070); // soft white light
      scene.add(AmbientLight);
      var HemisphereLight = new THREE.HemisphereLight(0x70707070, 0x000000, 1);
      scene.add(HemisphereLight);
      var DirectionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
      DirectionalLight.position.x = 200;
      DirectionalLight.position.y = 300;
      DirectionalLight.position.z = 200;

      DirectionalLight.castShadow = true;

      DirectionalLight.shadow.mapSize.width = 1024;
      DirectionalLight.shadow.mapSize.height = 1024;

      var d = 200;

      DirectionalLight.shadow.camera.left = -d;
      DirectionalLight.shadow.camera.right = d;
      DirectionalLight.shadow.camera.top = d;
      DirectionalLight.shadow.camera.bottom = -d;

      DirectionalLight.shadow.camera.far = 1000;

      scene.add(DirectionalLight);

      //sky
      var loader = new THREE.CubeTextureLoader(LoadingManager);
      loader.setPath('assets/images/lmcity/');

      var textureCube = loader.load([
          'lmcity_ft.jpg', 'lmcity_bk.jpg',
          'lmcity_up.jpg', 'lmcity_dn.jpg',
          'lmcity_rt.jpg', 'lmcity_lf.jpg'
      ], function () {
          console.log("textureCube:ok");
          textureCubeSky = textureCube.clone();
          textureCubeSky.needsUpdate = true;
          textureCubeSky.mapping = THREE.CubeRefractionMapping;

          var skyboxMaterial = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              envMap: textureCubeSky,
              refractionRatio: 1,
              side: THREE.BackSide
          });
          var skyboxGeom = new THREE.CubeGeometry(5000 * 2, 5000 * 2, 5000 * 2, 1, 1, 1);
          skybox = new THREE.Mesh(skyboxGeom, skyboxMaterial);
          scene.add(skybox);
      });

      //Plan
      var geometry = new THREE.CircleGeometry(2500, 16);
      var material = new THREE.MeshPhongMaterial({
          color: 0x707070
      });

      var plane = new THREE.Mesh(geometry, material);
      plane.rotation.x = -(Math.PI / 2);
      plane.receiveShadow = true;
      scene.add(plane);

      //Informations
      var informations = [{
          text: "Carosserie faite par usinage, en polystyrene",
          position: {
              x: 90,
              y: 100,
              z: -80
          },
          pointTo: {
              x: 35,
              y: 85,
              z: -60
          },
          rotation: Math.PI/4*3,
          color: 0xff0000
      }, {
          text: "Roues et gentes faites par impression 3D",
          position: {
              x: -100,
              y: 60,
              z: 115
          },
          pointTo: {
              x: -50,
              y: 25,
              z: 115
          },
          rotation: -Math.PI / 4,
          color: 0xff0000
      }];



      var FontLoader = new THREE.FontLoader(LoadingManager);
      FontLoader.load('javascript/lib/threejs/helvetiker_bold.typeface.js', function (font) {
          console.log("font:ok");
          informations.forEach(function () {
              return function (data) {
                  //Ligne
                  var material = new THREE.LineBasicMaterial({
                      color: data.color
                  });

                  var lineGeometry = new THREE.Geometry();
                  lineGeometry.vertices.push(
                      new THREE.Vector3(data.pointTo.x, data.pointTo.y, data.pointTo.z),
                      new THREE.Vector3(data.position.x, data.position.y, data.position.z)
                  );
                  var line = new THREE.Line(lineGeometry, material);
                  line.castShadow = true;
                  scene.add(line);



                  //Text
                  var geometry = new THREE.TextGeometry(data.text, {
                      font: font,
                      size: 5,
                      height: 1.2,
                      curveSegments: 3,
                      bevelEnabled: false,
                      bevelThickness: 1,
                      bevelSize: 0.75
                  });
                  geometry.center();

                  textMesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
                      color: data.color,
                      shading: THREE.SmoothShading,
                      transparent: true,
                      opacity: 0.75
                  }));

                  textMesh.position.set(data.position.x, data.position.y + 3, data.position.z);
                  textMesh.rotation.set(0, data.rotation, 0);
                  textMesh.castShadow = true;
                  textMesh.receiveShadow = true;

                  scene.add(textMesh);

              };
          }(font));
      });


      //Car
      var loader = new THREE.ColladaLoader();

      loader.load(
          // resource URL
          'https://www.bastien-adam.tk/course-en-cours/voiture.dae',
          // Function when resource is loaded
          function (collada) {
              voiture = collada.scene;
              voiture.scale.x = voiture.scale.y = voiture.scale.z = 1000;
              voiture.rotation.x = -Math.PI / 2;
              voiture.position.z = 10;
              voiture.updateMatrix();
              voiture.children.forEach(function (data) {
                  data.children.forEach(function (mesh) {
                      mesh.receiveShadow = true;
                      mesh.castShadow = true;
                  });
              });
              roues = [];
              //avant
              roues.push(voiture.children[0].children[0]);
              roues.push(voiture.children[1].children[0]);
              roues.push(voiture.children[3].children[0]);
              roues.push(voiture.children[4].children[0]);
              //arrière
              roues.push(voiture.children[5].children[0]);
              roues.push(voiture.children[6].children[0]);
              roues.push(voiture.children[7].children[0]);
              roues.push(voiture.children[8].children[0]);

              carroserie = voiture.children[2].children[0];
              carroserie.material.color = {
                  r: 0.3,
                  g: 0.3,
                  b: 0.3
              };
              scene.add(voiture);
              loadedCallback();
          }
      );
      //Car audio

      var audioListener = new THREE.AudioListener();
      camera.add(audioListener);

      startSound = new THREE.Audio(audioListener);
      scene.add(startSound);

      loopSound = new THREE.Audio(audioListener);
      loopSound.setLoop(true);
      scene.add(loopSound);

      var loader = new THREE.AudioLoader(LoadingManager);

      loader.load(
          'https://www.bastien-adam.tk/course-en-cours/start.wav',
          function (audioBuffer) {
              startSound.setBuffer(audioBuffer);
              console.log("startSound:ok");
          }
      );
      loader.load(
          'https://www.bastien-adam.tk/course-en-cours/loop.wav',
          function (audioBuffer) {
              loopSound.setBuffer(audioBuffer);
              console.log("loopSound:ok");
          }
      );

      //renderer


      startRender = function () {
          carroserie.material.envMap = textureCube;
          carroserie.material.reflectivity = 0.3;

          roues.forEach(function (data) {
              data.material.envMap = textureCube;
              data.material.reflectivity = 0.4;
          });

          controls.autoRotateSpeed = rotateSpeed = 50 * speedModifier;
          clock = new THREE.Clock();
          startSound.play();
          loopSoundTimeout = window.setTimeout(function () {
              loopSound.play();
          }, 4033);
      };
      var rotateSpeed = false;
      var deltaTime = 0;
      render = function () {
          if (viewEnable === true) {
              if (typeof clock != "undefined") {
                  var deltaTime = clock.getDelta() * speedModifier;
              }
              controls.update();
              if (rotateSpeed) {
                  rotateSpeed -= 50 * speedModifier / 1.15 * deltaTime;
                  if (rotateSpeed <= 0.5 * speedModifier) {
                      controls.autoRotateSpeed = 0.5 * speedModifier;
                      rotateSpeed = false;
                  } else {
                      controls.autoRotateSpeed = rotateSpeed;
                  }
              }
              /*else if (exportMode && typeof endRotation == "undefined") {
                               endRotation = camera.rotation.y;
                               console.log(camera.rotation.y);
                               waitingCycle = false;
                           } else if(exportMode) {
                               if (!waitingCycle) {
                                   if (camera.rotation.y > endRotation) {
                                       waitingCycle = true;
                                   }
                               } else {
                                   if (camera.rotation.y < endRotation) {
                                       viewEnable = false;
                                       console.log("end at:" + camera.rotation.y);
                                       console.log("Wanted end:" + endRotation);
                                   }
                               }
                           }*/
              if (typeof carroserie != "undefined" && typeof clock != "undefined") {
                  var cycle = clock.getElapsedTime() * speedModifier;
                  carroserie.position.y = Math.sin(cycle * Math.PI * 12) / 6000;
                  roues.forEach(function (mesh) {
                      mesh.rotation.x = -cycle * Math.PI;
                  });
              }
              var volume = ((1000 - camera.position.distanceTo(controls.target)) / 1000) - 0.3;
              if (volume < 0) volume = 0;
              startSound.setVolume(volume);
              loopSound.setVolume(volume);

              renderer.render(scene, camera);
              requestAnimationFrame(render);
          }
      };
      window.onresize = function () {
          camera.aspect = window.innerWidth / (presentationMode ? window.innerHeight : (window.innerHeight - 50));
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, (presentationMode ? window.innerHeight : (window.innerHeight - 50)));
      };
  } catch (e) {
      console.log(e);
  }
