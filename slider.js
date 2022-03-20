L.Control.SliderControl = L.Control.extend({
    options: {
        position: 'topright',
        layers: null,
        maxValue: -1,
        minValue: -1,
        markers: null,
        range: false,
        follow: false
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
        this._layer = this.options.layer;

    },

    setPosition: function (position) {
        var map = this._map;

        if (map) {
            map.removeControl(this);
        }

        this.options.position = position;

        if (map) {
            map.addControl(this);
        }
        this.startSlider();
        return this;
    },

    onAdd: function (map) {
        this.options.map = map;

       
        var sliderContainer = L.DomUtil.create('div', 'slider', this._container);
        $(sliderContainer).append('<div id="leaflet-slider" style="width:200px"><div class="ui-slider-handle"></div><div id="slider-timestamp" style="width:200px; margin-top:10px;background-color:#FFFFFF"></div></div>');
      
        $(sliderContainer).mousedown(function () {
            map.dragging.disable();
        });
        $(document).mouseup(function () {
            map.dragging.enable();
            
            $('#slider-timestamp').html('');
        });

        var options = this.options;
        this.options.markers = [];

   
        if (this._layer) {
            this._layer.eachLayer(function (layer) {
                if (options.minValue === -1) {
                    options.minValue = layer._leaflet_id;
                }
                options.maxValue = layer._leaflet_id;
                options.markers[layer._leaflet_id] = layer;
            });
            this.options = options;
        } else {
            console.log("Error: You have to specify a layer via new slider!({layer: your_layer});");
        }
        return sliderContainer;
    },

    onRemove: function (map) {
        
        for (i = this.options.minValue; i < this.options.maxValue; i++) {
            map.removeLayer(this.options.markers[i]);
        }
        $('#leaflet-slider').remove();
    },

    startSlider: function () {
        _options = this.options;
        $("#leaflet-slider").slider({
            range: _options.range,
            value: _options.minValue + 1,
            min: _options.minValue,
            max: _options.maxValue +1,
            step: 1,
            slide: function (e, ui) {
                var map = _options.map;
                if(!!_options.markers[ui.value]) {
                    
                    if(_options.markers[ui.value].feature !== undefined) {
                        if(_options.markers[ui.value].feature.properties.issueddate){
                            if(_options.markers[ui.value]) $('#slider-timestamp').html(_options.markers[ui.value].feature.properties.issueddate);
                        }else {
                            console.error("You have to have a time property");
                        }
                    }else {
                        
                        if(_options.markers [ui.value].options.time){
                            if(_options.markers[ui.value]) $('#slider-timestamp').html(_options.markers[ui.value].options.issueddate.substr(0, 19));
                        }else {
                            console.error("You have to have a time property")
                        }
                    }
                    
                    var i;
                    if(_options.range){
                        
                        for (i = ui.values[0]; i <= ui.values[1]; i++){
                           if(_options.markers[i]) map.addLayer(_options.markers[i]);
                        }
                        for (i = _options.maxValue; i > ui.values[1]; i--) {
                            if(_options.markers[i]) map.removeLayer(_options.markers[i]);
                        }
                        for (i = _options.minValue; i < ui.values[0]; i++) {
                            if(_options.markers[i]) map.removeLayer(_options.markers[i]);
                        }
                    }else if(_options.follow){
                        for (i = _options.minValue; i < (ui.value - _options.follow); i++) {
                            if(_options.markers[i]) map.removeLayer(_options.markers[i]);
                        }
                        for (i = (ui.value - _options.follow); i < ui.value ; i++) {
                            if(_options.markers[i]) map.addLayer(_options.markers[i]);
                        }
                        for (i = ui.value; i <= _options.maxValue; i++) {
                            if(_options.markers[i]) map.removeLayer(_options.markers[i]);
                        }
                    }else{
                        // jquery ui for point before
                        for (i = _options.minValue; i <= ui.value ; i++) {
                            if(_options.markers[i]) map.addLayer(_options.markers[i]);
                        }
                        for (i = (ui.value + 1); i <= _options.maxValue; i++) {
                            if(_options.markers[i]) map.removeLayer(_options.markers[i]);
                        }
                    }
                }
            }
        });
        _options.map.addLayer(_options.markers[_options.minValue]);
    }
});

L.control.sliderControl = function (options) {
    return new L.Control.SliderControl(options);
};