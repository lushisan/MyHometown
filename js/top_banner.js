function Carousel($node) {
            this.$pic = $node.find('.pic')	//ul
            this.$picWidth = this.$pic.children().width()  	//宽度
            this.picLength = this.$pic.children().length    //图片数量
            this.$btnPrev = $node.find('.btn-prev')    //前滚按钮
            this.$btnNext = $node.find('.btn-next')	   //后滚按钮
            this.$pageIndex = $node.find('.pageIndex') //导航小点
            this.mark = 0  //计数用
            this.lock = false  //用来锁定的，原作者并没有写锁定函数
            this.init()
            this.bind()
            this.autoPlay()
            this.lockPic()
        }


        Carousel.prototype = {
        //初始化
        	init: function() {
	        	var $picFirst = this.$pic.children().eq(0).clone(),
	        	$picLast = this.$pic.children().eq(this.picLength - 1).clone()
	                this.$pic.prepend($picLast)//前插一个li
	                this.$pic.append($picFirst)//后加一个li
	                this.$pic.width(this.$picWidth * this.$pic.children().length)//设置ul长度
	                this.$pic.css({
	                	'left': -this.$picWidth
	                })//隐藏第一个li

	                for (var i = 0; i < this.picLength; i++) {
	                	var $li = $('<li></li>')
	                	this.$pageIndex.append($li)
	                }//创建html

	                this.$pageIndex.children().eq(0).addClass('active')//初始第一个导航设为活动
            },
        //播放下一个
            playNext: function() {
            	var _this = this//把实例赋值给_this，下面的回调函数会导致this指向全局，所以这里先保存this
            	if (this.lock) {//锁定图片
            		return
            	} else {
            		this.lock = true
            		this.$pic.animate({
            			'left': '-=' + this.$picWidth//整个ul向左平移一个图片的长度
            		}, function() {
            			_this.mark++//计数+1
            			if (_this.mark === _this.picLength) {//当计数=4
            				_this.$pic.css('left', -_this.$picWidth)//将ul的位置还原
            				_this.mark = 0//还原计数
            			}
            			_this.lock = false
            			_this.showBullet()//设置导航小点样式
            		})
            	}
            },

        //播放上一个
            playPrev: function() {
            	var _this = this
            	if (this.lock) {
            		return
            	} else {
            		this.lock = true
            		this.$pic.animate({
            			'left': '+=' + this.$picWidth
            		}, function() {
            			_this.mark--
            			if (_this.mark < 0) {
            				_this.$pic.css('left', -(_this.picLength * _this.$picWidth))
            				_this.mark = _this.picLength - 1
            			}
            			_this.lock = false
            			_this.showBullet()
            		})
            	}
            },
        //设置导航小点样式
            showBullet: function() {
            	this.$pageIndex.children().removeClass('active')
            	this.$pageIndex.children().eq(this.mark).addClass('active')

            },
        //绑定事件
            bind: function() {
            	var _this = this

            	this.$btnNext.on('click', function() {
            		_this.playNext()

            	})

            	this.$btnPrev.on('click', function() {
            		_this.playPrev()

            	})
            	//绑定导航小点事件
            	this.$pageIndex.on('click', 'li', function() {
            		_this.mark = _this.$pageIndex.children().index($(this))//设置计数
            		_this.showBullet()
            		_this.$pic.animate({
            			'left': -(_this.mark + 1) * _this.$picWidth//设置位移
            		})
            		clearInterval(timer)//清除原来的计时器，否则在下一次切换的时候会很奇怪
            		_this.autoPlay()//重新播放
            	})

            },
        //自动播放下一张
            autoPlay: function() {
            	var _this = this
            	timer = setInterval(function() {
            		_this.playNext()
            	}, 3000)//3s调用一次播放下一张函数
            },
        //（自添加）锁定图片
            lockPic: function() {
            	var _this = this
            	this.$pic.mouseenter(function(){
            		_this.lock = true
            	})//鼠标移入播放暂停
            	this.$pic.mouseleave(function(){
            		_this.lock = false
            	})//鼠标移出播放重新开始
            }
        }

        new Carousel($('.window'))