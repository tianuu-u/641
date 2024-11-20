let audio = null;

// 在文档加载时添加过渡层
document.addEventListener("DOMContentLoaded", () => {
  // 添加白色过渡层
  const transitionOverlay = document.createElement('div');
  transitionOverlay.className = 'transition-overlay';
  transitionOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    opacity: 0;
    pointer-events: none;
    z-index: 1003;
    transition: opacity 0.3s ease;
  `;
  document.body.appendChild(transitionOverlay);

  audio = new Audio("music/bgMusic.mp3");
  audio.preload = "auto";
  
  // 预加载主图片
  const mainImg = document.querySelector(".lydia-dp");
  if (mainImg) {
    const tempImg = new Image();
    tempImg.src = mainImg.src;
  }
  
  const startButton = document.querySelector("#startButton");
  if (startButton) {
    startButton.addEventListener("click", () => {
      const userName = document.getElementById("userName").value;
      const pwd = document.getElementById("pwd").value;
      
      if(userName == "刘思雨" && pwd == "1121") {
        const loginPage = document.querySelector(".login-page");
        const videoContainer = document.querySelector(".video-container");
        const container = document.querySelector(".container");
        const introVideo = document.getElementById("introVideo");
        
        // 淡出登录页面
        loginPage.classList.add("hidden");
        
        // 创建相机页面容器
        const cameraPageContainer = document.createElement('div');
        cameraPageContainer.className = 'camera-page';
        cameraPageContainer.innerHTML = `
          <div class="gallery"></div>
          <div class="camera">
            <div class="flash"></div>
            <div class="lens"></div>
            <div class="picture"></div>
            <div class="btn-guide"></div>
            <button class="shutter-btn"></button>
          </div>
          <audio id="shutterSound" src="music/shutter.mp3"></audio>
          <button class="continue-btn">路上风大，裹好你的被子。坐稳了，我们要乘船去那边的梦乡了➡️</button>
        `;
        
        document.body.appendChild(cameraPageContainer);
        
        // 添加相机功能
        initializeCamera();
        
        // 添加继续按钮样式和事件
        const continueBtn = cameraPageContainer.querySelector('.continue-btn');
        continueBtn.style.cssText = `
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          padding: 15px 30px;
          font-size: 1.2rem;
          background: linear-gradient(45deg, #ff69b4, #ff92a5);
          color: white;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        `;
        
        continueBtn.addEventListener('click', () => {
          // 淡出相机页面
          cameraPageContainer.style.opacity = '0';
          setTimeout(() => {
            cameraPageContainer.remove();
            // 显示视频容器
            videoContainer.style.display = "flex";
            requestAnimationFrame(() => {
              videoContainer.classList.add("visible");
              introVideo.play();
              
              // 监听视频播放结束
              introVideo.addEventListener("ended", () => {
                // 1. 预加载所有图片
                const preloadImages = () => {
                  return new Promise((resolve) => {
                    const images = [
                      'img/lydia2.png',
                      'img/hat.svg',
                      'img/ballon1.svg',
                      'img/ballon2.svg',
                      'img/ballon3.svg'
                    ];
                    
                    let loadedImages = 0;
                    images.forEach(src => {
                      const img = new Image();
                      img.onload = () => {
                        loadedImages++;
                        if (loadedImages === images.length) {
                          resolve();
                        }
                      };
                      img.src = src;
                    });
                  });
                };

                // 2. 等待图片预加载完成后再进行切换
                preloadImages().then(() => {
                  // 3. 准备主容器但保持隐藏
                  container.style.visibility = "hidden";
                  container.style.display = "block";
                  
                  // 4. 先加载文字内容
                  fetch("customize.json")
                    .then(data => data.json())
                    .then(data => {
                      // 5. 设置所有文字内容
                      Object.keys(data).forEach(customData => {
                        if (data[customData] !== "") {
                          if (customData === "imagePath") {
                            document.querySelector(`[data-node-name*="${customData}"]`).setAttribute("src", data[customData]);
                          } else {
                            document.querySelector(`[data-node-name*="${customData}"]`).innerText = data[customData];
                          }
                        }
                      });
                      
                      // 6. 在下一帧切换显示
                      requestAnimationFrame(() => {
                        // 隐藏视频
                        videoContainer.style.display = "none";
                        
                        // 显示主容器
                        container.style.visibility = "visible";
                        container.style.opacity = "1";
                        container.classList.add("visible");
                        
                        // 开始动画
                        animationTimeline();
                      });
                    });
                });
              });
            });
          }, 500);
        });
      } else {
        alert("不对哦，请重新输入吧（本宝的生日哦）!");
      }
    });
  }
  
  // 配置视频播放
  if (introVideo) {
    // 禁用视频控件，使用内嵌播放
    introVideo.controls = false;
    introVideo.playsInline = true;
    introVideo.webkitPlaysInline = true;
    
    // 处理视频播放错误
    introVideo.addEventListener('error', (e) => {
      console.error('视频播放错误:', e);
      // 如果视频加载失败，直接跳转到主内容
      showMainContent();
    });
  }

  // 开心主题页面逻辑
  const yesButton = document.getElementById("yesButton");
  const noButton = document.getElementById("noButton");
  const happyPage = document.querySelector(".confession-page");
  const loginPage = document.querySelector(".login-page");

  if (yesButton && noButton) {
    yesButton.addEventListener("click", () => {
      // 显示开心消息
      showSuccessMessages(() => {
        // 消息显示完后，切换到登录页面
        happyPage.style.display = "none";
        loginPage.style.display = "flex";
      });
    });

    noButton.addEventListener("mouseenter", () => {
      // 获取按钮可移动的范围
      const maxX = window.innerWidth - noButton.offsetWidth;
      const maxY = window.innerHeight - noButton.offsetHeight;
      
      // 随机生成新位置
      const newX = Math.random() * maxX;
      const newY = Math.random() * maxY;
      
      // 移动按钮
      noButton.style.position = "fixed";
      noButton.style.left = newX + "px";
      noButton.style.top = newY + "px";
    });
  }

  // 改点击烟花效果，让它在所有页面都能显示
  document.addEventListener('click', (evt) => {
    // 获取所有可能的页面容器
    const confessionPage = document.querySelector('.confession-page');
    const loginPage = document.querySelector('.login-page');
    const videoContainer = document.querySelector('.video-container');
    const container = document.querySelector('.container');
    const deskContainer = document.querySelector('.desk-container');
    
    // 检查当前显示的是哪个页面
    const isConfessionVisible = confessionPage && confessionPage.style.display !== 'none';
    const isLoginVisible = loginPage && loginPage.style.display !== 'none';
    const isVideoVisible = videoContainer && videoContainer.style.display !== 'none';
    const isMainVisible = container && container.style.display !== 'none' && container.style.opacity !== '0';
    const isDeskVisible = deskContainer && deskContainer.style.display !== 'none';
    
    // 如果任何一个页面是可见的，就显示烟花效果
    // 排除点击按钮的情况
    const isButton = evt.target.tagName.toLowerCase() === 'button';
    const isInput = evt.target.tagName.toLowerCase() === 'input';
    
    if ((isConfessionVisible || isLoginVisible || isVideoVisible || isMainVisible || isDeskVisible) && 
        !isButton && !isInput) {
      createFirework(evt.clientX, evt.clientY);
    }
  });

  // 创建抽屉音效和生日歌音频元素
  const drawerSound = new Audio("music/drawer-open.mp3");
  const birthdaySong = new Audio("music/happy.mp3");
  drawerSound.preload = "auto";
  birthdaySong.preload = "auto";

  // 创建玫瑰花雨容器
  const roseRainContainer = document.createElement('div');
  roseRainContainer.className = 'rose-rain';
  roseRainContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1001;
    display: none;
  `;
  document.body.appendChild(roseRainContainer);

  // 创建暗色遮罩
  const overlay = document.createElement('div');
  overlay.className = 'dark-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 1s ease;
    pointer-events: none;
    z-index: 1000;
  `;
  document.body.appendChild(overlay);

  // 创建玫瑰花
  function createRose() {
    const rose = document.createElement('div');
    rose.className = 'falling-rose';
    rose.style.cssText = `
      position: absolute;
      width: 30px;
      height: 30px;
      background: url('img/rose.png') no-repeat center/contain;
      left: ${Math.random() * 100}vw;
      top: -30px;
      animation: falling ${Math.random() * 3 + 2}s linear infinite;
      opacity: 0.8;
    `;
    roseRainContainer.appendChild(rose);

    // 动画结束后移除玫瑰花元素
    rose.addEventListener('animationend', () => {
      rose.remove();
    });
  }

  // 监听所有抽屉的打开事件
  document.querySelectorAll('.chest-drawer details').forEach(drawer => {
    drawer.addEventListener('toggle', () => {
      if (drawer.open) {
        // 每次打开抽屉时播放音效
        drawerSound.currentTime = 0;
        drawerSound.play();

        // 如果是最后一个抽屉，播放生日歌并开始特效
        if (drawer.parentElement.classList.contains('chest-drawer--bottom')) {
          // 显示遮罩
          overlay.style.opacity = '1';
          
          // 显示玫瑰花雨容器
          roseRainContainer.style.display = 'block';
          
          // 开始持续创建玫瑰花
          const roseInterval = setInterval(createRose, 200); // 每200ms创建一朵玫瑰花

          // 等抽屉音效播放完再播放生日歌
          setTimeout(() => {
            birthdaySong.play();
          }, 1000);

          // 监听生日歌播放结束
          birthdaySong.addEventListener('ended', () => {
            // 停止创建玫瑰花
            clearInterval(roseInterval);
            // 淡出遮罩
            overlay.style.opacity = '0';
            // 延迟后清除玫瑰花容器
            setTimeout(() => {
              roseRainContainer.style.display = 'none';
              roseRainContainer.innerHTML = '';
            }, 3000); // 给最后的玫瑰花3秒时间完成动画
          });
        }
      }
    });
  });

  // 添加玫瑰花下落动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes falling {
      0% {
        transform: translateY(0) rotate(0deg);
      }
      100% {
        transform: translateY(100vh) rotate(720deg);
      }
    }
    .falling-rose {
      will-change: transform;
    }
  `;
  document.head.appendChild(style);
});

// 添加一个函数用于直接显示主内容
function showMainContent() {
  const videoContainer = document.querySelector(".video-container");
  const container = document.querySelector(".container");
  
  if (videoContainer) {
    videoContainer.style.display = "none";
  }
  
  if (container) {
    container.style.visibility = "visible";
    container.style.opacity = "1";
    container.classList.add("visible");
    animationTimeline();
  }
}

// 音乐播放控制
const playPauseButton = document.getElementById('playPauseButton');
let isPlaying = false;

playPauseButton.addEventListener('click', () => {
  isPlaying = !isPlaying;
  if (isPlaying) {
    audio.play();
    playPauseButton.classList.add('playing');
  } else {
    audio.pause();
    playPauseButton.classList.remove('playing');
  }
});

// 数据加载函数
const fetchData = () => {
  fetch("customize.json")
    .then(data => data.json())
    .then(data => {
      const dataArr = Object.keys(data);
      dataArr.forEach((customData, index) => {
        if (data[customData] !== "") {
          if (customData === "imagePath") {
            const targetImg = document.querySelector(`[data-node-name*="${customData}"]`);
            if (targetImg) {
              targetImg.setAttribute("src", data[customData]);
            }
          } else {
            const element = document.querySelector(`[data-node-name*="${customData}"]`);
            if (element) {
              element.innerText = data[customData];
            }
          }
        }
        
        if (index === dataArr.length - 1) {
          // 直接开始动画，移除延迟
          animationTimeline();
        }
      });
    })
    .catch(error => {
      console.error("Error loading customize.json:", error);
    });
};

// 动画时间线
const animationTimeline = () => {
  const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0];
  const hbd = document.getElementsByClassName("wish-hbd")[0];

  textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML
    .split("")
    .join("</span><span>")}</span`;

  hbd.innerHTML = `<span>${hbd.innerHTML
    .split("")
    .join("</span><span>")}</span`;

  const ideaTextTrans = {
    opacity: 0,
    y: -20,
    rotationX: 5,
    skewX: "15deg"
  };

  const ideaTextTransLeave = {
    opacity: 0,
    y: 20,
    rotationY: 5,
    skewX: "-15deg"
  };

  const tl = new TimelineMax();

  tl
    .to(".container", 0.1, {
      visibility: "visible",
      opacity: 1
    })
    .from(".one", 0.7, {
      opacity: 0,
      y: 10
    })
    .from(".two", 0.4, {
      opacity: 0,
      y: 10
    })
    .to(".one", 0.7, {
      opacity: 0,
      y: 10
    }, "+=2.5")
    .to(".two", 0.7, {
      opacity: 0,
      y: 10
    }, "-=1")
    .from(".three", 0.7, {
      opacity: 0,
      y: 10
    })
    .to(".three", 0.7, {
      opacity: 0,
      y: 10
    }, "+=2")
    .from(".four", 0.7, {
      scale: 0.2,
      opacity: 0
    })
    .from(".fake-btn", 0.3, {
      scale: 0.2,
      opacity: 0
    })
    .staggerTo(".hbd-chatbox span", 0.5, {
      visibility: "visible"
    }, 0.05)
    .to(".fake-btn", 0.1, {
      backgroundColor: "#8FE3B6"
    })
    .to(".four", 0.5, {
      scale: 0.2,
      opacity: 0,
      y: -150
    }, "+=0.7")
    .from(".idea-1", 0.7, ideaTextTrans)
    .to(".idea-1", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-2", 0.7, ideaTextTrans)
    .to(".idea-2", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-3", 0.7, ideaTextTrans)
    .to(".idea-3 strong", 0.5, {
      scale: 1.2,
      x: 10,
      backgroundColor: "rgb(21, 161, 237)",
      color: "#fff"
    })
    .to(".idea-3", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-4", 0.7, ideaTextTrans)
    .to(".idea-4", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-5", 0.7, {
      rotationX: 15,
      rotationZ: -10,
      skewY: "-5deg",
      y: 50,
      z: 10,
      opacity: 0
    }, "+=0.5")
    .to(".idea-5 .smiley", 0.7, {
      rotation: 90,
      x: 8
    }, "+=0.4")
    .to(".idea-5", 0.7, {
      scale: 0.2,
      opacity: 0
    }, "+=2")
    .staggerFrom(".idea-6 span", 0.8, {
      scale: 3,
      opacity: 0,
      rotation: 15,
      ease: Expo.easeOut
    }, 0.2)
    .staggerTo(".idea-6 span", 0.8, {
      scale: 3,
      opacity: 0,
      rotation: -15,
      ease: Expo.easeOut
    }, 0.2, "+=1")
    .staggerFromTo(".baloons img", 2.5, {
      opacity: 0.9,
      y: 1400
    }, {
      opacity: 1,
      y: -1000
    }, 0.2)
    .from(".lydia-dp", 0.5, {
      scale: 3.5,
      opacity: 0,
      x: 25,
      y: -25,
      rotationZ: -45
    }, "-=2")
    .from(".hat", 0.5, {
      x: -100,
      y: 350,
      rotation: -180,
      opacity: 0
    })
    .staggerFrom(".wish-hbd span", 0.7, {
      opacity: 0,
      y: -50,
      rotation: 150,
      skewX: "30deg",
      ease: Elastic.easeOut.config(1, 0.5)
    }, 0.1)
    .staggerFromTo(".wish-hbd span", 0.7, {
      scale: 1.4,
      rotationY: 150
    }, {
      scale: 1,
      rotationY: 0,
      color: "#ff69b4",
      ease: Expo.easeOut
    }, 0.1, "party")
    .from(".wish h5", 0.5, {
      opacity: 0,
      y: 10,
      skewX: "-15deg"
    }, "party")
    .staggerTo(".eight svg", 1.5, {
      visibility: "visible",
      opacity: 0,
      scale: 80,
      repeat: 3,
      repeatDelay: 1.4
    }, 0.3)
    .to(".six", 0.5, {
      opacity: 0,
      y: 30,
      zIndex: "-1"
    })
    .staggerFrom(".nine p", 1, ideaTextTrans, 1.2)
    .to(".last-smile", 0.5, {
      rotation: 90
    }, "+=1")
    .to(".container", 0.5, {
      opacity: 0,
      onComplete: () => {
        // 隐藏 container
        document.querySelector('.container').style.display = 'none';
        // 显示柜子
        const deskContainer = document.querySelector('.desk-container');
        deskContainer.style.display = 'flex';
        
        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 30px;
            opacity: 0;
            transition: all 0.5s ease;
        `;
        
        // 创建海洋按钮
        const oceanBtn = document.createElement('button');
        oceanBtn.id = 'oceanButton';
        oceanBtn.innerHTML = '🌊<br>送给你大海的声音';
        oceanBtn.style.cssText = `
            padding: 15px 30px;
            font-size: 1.2rem;
            background: linear-gradient(135deg, #1c92d2, #0575E6);
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;
        
        // 创建世界电台按钮
        const radioBtn = document.createElement('button');
        radioBtn.id = 'radioButton';
        radioBtn.innerHTML = '🌍<br>送给你世界的声音';
        radioBtn.style.cssText = `
            padding: 15px 30px;
            font-size: 1.2rem;
            background: linear-gradient(135deg, #11998e, #38ef7d);
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;
        
        // 新增的两个按钮
        const worldBtn = document.createElement('button');
        worldBtn.id = 'worldButton';
        worldBtn.innerHTML = '🏔️<br>陪你看广阔的世界';
        worldBtn.style.cssText = `
            padding: 15px 30px;
            font-size: 1.2rem;
            background: linear-gradient(135deg, #FF9A8B, #FF6A88);
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        const pandaBtn = document.createElement('button');
        pandaBtn.id = 'pandaButton';
        pandaBtn.innerHTML = '🐼<br>陪你看可爱的熊猫';
        pandaBtn.style.cssText = `
            padding: 15px 30px;
            font-size: 1.2rem;
            background: linear-gradient(135deg, #96E6A1, #D4FC79);
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        // 新增的 Drive and Listen 按钮
        const driveBtn = document.createElement('button');
        driveBtn.id = 'driveButton';
        driveBtn.innerHTML = '🚗<br>陪你听城市的声音';
        driveBtn.style.cssText = `
            padding: 15px 30px;
            font-size: 1.2rem;
            background: linear-gradient(135deg, #fbc2eb, #a6c1ee);
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        // 添加点击事件
        oceanBtn.addEventListener('click', () => {
            window.location.href = 'https://virtocean.com/';
        });

        radioBtn.addEventListener('click', () => {
            window.location.href = 'https://radio.garden/visit/naarden/Hww81noL';
        });

        worldBtn.addEventListener('click', () => {
            window.location.href = 'https://www.zhijianshang.com/';
        });

        pandaBtn.addEventListener('click', () => {
            window.location.href = 'https://www.ipanda.com/';
        });

        driveBtn.addEventListener('click', () => {
            window.location.href = 'https://driveandlisten.herokuapp.com/';
        });

        // 将所有按钮添加到容器
        buttonContainer.appendChild(oceanBtn);
        buttonContainer.appendChild(radioBtn);
        buttonContainer.appendChild(worldBtn);
        buttonContainer.appendChild(pandaBtn);
        buttonContainer.appendChild(driveBtn);
        deskContainer.appendChild(buttonContainer);
        
        // 监听第三个抽屉的打开事件
        const bottomDrawer = document.querySelector('.chest-drawer--bottom details');
        bottomDrawer.addEventListener('toggle', () => {
            if (bottomDrawer.open) {
                // 当第三个抽屉打开时，显示按钮
                setTimeout(() => {
                    buttonContainer.style.opacity = '1';
                    buttonContainer.style.transform = 'translateX(-50%) translateY(0)';
                }, 500);
            }
        });
        
        // 添加柜子动画
        TweenMax.from('.chest', 1, {
            scale: 0,
            opacity: 0,
            ease: Elastic.easeOut.config(1, 0.75)
        });
      }
    }, "+=0.5");

  // 重播按钮
  const replayBtn = document.getElementById("replay");
  replayBtn.addEventListener("click", () => {
    // 先隐藏柜子
    document.querySelector('.desk-container').style.display = 'none';
    // 重置 container
    const container = document.querySelector('.container');
    container.style.display = 'block';
    container.style.visibility = 'visible';
    container.style.opacity = '1';
    // 重启动画
    tl.restart();
  });
};

// 修改显示息的函数
function showSuccessMessages(callback) {
  const messages = [
    "太棒啦！开心就要继续保持哦~",
    "开心的时候整个世界都是美好的呢！",
    "🌟你一定笑了吧🌟",
    "多吃健康食物，保持运动",
    "不然虫虫会在嘴里筑城堡~"
  ];

  let index = 0;
  
  function showNext() {
    if (index < messages.length) {
      alert(messages[index]);
      index++;
      setTimeout(showNext, 500);
    } else {
      callback();
    }
  }

  showNext();
}

// 添加相机初始化函数
function initializeCamera() {
  const camera = document.querySelector('.camera');
  const shutterBtn = document.querySelector('.shutter-btn');
  const shutterSound = document.getElementById('shutterSound');
  const flash = document.querySelector('.flash');
  const gallery = document.querySelector('.gallery');
  let currentIndex = 0;
  const images = ['img/1.jpg', 'img/2.jpg', 'img/3.jpg', 'img/4.jpg', 'img/5.jpg'];
  let isCountingDown = false;
  
  camera.classList.add('paused');
  
  // 创建倒计时元素
  const countdownEl = document.createElement('div');
  countdownEl.className = 'countdown';
  countdownEl.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 100px;
    color: white;
    text-shadow: 0 0 10px rgba(0,0,0,0.5);
    z-index: 100;
    opacity: 0;
    transition: all 0.3s ease;
  `;
  camera.appendChild(countdownEl);
  
  shutterBtn.addEventListener('click', function() {
    if (isCountingDown) return; // 防止重复点击
    isCountingDown = true;
    
    if (!camera.classList.contains('clicked')) {
      camera.classList.add('clicked');
    }
    
    if (currentIndex >= images.length) {
      alert('胶片已用完 让老公给你买');
      isCountingDown = false;
      return;
    }
    
    // 开始倒计时
    let count = 3;
    countdownEl.style.opacity = '1';
    
    const countdown = setInterval(() => {
      if (count > 0) {
        countdownEl.textContent = count;
        // 添加缩放动画
        countdownEl.style.transform = 'translate(-50%, -50%) scale(1.2)';
        setTimeout(() => {
          countdownEl.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 200);
        count--;
      } else {
        clearInterval(countdown);
        countdownEl.style.opacity = '0';
        
        // 播放快门声
        shutterSound.play();
        
        // 闪光灯效果
        flash.classList.add('active');
        setTimeout(() => flash.classList.remove('active'), 200);
        
        // 添加打印动画
        camera.classList.remove('paused');
        
        // 延迟创建照片展示，等待打印动画完成
        setTimeout(() => {
          // 先暂停相机动画
          camera.classList.add('paused');
          
          // 等待2秒后再显示在相册中
          setTimeout(() => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.style.backgroundImage = `url('${images[currentIndex]}')`;
            gallery.appendChild(item);
            currentIndex++;
            isCountingDown = false; // 重置倒计时状态
          }, 2000);
          
        }, 3000);
      }
    }, 1000);
  });
}