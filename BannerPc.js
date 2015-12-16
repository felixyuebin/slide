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
    this.$bannerLabels = $bannerWrapper.find('.banner-labels');

    this.init = function() {

        // banner item 初始化
        if (this.initFunctions && this.initFunctions[this._index]) {
            this.initFunctions[this._index].call(this, this.$bannerItems.eq(this._index));
            this.initFunctions[this._index] = null;
        }

        this.$bannerWrapper.off('click.slide').on('click.slide', '.arrow-right', function(e) {
            _this.doSlide(1);
            // _this.restart();
        }).on('click.slide', '.arrow-left', function(e) {
            _this.doSlide(-1);
            // _this.restart();
        });

        // 标志点击事件
        if (this.$bannerLabels.length) {
            this.$bannerLabels.off('click.slide').on('click.slide', '.banner-label', function(e) {
                var $target = $(this);
                if (!$target.hasClass('active')) {
                    var nextIndex = $target.index();
                    _this.doSlide(nextIndex - _this._index);

                    // _this.restart();
                }
            });
        };

        // this.start();
    };

    // this.autoSlide = function() {
    //     _this.doSlide(1);
    //     clearTimeout(this.autoSlideTimer);
    //     _this.autoSlideTimer = setTimeout(_this.autoSlide, _this.AUTO_SLIDE_TIME);
    // };


    // this.start = function() {
    //     clearTimeout(this.autoSlideTimer);
    //     _this.autoSlideTimer = setTimeout(_this.autoSlide, _this.AUTO_SLIDE_TIME);
    // };

    // this.restart = function() {
    //     this.stop();
    //     this.start();
    // };

    // this.stop = function() {
    //     clearTimeout(this.autoSlideTimer);
    // };
};

Banner.prototype.SLIDE_TIME = 800;
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
        "left": this._slideIndex * 100 + '%',
        "display": 'block'
    });

    this.$bannerList.animate({ 
        left: (0 - this._slideIndex * 100) + '%'
    }, this.SLIDE_TIME, 'linear', function(e) {
        _this.$bannerItems.eq(prevIndex).css({
            "display": 'none'
        });
        // banner item 初始化
        if (_this.initFunctions && _this.initFunctions[_this._index]) {
            _this.initFunctions[_this._index].call(_this, _this.$bannerItems.eq(_this._index));
            _this.initFunctions[_this._index] = null;
        }

    });
    
    if (_this.$bannerLabels.length) {
        _this.$bannerLabels.children('.banner-label').eq(_this._index).addClass('active').siblings('.active').removeClass('active');
    }
}
