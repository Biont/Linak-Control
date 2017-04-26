"use strict";

exports.__esModule = true;

var _BiontView = require("./BiontView.js");

var _BiontView2 = _interopRequireDefault(_BiontView);

var _ScheduleItemView = require("./ScheduleItemView");

var _ScheduleItemView2 = _interopRequireDefault(_ScheduleItemView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListView = function (_BiontView$extend) {
    _inherits(ListView, _BiontView$extend);

    /**
     * Initialize this class
     */
    function ListView(data, options) {
        _classCallCheck(this, ListView);

        var _this = _possibleConstructorReturn(this, _BiontView$extend.call(this, data, options));

        _this.view = data.view || _ScheduleItemView2.default;
        _this.listenTo(_this.collection, "sync", _this.render);
        // this.listenTo(this.collection, "change", this.render);
        _this._views = new Map();
        _this.$el.empty();
        return _this;
    }

    /**
     * Handle output
     */


    ListView.prototype.render = function render() {
        var _this2 = this;

        /**
         * Don't render if the list cannot be seen.
         * Keep an eye on this and see if it causes problems
         */
        if (!this.$el.is(':visible')) {
            return this;
        }
        if (this.collection.isEmpty()) {
            return this;
        }
        // let models = this.collection.filter(this.filterItem.bind(this));
        var models = this.collection.models;
        this.removeObsoleteViews(models);

        //TODO This is an example for how we could sort the models before rendering
        // However, since the actual rendering code cannot re-sort on the fly,
        // it will only work the first time the list is rendered.

        // let pinStatus = [ 'active' ];
        // console.log( pinStatus );
        // if ( pinStatus ) {
        // 	models = _.sortBy( models, ( model )=> {
        // 		let index = jQuery.inArray( model.get( 'status' ), pinStatus );
        // 		return index !== -1 ? index : models.length;
        // 	} );
        // }
        // debugger;

        var curView = void 0;
        models.forEach(function (item) {
            if (!_this2._views.has(item)) {
                var viewArgs = {
                    tagName: 'li',
                    model: item
                };
                if (_this2.rowActionsView) {
                    viewArgs.rowActionsView = _this2.rowActionsView;
                }
                var itemView = new _this2.view(viewArgs);
                _this2._views.set(item, itemView);
                var $el = itemView.render().$el;

                /**
                 * Keep sort order
                 */
                if (curView === undefined) {
                    _this2.$el.prepend($el);
                } else {
                    $el.insertAfter(curView.$el);
                }

                $el.css('display', 'none').slideDown(275);
            }

            curView = _this2._views.get(item);
        });
        return this;
    };

    /**
     * Walks over the views map and kills all
     * views that are not present in the current selection of models
     *
     * @param models
     */


    ListView.prototype.removeObsoleteViews = function removeObsoleteViews(models) {
        var _this3 = this;

        this._views.forEach(function (view, model) {
            if (jQuery.inArray(model, models) === -1) {
                _this3._views.get(model).remove();
                _this3._views.delete(model);
            }
        });
    };

    /**
     * Filter callback.
     *
     * Checks if the current item status is present in this ViewCollection's allowed status
     *
     * @param item
     * @returns {boolean}
     */


    ListView.prototype.filterItem = function filterItem(item) {
        return true;
        return jQuery.inArray(item.get('status'), this.filterStatus) !== -1;
    };

    return ListView;
}(_BiontView2.default.extend({
    tagName: 'ul',
    events: {}
}));

exports.default = ListView;
//# sourceMappingURL=ListView.js.map
