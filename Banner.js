function Banner($bannerWrapper, options) {
    var _this = this;

    if (options) {
        this.initFunctions = options.initFunctions;
    }
    // 当前元素记录
    this._index = 0;
    // 滑动位置记录
    this._slideIndex = 0;
    this.$bannerWrapper = $bannerWrapper;
    this.$bannerList = $bannerWrapper.find('.banner-list');
    this.$bannerItems = this.$bannerList.find('.banner-item');
    this._itemCount = this.$bannerItems.length;
    this.$bannerLabels = $bannerWrapper.next('.banner-labels');

    // banner item 初始化
    if (this.initFunctions && this.initFunctions[this._index]) {
        this.initFunctions[this._index].call(this, this.$bannerItems.eq(this._index));
        this.initFunctions[this._index] = null;
    }

    this.$bannerWrapper.off('tap.slide').on('tap.slide', '.arrow-right', function(e) {
        _this.doSlide(1);
        // _this.restart();
    }).on('tap.slide', '.arrow-left', function(e) {
        _this.doSlide(-1);
        // _this.restart();
    });

    var startX = null;
    var startY = null;
    var prevX = null;
    var prevY = null;
    var swipeFlag =  null;
    var isSwipeRight = true;
    this.$bannerWrapper.on('touchstart', function(e) {
        startX = prevX = e.touches[0].pageX;
        startY = prevY = e.touches[0].pageY;
        // console.log(startX, startY);
        swipeFlag = null;
    }).on('touchmove', function(e) {
        if (swipeFlag === null) {
            if (Math.abs(e.touches[0].pageX - prevX) - Math.abs(e.touches[0].pageY - prevY) > 0) {
                
                isSwipeRight = e.touches[0].pageX - prevX > 0;

                prevX = e.touches[0].pageX;
                prevY = e.touches[0].pageY;
                swipeFlag = true;
                // console.log(prevX, prevY);
                
                return false;
            } else {
                swipeFlag = false;
            }
        } else if (swipeFlag) {
            // alert(isSwipeRight);
            if (e.touches[0].pageX - prevX > 0 !== isSwipeRight) {
                prevX = e.touches[0].pageX;
                prevY = e.touches[0].pageY;
                swipeFlag = false;
            } else {
                return false;
            }
        }
    }).on('touchend', function(e) {
        if (swipeFlag) {
            if (isSwipeRight) {
                _this.doSlide(-1);
            } else {
                _this.doSlide(1);
            }
            
            return false;
        }
    });
}

Banner.prototype.SLIDE_TIME = 400;
Banner.prototype.AUTO_SLIDE_TIME = 6000;

Banner.prototype.doSlide = function(step) {
    var _this = this;
    var prevIndex = _this._index;

    this._index += step;

    if (step > 0) {
        this._slideIndex++;
    } else if (step < 0) {
        this._slideIndex--;
    }

    if (this._index < 0) {
        this._index = this._itemCount - 1;
    } else {
        this._index = this._index % this._itemCount;
    }
    
    this.$bannerItems.eq(_this._index).css({
        "left": this._slideIndex * 100 + '%'
    });

    this.$bannerList.animate({ 
        translateX: (0 - this._slideIndex * 100) + '%'
    }, this.SLIDE_TIME, function(e) {
        // banner item 初始化
        if (_this.initFunctions && _this.initFunctions[_this._index]) {
            _this.initFunctions[_this._index].call(_this, _this.$bannerItems.eq(_this._index));
            _this.initFunctions[_this._index] = null;
        }

    });
    
    if (_this.$bannerLabels.length) {
        _this.$bannerLabels.children('.banner-label').eq(_this._index).addClass('active').siblings('.active').removeClass('active');
    }
};